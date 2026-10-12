import { concat, encodeAbiParameters, encodeDeployData, encodeFunctionData, getContractAddress, getCreate2Address, keccak256, toHex, type Address, type Hex } from "viem";
import { curveAbi, factoryAbi, factoryBytecode, hookBytecode, poolAbi, rewardsAbi, tokenAbi } from "./artifacts";
import { CHAIN_ID, CHAIN_ID_HEX, CHAIN_NAME, EXPLORER, RPC_PUBLIC, V4_POOL_MANAGER, V4_QUOTER } from "./params";
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

export function factoryInitData(protocol: Address, hookSalt: Hex): Hex {
  return encodeDeployData({ abi: factoryAbi, bytecode: factoryBytecode, args: [protocol, hookSalt] });
}

const HOOK_MASK = 0x3fffn;
const HOOK_FLAG = 0x2244n;

/** Salt whose CREATE2 address has the Sky hook permission bits and no others. */
export function mineHookSalt(factory: Address): Hex {
  const rewards = getContractAddress({ from: factory, nonce: 4n });
  const init = concat([
    hookBytecode,
    encodeAbiParameters([{ type: "address" }, { type: "address" }], [V4_POOL_MANAGER, rewards]),
  ]);
  const bytecodeHash = keccak256(init);
  for (let i = 0; i < 500_000; i++) {
    const salt = toHex(i, { size: 32 });
    const addr = getCreate2Address({ from: factory, salt, bytecodeHash });
    if ((BigInt(addr) & HOOK_MASK) === HOOK_FLAG) return salt;
  }
  throw new Error("Could not find a Uniswap hook address. Try the deploy again.");
}

export async function pendingNonce(eth: EthereumProvider, account: Address): Promise<number> {
  const nonce = await eth.request({ method: "eth_getTransactionCount", params: [account, "pending"] });
  return Number(nonce);
}

export function predictedFactory(account: Address, nonce: number): Address {
  return getContractAddress({ from: account, nonce: BigInt(nonce) });
}

export function openPoolCalldata(): Hex {
  return encodeFunctionData({ abi: curveAbi, functionName: "openPool", args: [] });
}

export function pendingRewardsCalldata(token: Address, user: Address): Hex {
  return encodeFunctionData({ abi: rewardsAbi, functionName: "pending", args: [token, user] });
}

export function claimRewardsCalldata(token: Address): Hex {
  return encodeFunctionData({ abi: rewardsAbi, functionName: "claim", args: [token] });
}

export function tradeCalldata(
  token: Address,
  quote: Address,
  buyingToken: boolean,
  amountIn: bigint,
  minOut: bigint,
  recipient: Address,
): Hex {
  return encodeFunctionData({
    abi: poolAbi,
    functionName: "trade",
    args: [token, quote, buyingToken, amountIn, minOut, recipient],
  });
}

export function quoteV4Calldata(token: Address, quote: Address, hook: Address, zeroForOne: boolean, amountIn: bigint): Hex {
  const currency0 = token.toLowerCase() < quote.toLowerCase() ? token : quote;
  const currency1 = currency0 === token ? quote : token;
  return encodeFunctionData({
    abi: [
      {
        type: "function",
        name: "quoteExactInputSingle",
        stateMutability: "nonpayable",
        inputs: [
          {
            name: "params",
            type: "tuple",
            components: [
              {
                name: "poolKey",
                type: "tuple",
                components: [
                  { name: "currency0", type: "address" },
                  { name: "currency1", type: "address" },
                  { name: "fee", type: "uint24" },
                  { name: "tickSpacing", type: "int24" },
                  { name: "hooks", type: "address" },
                ],
              },
              { name: "zeroForOne", type: "bool" },
              { name: "exactAmount", type: "uint128" },
              { name: "hookData", type: "bytes" },
            ],
          },
        ],
        outputs: [
          { name: "amountOut", type: "uint256" },
          { name: "gasEstimate", type: "uint256" },
        ],
      },
    ],
    functionName: "quoteExactInputSingle",
    args: [
      {
        poolKey: { currency0, currency1, fee: 3000, tickSpacing: 60, hooks: hook },
        zeroForOne,
        exactAmount: amountIn,
        hookData: "0x",
      },
    ],
  });
}

export function zeroForOne(token: Address, quote: Address, buyingToken: boolean): boolean {
  const quoteIsCurrency0 = quote.toLowerCase() < token.toLowerCase();
  return buyingToken ? quoteIsCurrency0 : !quoteIsCurrency0;
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
  feeWallet: Address,
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
        feeWallet,
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
