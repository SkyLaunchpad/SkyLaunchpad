import {
  decodeFunctionResult,
  encodeFunctionData,
  zeroAddress,
  type Address,
  type Hex,
} from "viem";
import {
  curveAbi,
  curveDeployedBytecode,
  factoryAbi,
  factoryDeployedBytecode,
  tokenAbi,
  tokenDeployedBytecode,
} from "./artifacts";
import { cloneTarget, sameCode } from "./clone";
import { CHAIN_ID, EXPECTED_PARAMS, VERSION } from "./params";
import type { RpcCall, RpcItem } from "./rpc";

export type Relay = (calls: RpcCall[]) => Promise<unknown[]>;

export type FactoryInfo = {
  protocol: Address;
  tokenImplementation: Address;
  curveImplementation: Address;
  launchCount: bigint;
  version: string;
};

export type LaunchRow = {
  token: Address;
  curve: Address;
  creator: Address;
  name: string;
  symbol: string;
  metadataUri: string;
  launchedAt: number;
  virtualEth: bigint;
  virtualToken: bigint;
  realEth: bigint;
  marketCap: bigint;
  progressBps: bigint;
  graduated: boolean;
  spotPrice: bigint;
  logo: string;
  quote: Address;
  quoteSymbol: string;
};

export type PrintRow = {
  time: number;
  ethAmount: bigint;
  tokenAmount: bigint;
  isBuy: boolean;
  trader: Address;
};

export type MarketDetail = {
  curve: Address;
  token: Address;
  creator: Address;
  protocol: Address;
  factory: Address;
  name: string;
  symbol: string;
  metadataUri: string;
  totalSupply: bigint;
  launchedAt: number;
  virtualEth: bigint;
  virtualToken: bigint;
  realEth: bigint;
  marketCap: bigint;
  progressBps: bigint;
  graduated: boolean;
  spotPrice: bigint;
  logo: string;
  quote: Address;
  quoteSymbol: string;
  history: { cap: bigint; time: number }[];
  prints: PrintRow[];
};

export type Holding = { eth: bigint; tokens: bigint; allowance: bigint; quoteBalance: bigint; quoteAllowance: bigint };

export function unwrap(items: RpcItem[]): unknown[] {
  return items.map((item, index) => {
    if (!item || item.error) {
      const message = item?.error?.message || `Robinhood RPC call ${index + 1} failed.`;
      throw new Error(message.replace("execution reverted: ", "").replace("execution reverted", "The contract rejected the call."));
    }
    return item.result;
  });
}

function pick<T>(value: unknown, index: number, name?: string): T {
  if (Array.isArray(value)) return value[index] as T;
  if (value && typeof value === "object") {
    const record = value as Record<string, T>;
    if (name && name in record) return record[name];
    if (String(index) in record) return record[index];
  }
  throw new Error("Robinhood Chain returned an unexpected value.");
}

function asHex(value: unknown, label: string): Hex {
  if (typeof value !== "string" || !value.startsWith("0x")) {
    throw new Error(`Missing ${label} from Robinhood Chain.`);
  }
  return value as Hex;
}

async function batch(relay: Relay, calls: RpcCall[]): Promise<unknown[]> {
  return relay(calls);
}

export async function readChain(relay: Relay): Promise<{ chainId: number; block: bigint; gas: bigint }> {
  const [chainId, block, gas] = await batch(relay, [
    { method: "eth_chainId", params: [] },
    { method: "eth_blockNumber", params: [] },
    { method: "eth_gasPrice", params: [] },
  ]);
  const id = Number(chainId);
  if (id !== CHAIN_ID) {
    throw new Error(`Connected RPC is chain ${id || "unknown"}, not Robinhood mainnet (${CHAIN_ID}).`);
  }
  return { chainId: id, block: BigInt(String(block)), gas: BigInt(String(gas)) };
}

function call(to: Address, data: Hex): RpcCall {
  return { method: "eth_call", params: [{ to, data }, "latest"] };
}

export async function readFactory(
  relay: Relay,
  factory: Address,
): Promise<{ info: FactoryInfo; launches: LaunchRow[] }> {
  const [code, chainId] = await batch(relay, [
    { method: "eth_getCode", params: [factory, "latest"] },
    { method: "eth_chainId", params: [] },
  ]);
  if (Number(chainId) !== CHAIN_ID) {
    throw new Error("RPC is not Robinhood Chain mainnet.");
  }
  if (!sameCode(String(code), factoryDeployedBytecode)) {
    throw new Error("That address is not the SkyLaunchpad factory from this build. Refusing to read it.");
  }

  const versionData = encodeFunctionData({ abi: factoryAbi, functionName: "version", args: [] });
  const paramData = encodeFunctionData({ abi: factoryAbi, functionName: "parameters", args: [] });
  const tokenImplData = encodeFunctionData({ abi: factoryAbi, functionName: "tokenImplementation", args: [] });
  const curveImplData = encodeFunctionData({ abi: factoryAbi, functionName: "curveImplementation", args: [] });
  const protocolData = encodeFunctionData({ abi: factoryAbi, functionName: "protocol", args: [] });
  const countData = encodeFunctionData({ abi: factoryAbi, functionName: "launchCount", args: [] });
  const newestData = encodeFunctionData({ abi: factoryAbi, functionName: "newest", args: [40n] });

  const [versionR, paramsR, tokenImplR, curveImplR, protocolR, countR, newestR] = await batch(relay, [
    call(factory, versionData),
    call(factory, paramData),
    call(factory, tokenImplData),
    call(factory, curveImplData),
    call(factory, protocolData),
    call(factory, countData),
    call(factory, newestData),
  ]);

  const version = decodeFunctionResult({ abi: factoryAbi, functionName: "version", data: asHex(versionR, "version") });
  if (version !== VERSION) throw new Error(`Factory version is ${version}, this app expects ${VERSION}.`);

  const params = decodeFunctionResult({
    abi: factoryAbi,
    functionName: "parameters",
    data: asHex(paramsR, "parameters"),
  });
  const got = [0, 1, 2, 3, 4, 5, 6].map((index) => pick<bigint>(params, index));
  if (got.some((value, i) => value !== EXPECTED_PARAMS[i])) {
    throw new Error("Factory economics don't match this app. Refusing to list markets.");
  }

  const tokenImplementation = decodeFunctionResult({
    abi: factoryAbi,
    functionName: "tokenImplementation",
    data: asHex(tokenImplR, "token implementation"),
  });
  const curveImplementation = decodeFunctionResult({
    abi: factoryAbi,
    functionName: "curveImplementation",
    data: asHex(curveImplR, "curve implementation"),
  });
  const [tokenCode, curveCode] = await batch(relay, [
    { method: "eth_getCode", params: [tokenImplementation, "latest"] },
    { method: "eth_getCode", params: [curveImplementation, "latest"] },
  ]);
  if (!sameCode(String(tokenCode), tokenDeployedBytecode) || !sameCode(String(curveCode), curveDeployedBytecode)) {
    throw new Error("Factory implementations don't match this build.");
  }

  const protocol = decodeFunctionResult({
    abi: factoryAbi,
    functionName: "protocol",
    data: asHex(protocolR, "protocol"),
  });
  const launchCount = decodeFunctionResult({
    abi: factoryAbi,
    functionName: "launchCount",
    data: asHex(countR, "launch count"),
  });
  const rows = decodeFunctionResult({
    abi: factoryAbi,
    functionName: "newest",
    data: asHex(newestR, "launches"),
  });

  const launches: LaunchRow[] = rows.map((row) => ({
    token: pick(row, 0, "token"),
    curve: pick(row, 1, "curve"),
    creator: pick(row, 2, "creator"),
    name: pick(row, 3, "name"),
    symbol: pick(row, 4, "symbol"),
    metadataUri: pick(row, 5, "metadataUri"),
    launchedAt: Number(pick<bigint>(row, 6, "launchedAt")),
    virtualEth: pick(row, 7, "virtualEth"),
    virtualToken: pick(row, 8, "virtualToken"),
    realEth: pick(row, 9, "realEth"),
    marketCap: pick(row, 10, "marketCap"),
    progressBps: pick(row, 11, "progressBps"),
    graduated: pick(row, 12, "graduated"),
    spotPrice: pick(row, 13, "spotPrice"),
    logo: "",
    quote: zeroAddress,
    quoteSymbol: "ETH",
  }));

  if (launches.length > 0) {
    const quoteData = encodeFunctionData({ abi: curveAbi, functionName: "quote", args: [] });
    for (let start = 0; start < launches.length; start += 20) {
      const slice = launches.slice(start, start + 20);
      const quoteResults = await batch(
        relay,
        slice.map((row) => call(row.curve, quoteData)),
      );
      for (let i = 0; i < slice.length; i++) {
        try {
          slice[i].quote = decodeFunctionResult({
            abi: curveAbi,
            functionName: "quote",
            data: asHex(quoteResults[i], "quote"),
          });
        } catch {
          slice[i].quote = zeroAddress;
        }
        slice[i].quoteSymbol = slice[i].quote === zeroAddress ? "ETH" : slice[i].quote.slice(0, 6);
      }
      const named = slice.filter((row) => row.quote !== zeroAddress);
      if (named.length === 0) continue;
      const symbols = await batch(
        relay,
        named.map((row) => call(row.quote, encodeFunctionData({ abi: tokenAbi, functionName: "symbol", args: [] }))),
      );
      named.forEach((row, index) => {
        try {
          const symbol = decodeFunctionResult({
            abi: tokenAbi,
            functionName: "symbol",
            data: asHex(symbols[index], "symbol"),
          });
          if (symbol) row.quoteSymbol = symbol;
        } catch {
          // keep the short address
        }
      });
    }
    for (let start = 0; start < launches.length; start += 20) {
      const slice = launches.slice(start, start + 20);
      const logoResults = await batch(
        relay,
        slice.map((row) => call(row.token, encodeFunctionData({ abi: tokenAbi, functionName: "logo", args: [] }))),
      );
      for (let i = 0; i < slice.length; i++) {
        try {
          slice[i].logo = decodeFunctionResult({
            abi: tokenAbi,
            functionName: "logo",
            data: asHex(logoResults[i], "logo"),
          });
        } catch {
          slice[i].logo = "";
        }
      }
    }
  }

  return { info: { protocol, tokenImplementation, curveImplementation, launchCount, version }, launches };
}

async function assertCurveCode(relay: Relay, curve: Address): Promise<void> {
  const [code] = await batch(relay, [{ method: "eth_getCode", params: [curve, "latest"] }]);
  const impl = cloneTarget(String(code));
  if (!impl) throw new Error("That address is not a SkyCurve proxy.");
  const [implCode] = await batch(relay, [{ method: "eth_getCode", params: [impl, "latest"] }]);
  if (!sameCode(String(implCode), curveDeployedBytecode)) {
    throw new Error("Curve bytecode does not match SkyLaunchpad. Trading is disabled.");
  }
}

export async function readMarket(relay: Relay, curve: Address): Promise<MarketDetail> {
  await assertCurveCode(relay, curve);
  const packed = encodeFunctionData({ abi: curveAbi, functionName: "viewState", args: [] });
  const tokenData = encodeFunctionData({ abi: curveAbi, functionName: "token", args: [] });
  const creatorData = encodeFunctionData({ abi: curveAbi, functionName: "creator", args: [] });
  const protocolData = encodeFunctionData({ abi: curveAbi, functionName: "protocol", args: [] });
  const factoryData = encodeFunctionData({ abi: curveAbi, functionName: "factory", args: [] });
  const metaData = encodeFunctionData({ abi: curveAbi, functionName: "metadataUri", args: [] });
  const launchedData = encodeFunctionData({ abi: curveAbi, functionName: "launchedAt", args: [] });
  const quoteData = encodeFunctionData({ abi: curveAbi, functionName: "quote", args: [] });
  const historyData = encodeFunctionData({ abi: curveAbi, functionName: "history", args: [] });
  const printsData = encodeFunctionData({ abi: curveAbi, functionName: "prints", args: [] });

  const [stateR, tokenR, creatorR, protocolR, factoryR, metaR, launchedR, quoteR, historyR, printsR] = await batch(relay, [
    call(curve, packed),
    call(curve, tokenData),
    call(curve, creatorData),
    call(curve, protocolData),
    call(curve, factoryData),
    call(curve, metaData),
    call(curve, launchedData),
    call(curve, quoteData),
    call(curve, historyData),
    call(curve, printsData),
  ]);

  const state = decodeFunctionResult({ abi: curveAbi, functionName: "viewState", data: asHex(stateR, "state") });
  const token = decodeFunctionResult({ abi: curveAbi, functionName: "token", data: asHex(tokenR, "token") });
  const [tokenCode, nameR, symbolR, supplyR, logoR] = await batch(relay, [
    { method: "eth_getCode", params: [token, "latest"] },
    call(token, encodeFunctionData({ abi: tokenAbi, functionName: "name", args: [] })),
    call(token, encodeFunctionData({ abi: tokenAbi, functionName: "symbol", args: [] })),
    call(token, encodeFunctionData({ abi: tokenAbi, functionName: "totalSupply", args: [] })),
    call(token, encodeFunctionData({ abi: tokenAbi, functionName: "logo", args: [] })),
  ]);
  const tokenImpl = cloneTarget(String(tokenCode));
  if (!tokenImpl) throw new Error("Token is not a SkyToken proxy.");
  const [implCode] = await batch(relay, [{ method: "eth_getCode", params: [tokenImpl, "latest"] }]);
  if (!sameCode(String(implCode), tokenDeployedBytecode)) {
    throw new Error("Token bytecode does not match SkyLaunchpad.");
  }

  const history = decodeFunctionResult({
    abi: curveAbi,
    functionName: "history",
    data: asHex(historyR, "history"),
  });
  const prints = decodeFunctionResult({
    abi: curveAbi,
    functionName: "prints",
    data: asHex(printsR, "prints"),
  });

  const quote = decodeFunctionResult({ abi: curveAbi, functionName: "quote", data: asHex(quoteR, "quote") });
  let quoteSymbol = "ETH";
  if (quote !== zeroAddress) {
    try {
      const [symbolR] = await batch(relay, [
        call(quote, encodeFunctionData({ abi: tokenAbi, functionName: "symbol", args: [] })),
      ]);
      quoteSymbol =
        decodeFunctionResult({ abi: tokenAbi, functionName: "symbol", data: asHex(symbolR, "symbol") }) || "TOKEN";
    } catch {
      quoteSymbol = "TOKEN";
    }
  }

  return {
    curve,
    token,
    creator: decodeFunctionResult({ abi: curveAbi, functionName: "creator", data: asHex(creatorR, "creator") }),
    protocol: decodeFunctionResult({ abi: curveAbi, functionName: "protocol", data: asHex(protocolR, "protocol") }),
    factory: decodeFunctionResult({ abi: curveAbi, functionName: "factory", data: asHex(factoryR, "factory") }),
    name: decodeFunctionResult({ abi: tokenAbi, functionName: "name", data: asHex(nameR, "name") }),
    symbol: decodeFunctionResult({ abi: tokenAbi, functionName: "symbol", data: asHex(symbolR, "symbol") }),
    metadataUri: decodeFunctionResult({ abi: curveAbi, functionName: "metadataUri", data: asHex(metaR, "metadata") }),
    logo: decodeFunctionResult({ abi: tokenAbi, functionName: "logo", data: asHex(logoR, "logo") }),
    totalSupply: decodeFunctionResult({ abi: tokenAbi, functionName: "totalSupply", data: asHex(supplyR, "supply") }),
    launchedAt: Number(
      decodeFunctionResult({ abi: curveAbi, functionName: "launchedAt", data: asHex(launchedR, "time") }),
    ),
    virtualEth: pick(state, 0, "virtualEth_"),
    virtualToken: pick(state, 1, "virtualToken_"),
    realEth: pick(state, 2, "realEth_"),
    marketCap: pick(state, 3, "marketCap_"),
    progressBps: pick(state, 4, "progressBps_"),
    graduated: pick(state, 5, "graduated_"),
    spotPrice: pick(state, 6, "spotPrice_"),
    quote,
    quoteSymbol,
    history: pick<readonly bigint[]>(history, 0, "caps").map((cap, i) => ({
      cap,
      time: Number(pick<readonly bigint[]>(history, 1, "times")[i] ?? 0),
    })),
    prints: prints.map((print) => ({
      time: Number(pick<bigint>(print, 0, "time")),
      ethAmount: pick<bigint>(print, 1, "ethAmount"),
      tokenAmount: pick<bigint>(print, 2, "tokenAmount"),
      isBuy: pick<boolean>(print, 3, "isBuy"),
      trader: pick(print, 4, "trader"),
    })),
  };
}

export async function readHolding(
  relay: Relay,
  token: Address,
  curve: Address,
  owner: Address,
  quote: Address = zeroAddress,
): Promise<Holding> {
  const calls: RpcCall[] = [
    { method: "eth_getBalance", params: [owner, "latest"] },
    call(token, encodeFunctionData({ abi: tokenAbi, functionName: "balanceOf", args: [owner] })),
    call(token, encodeFunctionData({ abi: tokenAbi, functionName: "allowance", args: [owner, curve] })),
  ];
  if (quote !== zeroAddress) {
    calls.push(call(quote, encodeFunctionData({ abi: tokenAbi, functionName: "balanceOf", args: [owner] })));
    calls.push(call(quote, encodeFunctionData({ abi: tokenAbi, functionName: "allowance", args: [owner, curve] })));
  }
  const [eth, tokens, allowance, quoteBalance, quoteAllowance] = await batch(relay, calls);
  return {
    eth: BigInt(String(eth)),
    tokens: decodeFunctionResult({ abi: tokenAbi, functionName: "balanceOf", data: asHex(tokens, "balance") }),
    allowance: decodeFunctionResult({
      abi: tokenAbi,
      functionName: "allowance",
      data: asHex(allowance, "allowance"),
    }),
    quoteBalance:
      quote === zeroAddress
        ? BigInt(String(eth))
        : decodeFunctionResult({ abi: tokenAbi, functionName: "balanceOf", data: asHex(quoteBalance, "quote balance") }),
    quoteAllowance:
      quote === zeroAddress
        ? 2n ** 256n - 1n
        : decodeFunctionResult({
            abi: tokenAbi,
            functionName: "allowance",
            data: asHex(quoteAllowance, "quote allowance"),
          }),
  };
}

export async function readAllowance(relay: Relay, token: Address, owner: Address, spender: Address): Promise<bigint> {
  const [result] = await batch(relay, [
    call(token, encodeFunctionData({ abi: tokenAbi, functionName: "allowance", args: [owner, spender] })),
  ]);
  return decodeFunctionResult({ abi: tokenAbi, functionName: "allowance", data: asHex(result, "allowance") });
}

export async function quoteInitialBuy(
  relay: Relay,
  factory: Address,
  value: bigint,
  taxBps: number,
): Promise<bigint> {
  const data = encodeFunctionData({
    abi: factoryAbi,
    functionName: "quoteInitialBuy",
    args: [value, taxBps],
  });
  const [result] = await batch(relay, [call(factory, data)]);
  return decodeFunctionResult({
    abi: factoryAbi,
    functionName: "quoteInitialBuy",
    data: asHex(result, "quote"),
  });
}

export async function quoteCurveBuy(
  relay: Relay,
  curve: Address,
  buyer: Address,
  value: bigint,
): Promise<bigint> {
  const data = encodeFunctionData({ abi: curveAbi, functionName: "quoteBuy", args: [buyer, value] });
  const [result] = await batch(relay, [call(curve, data)]);
  const decoded = decodeFunctionResult({ abi: curveAbi, functionName: "quoteBuy", data: asHex(result, "quote") });
  return pick(decoded, 0, "tokensOut");
}

export async function quoteCurveSell(relay: Relay, curve: Address, tokens: bigint): Promise<bigint> {
  const data = encodeFunctionData({ abi: curveAbi, functionName: "quoteSell", args: [tokens] });
  const [result] = await batch(relay, [call(curve, data)]);
  const decoded = decodeFunctionResult({ abi: curveAbi, functionName: "quoteSell", data: asHex(result, "quote") });
  return pick(decoded, 0, "ethOut");
}

export function readDescription(uri: string): string {
  const prefix = "data:application/json,";
  if (!uri.startsWith(prefix)) return "";
  try {
    const parsed = JSON.parse(decodeURIComponent(uri.slice(prefix.length))) as { description?: unknown };
    return typeof parsed.description === "string" ? parsed.description : "";
  } catch {
    return "";
  }
}
