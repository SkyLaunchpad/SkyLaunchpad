import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/usd-CZnR3stl.js
function assertSymbols(input) {
	const raw = input && typeof input === "object" && "symbols" in input ? input.symbols : [];
	if (!Array.isArray(raw)) return { symbols: [] };
	return { symbols: [...new Set(raw.filter((item) => typeof item === "string").map((item) => item.trim().toUpperCase()).filter((item) => item !== "ETH" && /^[A-Z][A-Z0-9.-]{0,11}$/.test(item)))].slice(0, 24) };
}
async function ethUsd() {
	const response = await fetch("https://api.coinbase.com/v2/prices/ETH-USD/spot", {
		headers: { accept: "application/json" },
		signal: AbortSignal.timeout(8e3)
	});
	if (!response.ok) return 0;
	const json = await response.json();
	const amount = json && typeof json === "object" && "data" in json && json.data && typeof json.data === "object" && "amount" in json.data ? Number(json.data.amount) : 0;
	return Number.isFinite(amount) && amount > 0 ? amount : 0;
}
async function stockUsd(symbol) {
	const ticker = encodeURIComponent(symbol.replaceAll(".", "-"));
	const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1d`, {
		headers: {
			accept: "application/json",
			"user-agent": "Mozilla/5.0"
		},
		signal: AbortSignal.timeout(8e3)
	});
	if (!response.ok) return 0;
	const json = await response.json();
	const result = json && typeof json === "object" && "chart" in json && json.chart && typeof json.chart === "object" && "result" in json.chart ? json.chart.result : null;
	const meta = Array.isArray(result) && result[0] && typeof result[0] === "object" && "meta" in result[0] ? result[0].meta : null;
	const price = meta && typeof meta === "object" && "regularMarketPrice" in meta ? Number(meta.regularMarketPrice) : 0;
	return Number.isFinite(price) && price > 0 ? price : 0;
}
/** Dollar price of ETH, plus dollar prices of stock tickers used as pairs. */
var usdPrices_createServerFn_handler = createServerRpc({
	id: "f785aa331a52600e58d5662ecd8abbf931e795992eeec5e8a545026afe62c325",
	name: "usdPrices",
	filename: "src/lib/chain/usd.ts"
}, (opts) => usdPrices.__executeServer(opts));
var usdPrices = createServerFn({ method: "GET" }).validator(assertSymbols).handler(usdPrices_createServerFn_handler, async ({ data }) => {
	const [eth, stocks] = await Promise.all([ethUsd().catch(() => 0), Promise.all(data.symbols.map(async (symbol) => [symbol, await stockUsd(symbol).catch(() => 0)]))]);
	const bySymbol = {};
	for (const [symbol, price] of stocks) if (price > 0) bySymbol[symbol] = price;
	return {
		eth,
		bySymbol
	};
});
//#endregion
export { usdPrices_createServerFn_handler };
