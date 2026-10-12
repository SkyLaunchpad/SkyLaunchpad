import { encodeDeployData, encodeFunctionData, toHex, type Address, type Hex } from "viem";
import { curveAbi, factoryAbi, factoryBytecode, tokenAbi } from "./artifacts";
import { CHAIN_ID, CHAIN_ID_HEX, CHAIN_NAME, EXPLORER, RPC_PUBLIC } from "./params";
import type { Relay } from "./reads";

export type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
};

export function getEthereum(): EthereumProvider | null {
  if (typeof window === "undefined") return null;
  const eth = (window as unknown as { ethereum?: EthereumProvider }).ethereum;
  if (!eth || typeof eth.request !== "function") return null;
  return eth;
}

export async function readSilentAccount(eth: EthereumProvider): Promise<{
  address: Address | null;
  chainId: number | null;
}> {
  const [accounts, chain] = await Promise.all([
    eth.request({ method: "eth_accounts" }),
    eth.request({ method: "eth_chainId" }),
  ]);
  const list = Array.isArray(accounts) ? accounts : [];
  const address = typeof list[0] === "string" ? (list[0] as Address) : null;
  const chainId = typeof chain === "string" ? Number(chain) : null;
  return { address, chainId };
}

export async function connectWallet(eth: EthereumProvider): Promise<Address> {
  const accounts = await eth.request({ method: "eth_requestAccounts" });
  const list = Array.isArray(accounts) ? accounts : [];
  if (typeof list[0] !== "string") throw new Error("Wallet returned no account.");
  return list[0] as Address;
}

export async function ensureRobinhood(eth: EthereumProvider): Promise<void> {
  const current = await eth.request({ method: "eth_chainId" });
  if (typeof current === "string" && Number(current) === CHAIN_ID) return;
  try {
    await eth.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: CHAIN_ID_HEX }],
    });
  } catch (error) {
    const code = (error as { code?: number }).code;
    const message = error instanceof Error ? error.message : String(error);
    if (code === 4902 || /4902|unrecognized chain|wallet_addEthereumChain/i.test(message)) {
      await eth.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: CHAIN_ID_HEX,
            chainName: CHAIN_NAME,
            nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
            rpcUrls: [RPC_PUBLIC],
            blockExplorerUrls: [EXPLORER],
          },
        ],
      });
      return;
    }
    throw error;
  }
}

export type TxRequest = {
  from: Address;
  to?: Address;
  data: Hex;
  value?: bigint;
};

export async function estimateOrThrow(relay: Relay, tx: TxRequest): Promise<void> {
  await relay([
    {
      method: "eth_estimateGas",
      params: [
        {
          from: tx.from,
          to: tx.to,
          data: tx.data,
          value: tx.value != null ? toHex(tx.value) : undefined,
        },
      ],
    },
  ]);
}

export async function sendTx(eth: EthereumProvider, tx: TxRequest): Promise<Hex> {
  const hash = await eth.request({
    method: "eth_sendTransaction",
    params: [
      {
        from: tx.from,
        to: tx.to,
        data: tx.data,
        value: tx.value != null ? toHex(tx.value) : "0x0",
      },
    ],
  });
  if (typeof hash !== "string" || !hash.startsWith("0x")) {
    throw new Error("Wallet did not return a transaction hash.");
  }
  return hash as Hex;
}

export type TxReceipt = {
  ok: boolean;
  contractAddress: Address | null;
  logs: { address: string; topics: Hex[]; data: Hex }[];
};

export async function waitForReceipt(relay: Relay, hash: Hex): Promise<TxReceipt> {
  for (let attempt = 0; attempt < 40; attempt++) {
    const [receipt] = await relay([{ method: "eth_getTransactionReceipt", params: [hash] }]);
    if (receipt && typeof receipt === "object") {
      const row = receipt as {
        status?: string;
        contractAddress?: string | null;
        logs?: { address?: string; topics?: string[]; data?: string }[];
      };
      const ok = row.status === "0x1" || row.status === "1";
      const contractAddress =
        typeof row.contractAddress === "string" && row.contractAddress.startsWith("0x")
          ? (row.contractAddress as Address)
          : null;
      const logs = (row.logs ?? []).map((log) => ({
        address: String(log.address ?? ""),
        topics: (log.topics ?? []) as Hex[],
        data: (log.data ?? "0x") as Hex,
      }));
      return { ok, contractAddress, logs };
    }
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }
  throw new Error("The transaction is still pending. Check the explorer for the hash.");
}

export function factoryInitData(protocol: Address): Hex {
  return encodeDeployData({ abi: factoryAbi, bytecode: factoryBytecode, args: [protocol] });
}

export function launchCalldata(
  name: string,
  symbol: string,
  logo: string,
  description: string,
  socials: { twitter: string; telegram: string; discord: string; website: string; farcaster: string },
  quote: Address,
  buyAmount: bigint,
  taxBps: number,
  team: Address[],
  minTokens: bigint,
): Hex {
  return encodeFunctionData({
    abi: factoryAbi,
    functionName: "launch",
    args: [
      {
        name,
        symbol,
        logo,
        description,
        socials,
        quote,
        buyAmount,
        taxBps,
        team,
        minTokens,
      },
    ],
  });
}

export function buyCalldata(recipient: Address, minTokens: bigint): Hex {
  return encodeFunctionData({ abi: curveAbi, functionName: "buy", args: [recipient, minTokens] });
}

export function buyQuoteCalldata(recipient: Address, amount: bigint, minTokens: bigint): Hex {
  return encodeFunctionData({
    abi: curveAbi,
    functionName: "buyQuote",
    args: [recipient, amount, minTokens],
  });
}

export function sellCalldata(tokensIn: bigint, minEth: bigint): Hex {
  return encodeFunctionData({ abi: curveAbi, functionName: "sell", args: [tokensIn, minEth] });
}

export function approveCalldata(spender: Address, amount: bigint): Hex {
  return encodeFunctionData({ abi: tokenAbi, functionName: "approve", args: [spender, amount] });
}

export function buildMetadata(description: string): string {
  const trimmed = description.trim();
  if (!trimmed) return "";
  const uri = `data:application/json,${encodeURIComponent(JSON.stringify({ description: trimmed }))}`;
  if (new TextEncoder().encode(uri).length > 480) {
    throw new Error("Description is too long to store on chain. Keep it under about 140 characters.");
  }
  return uri;
}
