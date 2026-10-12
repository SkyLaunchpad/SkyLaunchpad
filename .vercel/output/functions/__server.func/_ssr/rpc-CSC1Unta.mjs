import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rpc-CSC1Unta.js
var RPC = "https://rpc.mainnet.chain.robinhood.com";
var ALLOWED = /* @__PURE__ */ new Set([
	"eth_chainId",
	"eth_blockNumber",
	"eth_gasPrice",
	"eth_getBalance",
	"eth_getCode",
	"eth_call",
	"eth_estimateGas",
	"eth_getTransactionReceipt",
	"eth_getTransactionByHash"
]);
function assertCalls(input) {
	if (!input || typeof input !== "object" || !("calls" in input)) throw new Error("Missing RPC calls.");
	const calls = input.calls;
	if (!Array.isArray(calls) || calls.length < 1 || calls.length > 24) throw new Error("RPC batch must be 1–24 calls.");
	const clean = [];
	for (const call of calls) {
		if (!call || typeof call !== "object") throw new Error("Bad RPC call.");
		const method = call.method;
		const params = call.params;
		if (typeof method !== "string" || !ALLOWED.has(method)) throw new Error("That RPC method is not allowed.");
		if (!Array.isArray(params) || params.length > 4) throw new Error("Bad RPC params.");
		if (JSON.stringify(params).length > 8e4) throw new Error("RPC params are too large.");
		clean.push({
			method,
			params
		});
	}
	return { calls: clean };
}
/** Read-only relay to Robinhood Chain mainnet. Sends are signed in the wallet, never here. */
var robinhoodRelay_createServerFn_handler = createServerRpc({
	id: "242bc70529b43905379a92defc0916bd4ef240b9d4bff5130479717c45619aea",
	name: "robinhoodRelay",
	filename: "src/lib/chain/rpc.ts"
}, (opts) => robinhoodRelay.__executeServer(opts));
var robinhoodRelay = createServerFn({ method: "POST" }).validator(assertCalls).handler(robinhoodRelay_createServerFn_handler, async ({ data }) => {
	const body = data.calls.map((call, id) => ({
		jsonrpc: "2.0",
		id,
		method: call.method,
		params: call.params
	}));
	const response = await fetch(RPC, {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify(body),
		signal: AbortSignal.timeout(12e3)
	});
	if (!response.ok) throw new Error(`Robinhood RPC returned ${response.status}.`);
	const json = await response.json();
	if (!Array.isArray(json)) throw new Error("Robinhood RPC did not return a batch.");
	return json;
});
//#endregion
export { robinhoodRelay_createServerFn_handler };
