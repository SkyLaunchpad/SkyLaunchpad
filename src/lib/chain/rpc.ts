import { createServerFn } from "@tanstack/react-start";

const RPC = "https://rpc.mainnet.chain.robinhood.com";

const ALLOWED = new Set([
  "eth_chainId",
  "eth_blockNumber",
  "eth_gasPrice",
  "eth_getBalance",
  "eth_getCode",
  "eth_call",
  "eth_estimateGas",
  "eth_getTransactionReceipt",
  "eth_getTransactionByHash",
]);

export type RpcCall = { method: string; params: unknown[] };

export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

export type RpcItem = {
  id: number;
  result?: Json;
  error?: { code?: number; message?: string; data?: Json };
};

function assertCalls(input: unknown): { calls: RpcCall[] } {
  if (!input || typeof input !== "object" || !("calls" in input)) {
    throw new Error("Missing RPC calls.");
  }
  const calls = (input as { calls: unknown }).calls;
  if (!Array.isArray(calls) || calls.length < 1 || calls.length > 24) {
    throw new Error("RPC batch must be 1–24 calls.");
  }
  const clean: RpcCall[] = [];
  for (const call of calls) {
    if (!call || typeof call !== "object") throw new Error("Bad RPC call.");
    const method = (call as { method?: unknown }).method;
    const params = (call as { params?: unknown }).params;
    if (typeof method !== "string" || !ALLOWED.has(method)) {
      throw new Error("That RPC method is not allowed.");
    }
    if (!Array.isArray(params) || params.length > 4) throw new Error("Bad RPC params.");
    const encoded = JSON.stringify(params);
    if (encoded.length > 80_000) throw new Error("RPC params are too large.");
    clean.push({ method, params });
  }
  return { calls: clean };
}

/** Read-only relay to Robinhood Chain mainnet. Sends are signed in the wallet, never here. */
export const robinhoodRelay = createServerFn({ method: "POST" })
  .validator(assertCalls)
  .handler(async ({ data }) => {
    const body = data.calls.map((call, id) => ({
      jsonrpc: "2.0",
      id,
      method: call.method,
      params: call.params,
    }));
    const response = await fetch(RPC, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(12_000),
    });
    if (!response.ok) throw new Error(`Robinhood RPC returned ${response.status}.`);
    const json: unknown = await response.json();
    if (!Array.isArray(json)) throw new Error("Robinhood RPC did not return a batch.");
    return json as {
      id: number;
      result?: Json;
      error?: { code?: number; message?: string; data?: Json };
    }[];
  });
