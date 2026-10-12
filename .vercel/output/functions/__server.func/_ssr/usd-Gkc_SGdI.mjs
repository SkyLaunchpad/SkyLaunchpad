import { t as createServerFn } from "./ssr.mjs";
import { k as createSsrRpc } from "./wallet-CeYoLLWh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/usd-Gkc_SGdI.js
function assertSymbols(input) {
	const raw = input && typeof input === "object" && "symbols" in input ? input.symbols : [];
	if (!Array.isArray(raw)) return { symbols: [] };
	return { symbols: [...new Set(raw.filter((item) => typeof item === "string").map((item) => item.trim().toUpperCase()).filter((item) => item !== "ETH" && /^[A-Z][A-Z0-9.-]{0,11}$/.test(item)))].slice(0, 24) };
}
/** Dollar price of ETH, plus dollar prices of stock tickers used as pairs. */
var usdPrices = createServerFn({ method: "GET" }).validator(assertSymbols).handler(createSsrRpc("f785aa331a52600e58d5662ecd8abbf931e795992eeec5e8a545026afe62c325"));
function weiToUsd(wei, usdPerUnit) {
	if (!Number.isFinite(usdPerUnit) || usdPerUnit <= 0) return null;
	const micro = BigInt(Math.round(usdPerUnit * 1e6));
	if (micro <= 0n) return null;
	const value = Number(wei * micro / 10n ** 18n) / 1e6;
	return Number.isFinite(value) ? value : null;
}
function formatUsd(value) {
	if (!Number.isFinite(value) || value <= 0) return "$0";
	if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
	if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
	if (value >= 1e4) return `$${(value / 1e3).toFixed(2)}k`;
	if (value >= 1) return `$${value.toLocaleString("en-US", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	})}`;
	const digits = value >= 1e-4 ? 6 : 8;
	return `$${value.toFixed(digits).replace(/0+$/, "")}`;
}
//#endregion
export { usdPrices as n, weiToUsd as r, formatUsd as t };
