import { createServerFn } from "@tanstack/react-start";
import { isAddress, type Address } from "viem";

export type StockAsset = { symbol: string; name: string; address: Address };

function text(source: object, ...keys: string[]): string {
  for (const key of keys) {
    if (key in source) {
      const value = (source as Record<string, unknown>)[key];
      if (typeof value === "string" && value.trim()) return value.trim();
    }
  }
  return "";
}

/** Official Robinhood Stock Tokens on chain 4663. A same ticker at another address is not this list. */
export const listStockPairs = createServerFn({ method: "GET" }).handler(async (): Promise<StockAsset[]> => {
  const response = await fetch("https://api.robinhood.com/rhj/assets", {
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(12_000),
  });
  if (!response.ok) throw new Error("Robinhood stock list is unavailable.");
  const json: unknown = await response.json();
  const assets =
    json && typeof json === "object" && "assets" in json && Array.isArray(json.assets) ? json.assets : [];
  const rows: StockAsset[] = [];
  for (const asset of assets) {
    if (!asset || typeof asset !== "object") continue;
    const status = text(asset, "status");
    if (status && status !== "ASSET_STATUS_ACTIVE") continue;
    const deployments =
      "deployments" in asset && Array.isArray(asset.deployments) ? asset.deployments : [];
    const first = deployments.find((item: unknown) => {
      if (!item || typeof item !== "object" || !("chainId" in item)) return false;
      return Number((item as { chainId?: unknown }).chainId) === 4663;
    });
    if (!first || typeof first !== "object") continue;
    const address = text(first, "contractAddress", "contract_address");
    const symbol = text(asset, "tokenSymbol", "token_symbol");
    if (!symbol || !isAddress(address)) continue;
    const name = text(asset, "tokenName", "token_name").replace(" • Robinhood Token", "");
    rows.push({ symbol, name, address });
  }
  rows.sort((a, b) => a.symbol.localeCompare(b.symbol));
  return rows;
});
