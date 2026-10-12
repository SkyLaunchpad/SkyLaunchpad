import { i as __toESM } from "./_runtime.mjs";
import { Q as require_react, Z as require_jsx_runtime, x as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { A as formatEth, B as useWallet, D as explainError, E as estimateOrThrow, F as parseEth, I as sellCalldata, L as sendTx, M as formatTokens, R as shortAddr, S as capNumber, T as ensureRobinhood, V as waitForReceipt, b as bpsLabel, v as ago, x as buyCalldata, y as approveCalldata } from "./_ssr/wallet-I32zn3lV.mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { a as quoteCurveBuy, c as readDescription, i as useProtocol, l as readHolding, o as quoteCurveSell, r as Route$1, u as readMarket } from "./_ssr/router-CQscQTY8.mjs";
import { a as Meter, i as Ident, l as controlClass, n as ExplorerLink, o as Notice, s as Shell, t as Button } from "./_ssr/ui-CoyXQBXO.mjs";
import { c as withSlippage } from "./_ssr/math-CHOj4-XD.mjs";
import { a as Area, c as Tooltip, r as YAxis, s as ResponsiveContainer, t as AreaChart } from "./_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_curve-DOPSxfLy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MarketPage() {
	const { curve } = Route$1.useParams();
	const proto = useProtocol();
	const wallet = useWallet();
	const [market, setMarket] = (0, import_react.useState)(null);
	const [holding, setHolding] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(true);
	async function reload() {
		try {
			const next = await readMarket(proto.relay, curve);
			setMarket(next);
			setError("");
			if (wallet.address) setHolding(await readHolding(proto.relay, next.token, next.curve, wallet.address));
			else setHolding(null);
		} catch (err) {
			setError(explainError(err));
		} finally {
			setLoading(false);
		}
	}
	(0, import_react.useEffect)(() => {
		setLoading(true);
		reload();
		const timer = window.setInterval(() => void reload(), 12e3);
		return () => window.clearInterval(timer);
	}, [
		curve,
		wallet.address,
		proto.relay
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		loading && !market ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted",
			children: "Loading market from Robinhood Chain…"
		}) : null,
		error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Notice, {
			tone: "bad",
			children: error
		}) : null,
		market ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TradeDesk, {
			market,
			holding,
			onDone: () => void reload()
		}) : null
	] });
}
function TradeDesk({ market, holding, onDone }) {
	const wallet = useWallet();
	const proto = useProtocol();
	const [side, setSide] = (0, import_react.useState)("buy");
	const [amount, setAmount] = (0, import_react.useState)("0.01");
	const [slipBps, setSlipBps] = (0, import_react.useState)(100n);
	const [quote, setQuote] = (0, import_react.useState)("");
	const [pending, setPending] = (0, import_react.useState)(false);
	const [status, setStatus] = (0, import_react.useState)("");
	const description = market.metadataUri.startsWith("data:") ? readDescription(market.metadataUri) : market.metadataUri;
	const chart = market.history.map((point) => ({
		t: point.time,
		cap: capNumber(point.cap)
	}));
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		const timer = window.setTimeout(() => {
			(async () => {
				try {
					if (side === "buy") {
						const wei = parseEth(amount);
						if (wei == null || wei < 10000000000000n) {
							if (!cancelled) setQuote("");
							return;
						}
						const tokens = await quoteCurveBuy(proto.relay, market.curve, wallet.address ?? market.creator, wei);
						if (!cancelled) setQuote(`About ${formatTokens(tokens)} ${market.symbol}`);
					} else {
						const tokens = parseEth(amount);
						if (tokens == null || tokens <= 0n) {
							if (!cancelled) setQuote("");
							return;
						}
						const eth = await quoteCurveSell(proto.relay, market.curve, tokens);
						if (!cancelled) setQuote(`About ${formatEth(eth, 6)} ETH after the 1% fee`);
					}
				} catch (error) {
					if (!cancelled) setQuote(explainError(error));
				}
			})();
		}, 250);
		return () => {
			cancelled = true;
			window.clearTimeout(timer);
		};
	}, [
		amount,
		side,
		market.curve,
		market.symbol,
		proto.relay
	]);
	async function submit() {
		if (!wallet.address) {
			toast.error("Connect a wallet on Robinhood Chain.");
			return;
		}
		setPending(true);
		try {
			const eth = wallet.ethereum();
			await ensureRobinhood(eth);
			if (side === "buy") {
				const value = parseEth(amount);
				if (value == null || value < 10000000000000n) throw new Error("Enter at least 0.00001 ETH.");
				const tokens = await quoteCurveBuy(proto.relay, market.curve, wallet.address ?? market.creator, value);
				const data = buyCalldata(wallet.address, withSlippage(tokens, slipBps));
				const tx = {
					from: wallet.address,
					to: market.curve,
					data,
					value
				};
				setStatus("Simulating buy…");
				await estimateOrThrow(proto.relay, tx);
				setStatus("Sign the buy.");
				const hash = await sendTx(eth, tx);
				setStatus("Waiting for the buy…");
				if (!(await waitForReceipt(proto.relay, hash)).ok) throw new Error("Buy reverted.");
				toast.success("Buy landed.");
			} else {
				const tokens = parseEth(amount);
				if (tokens == null || tokens <= 0n) throw new Error("Enter a token amount. 1 means one whole token.");
				const ethOut = await quoteCurveSell(proto.relay, market.curve, tokens);
				if ((holding?.allowance ?? 0n) < tokens) {
					setStatus("Sign the approval. The curve can spend only this token amount, not your ETH.");
					const approveTx = {
						from: wallet.address,
						to: market.token,
						data: approveCalldata(market.curve, tokens),
						value: 0n
					};
					await estimateOrThrow(proto.relay, approveTx);
					const approveHash = await sendTx(eth, approveTx);
					if (!(await waitForReceipt(proto.relay, approveHash)).ok) throw new Error("Approval reverted.");
				}
				const data = sellCalldata(tokens, withSlippage(ethOut, slipBps));
				const tx = {
					from: wallet.address,
					to: market.curve,
					data,
					value: 0n
				};
				setStatus("Sign the sell.");
				await estimateOrThrow(proto.relay, tx);
				const hash = await sendTx(eth, tx);
				if (!(await waitForReceipt(proto.relay, hash)).ok) throw new Error("Sell reverted.");
				toast.success("Sell landed.");
			}
			setStatus("");
			onDone();
		} catch (error) {
			const message = explainError(error);
			setStatus(message);
			toast.error(message);
		} finally {
			setPending(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [market.logo.startsWith("http") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: market.logo,
						alt: "",
						className: "h-14 w-14 rounded-2xl border border-line object-cover"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ident, { seed: market.token }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "font-serif text-4xl leading-none",
						children: [
							market.name,
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted",
								children: market.symbol
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted",
						children: [
							market.graduated ? "Graduated" : `${bpsLabel(market.progressBps)} toward graduation`,
							" · launched",
							" ",
							ago(market.launchedAt)
						]
					})] })]
				}),
				description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "max-w-xl text-base text-fg",
					children: description
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex items-end justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-serif text-3xl",
						children: [formatEth(market.marketCap), " ETH"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "market cap"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-56 rounded-2xl border border-line bg-surface p-2",
					children: chart.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
							data: chart,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									hide: true,
									domain: ["auto", "auto"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									formatter: (value) => [`${Number(value).toFixed(4)} ETH`, "Mcap"],
									labelFormatter: () => "Market cap",
									contentStyle: {
										background: "#18211d",
										border: "1px solid #2c3a34",
										borderRadius: 12
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
									dataKey: "cap",
									stroke: "#e26a2c",
									fill: "#e26a2c",
									fillOpacity: .18,
									strokeWidth: 2
								})
							]
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-full items-center justify-center text-sm text-muted",
						children: "The curve records a point on each trade. History starts at launch."
					})
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
					bps: market.progressBps,
					graduated: market.graduated
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-muted",
					children: [
						formatEth(market.realEth, 4),
						" / 4.2 ETH real reserves.",
						market.graduated ? " Graduated is permanent. Trading continues on the same locked curve." : " Graduation does not migrate liquidity. It only marks the threshold."
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "grid grid-cols-1 gap-3 text-sm sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
							label: "Token",
							value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExplorerLink, {
								kind: "address",
								value: market.token,
								children: shortAddr(market.token)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
							label: "Curve",
							value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExplorerLink, {
								kind: "address",
								value: market.curve,
								children: shortAddr(market.curve)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
							label: "Creator",
							value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/profile/$address",
								params: { address: market.creator },
								className: "underline underline-offset-4",
								children: shortAddr(market.creator)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
							label: "Treasury",
							value: shortAddr(market.protocol)
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-2xl",
					children: "Prints"
				}), market.prints.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "No trades yet. The launch itself is not a print unless the creator bought."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 divide-y divide-line rounded-2xl border border-line",
					children: [...market.prints].reverse().map((print, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between gap-3 px-3 py-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: print.isBuy ? "text-up" : "text-primary",
								children: print.isBuy ? "Buy" : "Sell"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								formatTokens(print.tokenAmount),
								" ",
								market.symbol
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [formatEth(print.ethAmount, 5), " ETH"] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted",
								children: shortAddr(print.trader)
							})
						]
					}, `${print.time}-${index}`))
				})] })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "h-fit rounded-2xl border border-line bg-surface p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: `min-h-11 rounded-full text-sm ${side === "buy" ? "bg-up text-bg" : "bg-inset text-muted"}`,
						onClick: () => {
							setSide("buy");
							setAmount("0.01");
						},
						children: "Buy"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: `min-h-11 rounded-full text-sm ${side === "sell" ? "bg-primary text-primary-fg" : "bg-inset text-muted"}`,
						onClick: () => {
							setSide("sell");
							setAmount("1000");
						},
						children: "Sell"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-4 flex flex-col gap-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: side === "buy" ? "You pay (ETH)" : `You sell (whole ${market.symbol})` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: amount,
						onChange: (event) => setAmount(event.target.value),
						inputMode: "decimal",
						className: controlClass
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex gap-2",
					children: [
						50n,
						100n,
						300n
					].map((bps) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: `min-h-11 flex-1 rounded-full text-sm ${slipBps === bps ? "bg-inset text-fg" : "text-muted"}`,
						onClick: () => setSlipBps(bps),
						children: [Number(bps) / 100, "% slip"]
					}, String(bps)))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 min-h-11 text-sm text-muted",
					children: quote || "Enter an amount to quote the curve."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "w-full",
					disabled: pending,
					onClick: () => void submit(),
					children: pending ? "Check your wallet" : side === "buy" ? "Buy from curve" : "Sell to curve"
				}),
				status ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted",
					children: status
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-4 flex flex-col gap-2 text-sm text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Your ETH" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "text-fg",
								children: holding ? formatEth(holding.eth, 5) : "—"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Your tokens" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "text-fg",
								children: holding ? formatTokens(holding.tokens) : "—"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Fee" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "text-fg",
								children: "1%"
							})]
						})
					]
				})
			]
		})]
	});
}
function Info({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-line bg-surface px-3 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "mt-1 break-all text-fg",
			children: value
		})]
	});
}
//#endregion
export { MarketPage as component };
