import { i as __toESM } from "../_runtime.mjs";
import { Q as require_react, Z as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as formatEth, D as explainError, F as parseEth, M as formatTokens, S as capNumber, b as bpsLabel, l as GRADUATION_ETH } from "./wallet-I32zn3lV.mjs";
import { a as Meter, l as controlClass, o as Notice, s as Shell, t as Button } from "./ui-CoyXQBXO.mjs";
import { a as progressBpsOf, i as marketCapOf, n as applySell, r as initialSnap, s as splitFee, t as applyBuy } from "./math-CHOj4-XD.mjs";
import { a as Area, c as Tooltip, r as YAxis, s as ResponsiveContainer, t as AreaChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/simulate-CRF66glb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SimulatePage() {
	const [snap, setSnap] = (0, import_react.useState)(initialSnap);
	const [bag, setBag] = (0, import_react.useState)(0n);
	const [spent, setSpent] = (0, import_react.useState)(0n);
	const [received, setReceived] = (0, import_react.useState)(0n);
	const [amount, setAmount] = (0, import_react.useState)("0.05");
	const [side, setSide] = (0, import_react.useState)("buy");
	const [error, setError] = (0, import_react.useState)("");
	const [tape, setTape] = (0, import_react.useState)([]);
	const [series, setSeries] = (0, import_react.useState)([{
		i: 0,
		cap: capNumber(marketCapOf(initialSnap()))
	}]);
	function reset() {
		const fresh = initialSnap();
		setSnap(fresh);
		setBag(0n);
		setSpent(0n);
		setReceived(0n);
		setTape([]);
		setError("");
		setSeries([{
			i: 0,
			cap: capNumber(marketCapOf(fresh))
		}]);
	}
	function trade() {
		setError("");
		const qty = parseEth(amount);
		if (qty == null) {
			setError("Use a plain number, up to 18 decimals.");
			return;
		}
		try {
			if (side === "buy") {
				if (qty < 10000000000000n) throw new Error("Minimum buy is 0.00001 ETH.");
				const next = applyBuy(snap, qty);
				const entry = {
					side: "buy",
					eth: qty,
					tokens: next.tokensOut,
					fee: next.fee
				};
				setSnap(next.snap);
				setBag((held) => held + next.tokensOut);
				setSpent((value) => value + qty);
				setTape((rows) => [entry, ...rows].slice(0, 12));
				setSeries((points) => [...points, {
					i: points.length,
					cap: capNumber(marketCapOf(next.snap))
				}]);
			} else {
				if (qty > bag) throw new Error("The paper wallet does not hold that many tokens.");
				const next = applySell(snap, qty);
				const entry = {
					side: "sell",
					eth: next.ethOut,
					tokens: qty,
					fee: next.fee
				};
				setSnap(next.snap);
				setBag((held) => held - qty);
				setReceived((value) => value + next.ethOut);
				setTape((rows) => [entry, ...rows].slice(0, 12));
				setSeries((points) => [...points, {
					i: points.length,
					cap: capNumber(marketCapOf(next.snap))
				}]);
			}
		} catch (err) {
			setError(explainError(err));
		}
	}
	const cap = marketCapOf(snap);
	const progress = progressBpsOf(snap);
	const lastFee = tape[0] ? splitFee(tape[0].fee) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-primary",
						children: "Simulator"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-serif text-4xl",
						children: "Same math, no gas"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-xl text-muted",
						children: "This paper curve uses the published SkyLaunchpad formula. It does not touch Robinhood Chain. A live market can move between your quote and your signature."
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Notice, { children: [
					"Opening market cap is 1.5 ETH of virtual reserves. Graduation needs ",
					formatEth(GRADUATION_ETH),
					" ETH of real buys after fees. Virtual ETH cannot be withdrawn."
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex items-end justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-serif text-3xl",
						children: [formatEth(cap), " ETH"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: snap.graduated ? "Graduated" : bpsLabel(progress)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-56 rounded-2xl border border-line bg-surface p-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
							data: series,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									hide: true,
									domain: ["auto", "auto"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									formatter: (value) => [`${Number(value).toFixed(4)} ETH`, "Mcap"],
									labelFormatter: () => "Paper market cap",
									contentStyle: {
										background: "var(--color-surface)",
										border: "1px solid var(--color-line)",
										borderRadius: 12,
										color: "var(--color-fg)"
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
									dataKey: "cap",
									stroke: "var(--color-primary)",
									fill: "var(--color-primary)",
									fillOpacity: .18,
									strokeWidth: 2
								})
							]
						})
					})
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
					bps: progress,
					graduated: snap.graduated
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-muted",
					children: [
						formatEth(snap.realEth, 4),
						" / ",
						formatEth(GRADUATION_ETH),
						" ETH real"
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-2xl",
					children: "Paper prints"
				}), tape.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "No trades yet. Buy first — a fresh curve has no real ETH to sell against."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 divide-y divide-line rounded-2xl border border-line",
					children: tape.map((row, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between gap-3 px-3 py-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: row.side === "buy" ? "text-up" : "text-primary",
								children: row.side === "buy" ? "Buy" : "Sell"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatTokens(row.tokens) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [formatEth(row.eth, 5), " ETH"] })
						]
					}, index))
				})] })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "flex h-fit flex-col gap-3 rounded-2xl border border-line bg-surface p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: `min-h-11 rounded-full text-sm ${side === "buy" ? "bg-up text-bg" : "bg-inset text-muted"}`,
						onClick: () => {
							setSide("buy");
							setAmount("0.05");
						},
						children: "Buy"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: `min-h-11 rounded-full text-sm ${side === "sell" ? "bg-primary text-primary-fg" : "bg-inset text-muted"}`,
						onClick: () => setSide("sell"),
						children: "Sell"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex flex-col gap-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: side === "buy" ? "ETH in" : "Whole tokens out" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: amount,
						onChange: (event) => setAmount(event.target.value),
						inputMode: "decimal",
						className: controlClass
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: (side === "buy" ? [
						"0.01",
						"0.05",
						"0.2",
						"1"
					] : [
						"1000",
						"10000",
						"100000"
					]).map((preset) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "min-h-11 rounded-full bg-inset px-3 text-sm",
						onClick: () => setAmount(preset),
						children: preset
					}, preset))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: trade,
					children: side === "buy" ? "Paper buy" : "Paper sell"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "line",
					onClick: reset,
					children: "Reset curve"
				}),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-primary",
					children: error
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "flex flex-col gap-2 border-t border-line pt-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Tokens held",
							v: formatTokens(bag)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "ETH paid in",
							v: formatEth(spent, 4)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "ETH received",
							v: formatEth(received, 4)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Last creator fee",
							v: lastFee ? `${formatEth(lastFee.creator, 6)} ETH` : "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Last treasury fee",
							v: lastFee ? `${formatEth(lastFee.protocol, 6)} ETH` : "—"
						})
					]
				})
			]
		})]
	}) });
}
function Row({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-muted",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: v })]
	});
}
//#endregion
export { SimulatePage as component };
