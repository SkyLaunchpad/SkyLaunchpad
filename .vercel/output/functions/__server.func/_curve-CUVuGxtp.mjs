import { i as __toESM } from "./_runtime.mjs";
import { Q as require_react, w as require_jsx_runtime, x as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { t as zeroAddress } from "./_libs/viem.mjs";
import { $ as readMarket, C as approveCalldata, D as capNumber, E as buyQuoteCalldata, H as parseEth, I as formatEth, K as quoteCurveBuy, L as formatTokens, M as estimateOrThrow, N as explainError, O as claimRewardsCalldata, Q as readHolding, S as ago, T as buyCalldata, V as openPoolCalldata, W as pendingRewardsCalldata, X as readAllowance, Y as quoteV4Calldata, Z as readDescription, at as useServerFn, ct as zeroForOne, et as sellCalldata, it as useProtocol, j as ensureRobinhood, nt as shortAddr, ot as useWallet, q as quoteCurveSell, rt as tradeCalldata, st as waitForReceipt, tt as sendTx, v as V4_QUOTER, w as bpsLabel } from "./_ssr/wallet-CeYoLLWh.mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { r as Route$1 } from "./_ssr/router-BNcwToXC.mjs";
import { a as Meter, i as Ident, l as controlClass, n as ExplorerLink, o as Notice, s as Shell, t as Button } from "./_ssr/ui-BCzYcPRg.mjs";
import { n as usdPrices, r as weiToUsd, t as formatUsd } from "./_ssr/usd-Gkc_SGdI.mjs";
import { c as withSlippage } from "./_ssr/math-DN_h4F2G.mjs";
import { a as Area, c as Tooltip, r as YAxis, s as ResponsiveContainer, t as AreaChart } from "./_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_curve-CUVuGxtp.js
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
			if (wallet.address) setHolding(await readHolding(proto.relay, next.token, next.curve, wallet.address, next.quote));
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
	const [book, setBook] = (0, import_react.useState)(null);
	const loadUsd = useServerFn(usdPrices);
	const description = market.metadataUri.startsWith("data:") ? readDescription(market.metadataUri) : market.metadataUri;
	const rate = market.quote === "0x0000000000000000000000000000000000000000" ? book?.eth : book?.bySymbol[market.quoteSymbol.toUpperCase()];
	const migrated = BigInt(market.poolId) !== 0n;
	const hook = proto.info?.hook;
	const pool = proto.info?.pool;
	const priceUsd = rate ? weiToUsd(market.spotPrice, rate) : null;
	const mcapUsd = rate ? weiToUsd(market.marketCap, rate) : null;
	const chart = market.history.map((point) => ({
		t: point.time,
		cap: rate ? weiToUsd(point.cap, rate) ?? 0 : capNumber(point.cap)
	}));
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		const symbols = market.quote === "0x0000000000000000000000000000000000000000" ? [] : [market.quoteSymbol];
		loadUsd({ data: { symbols } }).then((next) => {
			if (!cancelled) setBook(next);
		}).catch(() => {
			if (!cancelled) setBook(null);
		});
		return () => {
			cancelled = true;
		};
	}, [
		loadUsd,
		market.quote,
		market.quoteSymbol
	]);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		const timer = window.setTimeout(() => {
			(async () => {
				try {
					const input = parseEth(amount);
					if (migrated) {
						if (!hook || input == null || input <= 0n) {
							if (!cancelled) setQuote(hook ? "" : "Waiting for the V4 factory.");
							return;
						}
						if (side === "buy" && input < 10000000000000n) {
							if (!cancelled) setQuote("");
							return;
						}
						const data = quoteV4Calldata(market.token, market.quote, hook, zeroForOne(market.token, market.quote, side === "buy"), input);
						const [result] = await proto.relay([{
							method: "eth_call",
							params: [{
								to: V4_QUOTER,
								data
							}, "latest"]
						}]);
						const out = BigInt(String(result).slice(0, 66));
						const dollars = !side || side === "sell" ? rate ? weiToUsd(out, rate) : null : null;
						if (!cancelled) setQuote(side === "buy" ? `About ${formatTokens(out)} ${market.symbol} from the Uniswap v4 pool` : `About ${dollars == null ? `${formatEth(out, 6)} ${market.quoteSymbol}` : formatUsd(dollars)} from the Uniswap v4 pool`);
						return;
					}
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
						const dollars = rate ? weiToUsd(eth, rate) : null;
						if (!cancelled) setQuote(`About ${dollars == null ? `${formatEth(eth, 6)} ${market.quoteSymbol}` : formatUsd(dollars)} after the 1% fee`);
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
		market.quote,
		market.symbol,
		market.quoteSymbol,
		market.token,
		proto.relay,
		rate,
		wallet.address,
		migrated,
		hook
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
			if (migrated) {
				if (!pool || !hook) throw new Error("The Uniswap v4 pool is not on this factory yet.");
				const input = parseEth(amount);
				if (input == null || input <= 0n) throw new Error("Enter an amount.");
				const buying = side === "buy";
				if (buying && input < 10000000000000n) throw new Error(`Enter at least 0.00001 ${market.quoteSymbol}.`);
				const quoted = quoteV4Calldata(market.token, market.quote, hook, zeroForOne(market.token, market.quote, buying), input);
				const [quotedResult] = await proto.relay([{
					method: "eth_call",
					params: [{
						to: V4_QUOTER,
						data: quoted
					}, "latest"]
				}]);
				const minOut = withSlippage(BigInt(String(quotedResult).slice(0, 66)), slipBps);
				const spend = buying ? market.quote : market.token;
				if (spend !== "0x0000000000000000000000000000000000000000") {
					if (await readAllowance(proto.relay, spend, wallet.address, pool) < input) {
						setStatus("Sign the approval. The Uniswap v4 pool can spend only this amount.");
						const approveTx = {
							from: wallet.address,
							to: spend,
							data: approveCalldata(pool, input),
							value: 0n
						};
						await estimateOrThrow(proto.relay, approveTx);
						const approveHash = await sendTx(eth, approveTx);
						if (!(await waitForReceipt(proto.relay, approveHash)).ok) throw new Error("Approval reverted.");
					}
				}
				const data = tradeCalldata(market.token, market.quote, buying, input, minOut, wallet.address);
				const tx = {
					from: wallet.address,
					to: pool,
					data,
					value: buying && market.quote === "0x0000000000000000000000000000000000000000" ? input : 0n
				};
				setStatus("Sign the Uniswap v4 trade.");
				await estimateOrThrow(proto.relay, tx);
				const hash = await sendTx(eth, tx);
				if (!(await waitForReceipt(proto.relay, hash)).ok) throw new Error("Trade reverted.");
				toast.success(buying ? "Buy landed on Uniswap v4." : "Sell landed on Uniswap v4.");
				setStatus("");
				onDone();
				return;
			}
			if (side === "buy") {
				const value = parseEth(amount);
				if (value == null || value < 10000000000000n) throw new Error(`Enter at least 0.00001 ${market.quoteSymbol}.`);
				const tokens = await quoteCurveBuy(proto.relay, market.curve, wallet.address ?? market.creator, value);
				const minTokens = withSlippage(tokens, slipBps);
				if (market.quote !== "0x0000000000000000000000000000000000000000") {
					if ((holding?.quoteAllowance ?? 0n) < value) {
						setStatus(`Sign the approval. The curve can spend this ${market.quoteSymbol} amount.`);
						const approveTx = {
							from: wallet.address,
							to: market.quote,
							data: approveCalldata(market.curve, value),
							value: 0n
						};
						await estimateOrThrow(proto.relay, approveTx);
						const approveHash = await sendTx(eth, approveTx);
						if (!(await waitForReceipt(proto.relay, approveHash)).ok) throw new Error("Approval reverted.");
					}
					const data = buyQuoteCalldata(wallet.address, value, minTokens);
					const tx = {
						from: wallet.address,
						to: market.curve,
						data,
						value: 0n
					};
					setStatus("Simulating buy…");
					await estimateOrThrow(proto.relay, tx);
					setStatus("Sign the buy.");
					const hash = await sendTx(eth, tx);
					setStatus("Waiting for the buy…");
					if (!(await waitForReceipt(proto.relay, hash)).ok) throw new Error("Buy reverted.");
					toast.success("Buy landed.");
				} else {
					const data = buyCalldata(wallet.address, minTokens);
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
				}
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
					className: "mb-2 flex items-end justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-serif text-3xl",
						children: mcapUsd == null ? "…" : formatUsd(mcapUsd)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: ["Price ", priceUsd == null ? "…" : formatUsd(priceUsd)]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
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
									formatter: (value) => [rate ? formatUsd(Number(value)) : `${Number(value).toFixed(4)} ${market.quoteSymbol}`, "Mcap"],
									labelFormatter: () => "Market cap",
									contentStyle: {
										background: "#e8f4ff",
										border: "1px solid #c5dff2",
										borderRadius: 12,
										color: "#12304c"
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
									dataKey: "cap",
									stroke: "#1c8fe6",
									fill: "#1c8fe6",
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
						bps: market.progressBps,
						graduated: market.graduated
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted",
						children: [
							formatEth(market.realEth, 4),
							" / 4.2 ",
							market.quoteSymbol,
							" real reserves.",
							market.graduated ? migrated ? " Graduated. Trading is on the locked Uniswap v4 position." : " Graduated. The curve is closed. Open the Uniswap v4 pool to trade." : " Graduation hands the reserves to a locked Uniswap v4 position. The curve then closes."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: migrated ? "This market has graduated. The position is full-range on Uniswap v4 and the hook reverts if anyone tries to remove it. Scanners that only watch Uniswap v2 or v3 still will not list it." : "Not a Uniswap pool yet. Price is the bonding curve until 4.2 of the pair is raised. A Telegram scanner looking for an LP will not see it before graduation."
					})
				] }),
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
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
							label: "Creator fees",
							value: market.feeRecipient.toLowerCase() === "0x0000000000000000000000000000000000000000" ? "Split across holders" : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExplorerLink, {
								kind: "address",
								value: market.feeRecipient,
								children: shortAddr(market.feeRecipient)
							})
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								formatEth(print.ethAmount, 5),
								" ",
								market.quoteSymbol
							] }),
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
			children: [market.graduated && !migrated ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-2xl",
						children: "Open the pool"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "The curve has stopped. This transaction seeds the full-range Uniswap v4 position. The hook will not let anyone remove it. Anyone can send this transaction."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "w-full",
						disabled: pending,
						onClick: () => {
							if (!wallet.address) {
								toast.error("Connect a wallet on Robinhood Chain.");
								return;
							}
							const from = wallet.address;
							setPending(true);
							(async () => {
								try {
									const eth = wallet.ethereum();
									await ensureRobinhood(eth);
									const tx = {
										from,
										to: market.curve,
										data: openPoolCalldata(),
										value: 0n
									};
									setStatus("Sign the pool opening.");
									await estimateOrThrow(proto.relay, tx);
									const hash = await sendTx(eth, tx);
									if (!(await waitForReceipt(proto.relay, hash)).ok) throw new Error("Opening the pool reverted.");
									toast.success("Uniswap v4 pool opened.");
									setStatus("");
									onDone();
								} catch (error) {
									const message = explainError(error);
									setStatus(message);
									toast.error(message);
								} finally {
									setPending(false);
								}
							})();
						},
						children: pending ? "Check your wallet" : "Open Uniswap v4 pool"
					}),
					status ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: status
					}) : null
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
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
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: side === "buy" ? `You pay (${market.quoteSymbol})` : `You sell (whole ${market.symbol})` }), side === "sell" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "font-medium text-primary",
							onClick: () => {
								if (!wallet.address) {
									toast.error("Connect the wallet that holds the tokens.");
									return;
								}
								if (!holding || holding.tokens <= 0n) {
									toast.error("This wallet holds none of this token.");
									return;
								}
								setAmount(formatEth(holding.tokens, 18));
							},
							children: "Sell all"
						}) : null]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
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
					children: pending ? "Check your wallet" : side === "buy" ? migrated ? "Buy on Uniswap v4" : "Buy from curve" : migrated ? "Sell on Uniswap v4" : "Sell to curve"
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
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", { children: ["Your ", market.quoteSymbol] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "text-fg",
								children: holding ? formatEth(market.quote === "0x0000000000000000000000000000000000000000" ? holding.eth : holding.quoteBalance, 5) : "—"
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
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HolderFees, {
				market,
				onDone
			})]
		})]
	});
}
function HolderFees({ market, onDone }) {
	const wallet = useWallet();
	const proto = useProtocol();
	const holders = market.feeRecipient.toLowerCase() === zeroAddress;
	const rewards = proto.info?.rewards;
	const [pendingAmt, setPendingAmt] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [note, setNote] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!holders || !rewards || !wallet.address) {
			setPendingAmt(null);
			return;
		}
		let cancelled = false;
		const data = pendingRewardsCalldata(market.token, wallet.address);
		proto.relay([{
			method: "eth_call",
			params: [{
				to: rewards,
				data
			}, "latest"]
		}]).then(([result]) => {
			if (cancelled) return;
			const hex = String(result ?? "0x0");
			setPendingAmt(hex === "0x" ? 0n : BigInt(hex));
		}).catch(() => {
			if (!cancelled) setPendingAmt(null);
		});
		return () => {
			cancelled = true;
		};
	}, [
		holders,
		rewards,
		wallet.address,
		market.token,
		market.prints.length,
		proto.relay
	]);
	if (!holders) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "mt-4 border-t border-line pt-4 text-sm text-muted",
		children: [
			"Creator fees are paid on each trade to ",
			shortAddr(market.feeRecipient),
			". There is nothing to claim."
		]
	});
	async function claim() {
		if (!wallet.address || !rewards) {
			toast.error("Connect a wallet on Robinhood Chain.");
			return;
		}
		const from = wallet.address;
		setBusy(true);
		try {
			const eth = wallet.ethereum();
			await ensureRobinhood(eth);
			const tx = {
				from,
				to: rewards,
				data: claimRewardsCalldata(market.token),
				value: 0n
			};
			setNote("Sign the claim.");
			await estimateOrThrow(proto.relay, tx);
			const hash = await sendTx(eth, tx);
			if (!(await waitForReceipt(proto.relay, hash)).ok) throw new Error("Claim reverted.");
			toast.success("Holder fees claimed.");
			setNote("");
			onDone();
		} catch (error) {
			const message = explainError(error);
			setNote(message);
			toast.error(message);
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4 flex flex-col gap-2 border-t border-line pt-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium",
				children: "Holder fees"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [
					"This launch splits the creator tax and 70% of the 1% trade fee by balance. Claim pays your share of ",
					market.quoteSymbol,
					"."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm",
				children: wallet.address ? pendingAmt == null ? "Reading your share…" : `${formatEth(pendingAmt, 6)} ${market.quoteSymbol} ready` : "Connect to see your share."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "w-full",
				disabled: busy || !wallet.address || pendingAmt == null || pendingAmt === 0n,
				onClick: () => void claim(),
				children: busy ? "Check your wallet" : "Claim holder fees"
			}),
			note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: note
			}) : null
		]
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
