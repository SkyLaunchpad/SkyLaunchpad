import { createServerFn } from "@tanstack/react-start";

export type UsdBook = { eth: number; bySymbol: Record<string, number> };

function assertSymbols(input: unknown): { symbols: string[] } {
  const raw = input && typeof input === "object" && "symbols" in input ? (input as { symbols?: unknown }).symbols : [];
  if (!Array.isArray(raw)) return { symbols: [] };
  const symbols = [
    ...new Set(
      raw
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim().toUpperCase())
        .filter((item) => item !== "ETH" && /^[A-Z][A-Z0-9.-]{0,11}$/.test(item)),
    ),
  ].slice(0, 24);
  return { symbols };
}

async function ethUsd(): Promise<number> {
  const response = await fetch("https://api.coinbase.com/v2/prices/ETH-USD/spot", {
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(8_000),
  });
  if (!response.ok) return 0;
  const json: unknown = await response.json();
  const amount =
    json && typeof json === "object" && "data" in json && json.data && typeof json.data === "object" && "amount" in json.data
      ? Number((json.data as { amount?: unknown }).amount)
      : 0;
  return Number.isFinite(amount) && amount > 0 ? amount : 0;
}

async function stockUsd(symbol: string): Promise<number> {
  const ticker = encodeURIComponent(symbol.replaceAll(".", "-"));
  const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1d`, {
    headers: { accept: "application/json", "user-agent": "Mozilla/5.0" },
    signal: AbortSignal.timeout(8_000),
  });
  if (!response.ok) return 0;
  const json: unknown = await response.json();
  const result =
    json && typeof json === "object" && "chart" in json && json.chart && typeof json.chart === "object" && "result" in json.chart
      ? (json.chart as { result?: unknown }).result
      : null;
  const meta = Array.isArray(result) && result[0] && typeof result[0] === "object" && "meta" in result[0] ? result[0].meta : null;
  const price = meta && typeof meta === "object" && "regularMarketPrice" in meta ? Number(meta.regularMarketPrice) : 0;
  return Number.isFinite(price) && price > 0 ? price : 0;
}

/** Dollar price of ETH, plus dollar prices of stock tickers used as pairs. */
export const usdPrices = createServerFn({ method: "GET" })
  .validator(assertSymbols)
  .handler(async ({ data }): Promise<UsdBook> => {
    const [eth, stocks] = await Promise.all([
      ethUsd().catch(() => 0),
      Promise.all(data.symbols.map(async (symbol) => [symbol, await stockUsd(symbol).catch(() => 0)] as const)),
    ]);
    const bySymbol: Record<string, number> = {};
    for (const [symbol, price] of stocks) {
      if (price > 0) bySymbol[symbol] = price;
    }
    return { eth, bySymbol };
  });

export function weiToUsd(wei: bigint, usdPerUnit: number): number | null {
  if (!Number.isFinite(usdPerUnit) || usdPerUnit <= 0) return null;
  const micro = BigInt(Math.round(usdPerUnit * 1_000_000));
  if (micro <= 0n) return null;
  const value = Number((wei * micro) / 10n ** 18n) / 1_000_000;
  return Number.isFinite(value) ? value : null;
}

export function formatUsd(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "$0";
  if (value >= 1_000_000_000) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1_000_000) return `$${(value / 1e6).toFixed(2)}M`;
  if (value >= 10_000) return `$${(value / 1e3).toFixed(2)}k`;
  if (value >= 1) return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const digits = value >= 0.0001 ? 6 : 8;
  return `$${value.toFixed(digits).replace(/0+$/, "")}`;
}
