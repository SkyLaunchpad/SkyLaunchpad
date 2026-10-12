import { i as __toESM } from "../_runtime.mjs";
import { Q as require_react, Z as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as formatEth, D as explainError, F as parseEth, M as formatTokens, c as FEE_BPS, d as LAUNCH_FEE, l as GRADUATION_ETH } from "./wallet-I32zn3lV.mjs";
import { i as useProtocol } from "./router-CQscQTY8.mjs";
import { l as controlClass, o as Notice, s as Shell } from "./ui-CoyXQBXO.mjs";
import { o as quoteBuy, r as initialSnap, s as splitFee } from "./math-CHOj4-XD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/plp-CVZeH0RU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PlpPage() {
	const proto = useProtocol();
	const [eth, setEth] = (0, import_react.useState)("0.1");
	const locked = proto.launches.reduce((sum, row) => sum + row.realEth, 0n);
	const quote = (0, import_react.useMemo)(() => {
		const value = parseEth(eth);
		if (value == null) return { error: "Enter a plain ETH amount." };
		try {
			const q = quoteBuy(initialSnap(), value);
			return {
				q,
				parts: splitFee(q.fee),
				value
			};
		} catch (error) {
			return { error: explainError(error) };
		}
	}, [eth]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-3xl flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-primary",
					children: "PLP"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-serif text-4xl leading-tight",
					children: "Liquidity stays in the curve"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-muted",
					children: "Pons describes a liquidity pool that opens later. SkyLaunchpad does not take LP deposits and does not mint pool shares. The only ETH inside a market is what buyers paid, minus the fee that was sent out in the same transaction."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
						label: "Locked in this window",
						value: proto.phase === "ready" ? `${formatEth(locked, 4)} ETH` : "No factory"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
						label: "Trade fee",
						value: `${Number(FEE_BPS) / 100}%`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
						label: "Graduation",
						value: `${formatEth(GRADUATION_ETH)} ETH real`
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-2xl border border-line bg-surface p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-2xl",
					children: "Where a buy goes"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
					className: "mt-3 flex list-decimal flex-col gap-2 pl-5 text-sm leading-6 text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "You send ETH to the curve. Minimum size is 0.00001 ETH." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "1% is a fee. 70% of that fee is paid to the token creator. 30% is paid to the factory treasury." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "The other 99% is added to real reserves and to the virtual ETH that sets price." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "You receive tokens from the billion sitting in the curve. Nothing new is minted." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "A sell reverses the curve only as far as real ETH allows. The 1.5 ETH virtual offset never leaves." })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-2xl border border-line bg-surface p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-2xl",
						children: "Fee on a fresh curve"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted",
						children: [
							"This quotes the opening reserves, not a live market. A launched curve is tighter after people have bought. Launch itself also charges ",
							formatEth(LAUNCH_FEE),
							" ETH to the treasury, separate from the trade fee."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-4 flex flex-col gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Buy size (ETH)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: eth,
							onChange: (event) => setEth(event.target.value),
							inputMode: "decimal",
							className: controlClass
						})]
					}),
					"error" in quote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-primary",
						children: quote.error
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-4 grid grid-cols-2 gap-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
								label: "Tokens out",
								value: formatTokens(quote.q.tokensOut)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
								label: "Stays in the curve",
								value: `${formatEth(quote.q.net, 6)} ETH`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
								label: "Creator fee",
								value: `${formatEth(quote.parts.creator, 6)} ETH`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
								label: "Treasury fee",
								value: `${formatEth(quote.parts.protocol, 6)} ETH`
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Notice, { children: [
				"Fees are pushed to the creator and treasury during the trade. There is no claim function and no way for either of them to sweep reserves. Practice the path on the",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/simulate",
					className: "underline",
					children: "simulator"
				}),
				" ",
				"before you spend mainnet ETH."
			] })
		]
	}) });
}
function Cell({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-surface px-4 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-sm text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "text-base",
			children: value
		})]
	});
}
//#endregion
export { PlpPage as component };
