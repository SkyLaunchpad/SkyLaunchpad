import { t as createServerFn } from "./ssr.mjs";
import { u as isAddress } from "../_libs/viem.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/stocks-M0X3yMog.js
function text(source, ...keys) {
	for (const key of keys) if (key in source) {
		const value = source[key];
		if (typeof value === "string" && value.trim()) return value.trim();
	}
	return "";
}
/** Official Robinhood Stock Tokens on chain 4663. A same ticker at another address is not this list. */
var listStockPairs_createServerFn_handler = createServerRpc({
	id: "204a79e0dd3b988dcb000191f56bcb4e22be9a7427d05360d01e51feffde6e7e",
	name: "listStockPairs",
	filename: "src/lib/chain/stocks.ts"
}, (opts) => listStockPairs.__executeServer(opts));
var listStockPairs = createServerFn({ method: "GET" }).handler(listStockPairs_createServerFn_handler, async () => {
	const response = await fetch("https://api.robinhood.com/rhj/assets", {
		headers: { accept: "application/json" },
		signal: AbortSignal.timeout(12e3)
	});
	if (!response.ok) throw new Error("Robinhood stock list is unavailable.");
	const json = await response.json();
	const assets = json && typeof json === "object" && "assets" in json && Array.isArray(json.assets) ? json.assets : [];
	const rows = [];
	for (const asset of assets) {
		if (!asset || typeof asset !== "object") continue;
		const status = text(asset, "status");
		if (status && status !== "ASSET_STATUS_ACTIVE") continue;
		const first = ("deployments" in asset && Array.isArray(asset.deployments) ? asset.deployments : []).find((item) => {
			if (!item || typeof item !== "object" || !("chainId" in item)) return false;
			return Number(item.chainId) === 4663;
		});
		if (!first || typeof first !== "object") continue;
		const address = text(first, "contractAddress", "contract_address");
		const symbol = text(asset, "tokenSymbol", "token_symbol");
		if (!symbol || !isAddress(address)) continue;
		const name = text(asset, "tokenName", "token_name").replace(" • Robinhood Token", "");
		rows.push({
			symbol,
			name,
			address
		});
	}
	rows.sort((a, b) => a.symbol.localeCompare(b.symbol));
	return rows;
});
//#endregion
export { listStockPairs_createServerFn_handler };
