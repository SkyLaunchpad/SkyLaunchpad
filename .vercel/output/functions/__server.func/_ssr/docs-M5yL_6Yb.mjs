import { w as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { I as formatEth, d as MAX_CREATOR_TAX_BPS, g as SNIPE_WINDOW, h as SNIPE_START_BPS, it as useProtocol, r as CHAIN_NAME, s as FEE_BPS, u as LAUNCH_FEE, y as VERSION } from "./wallet-CeYoLLWh.mjs";
import { n as ExplorerLink, s as Shell } from "./ui-BCzYcPRg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/docs-M5yL_6Yb.js
var import_jsx_runtime = require_jsx_runtime();
var BPS = 10000n;
var EXAMPLE = 10n ** 18n;
var EXAMPLE_TAX = 300n;
function snipeAt(second) {
	if (second >= Number(5n)) return 0n;
	return SNIPE_START_BPS * (SNIPE_WINDOW - BigInt(second)) / SNIPE_WINDOW;
}
function pct(bps) {
	const whole = bps / 100n;
	const frac = bps % 100n;
	return frac === 0n ? `${whole}%` : `${whole}.${frac.toString().padStart(2, "0").replace(/0$/, "")}%`;
}
function splitBuy(value, taxBps, snipeBps) {
	const snipe = value * snipeBps / BPS;
	const after = value - snipe;
	const tax = after * taxBps / BPS;
	const fee = after * FEE_BPS / BPS;
	const toCurve = after - tax - fee;
	const protocolFee = fee * 3000n / BPS;
	return {
		snipe,
		tax,
		fee,
		toCurve,
		creator: fee - protocolFee + tax,
		treasury: protocolFee + snipe
	};
}
function DocsPage() {
	const open = splitBuy(EXAMPLE, EXAMPLE_TAX, snipeAt(0));
	const later = splitBuy(EXAMPLE, EXAMPLE_TAX, 0n);
	const proto = useProtocol();
	const info = proto.info;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "mx-auto flex max-w-3xl flex-col gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-primary",
					children: "Resources · Fees"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-serif text-4xl leading-tight sm:text-5xl",
					children: "How ETH is split"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-base text-muted",
					children: "Taxes are taken in ETH when someone trades on a curve. The token itself has no transfer tax, so a wallet-to-wallet send is free. Nobody can withdraw the ETH sitting in a curve. It leaves only when a holder sells."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "factory",
				className: "flex flex-col gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-2xl",
						children: "This factory"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							"Addresses below are the official SkyFactory on ",
							CHAIN_NAME,
							". Every visitor reads that contract. SKY, the site mark, has no token contract."
						]
					}),
					proto.phase === "ready" && info && proto.factory ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "overflow-hidden rounded-2xl border border-line",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Addr, {
								k: "Factory",
								v: proto.factory
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Addr, {
								k: "Treasury",
								v: info.protocol
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Addr, {
								k: "Token implementation",
								v: info.tokenImplementation
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Addr, {
								k: "Curve implementation",
								v: info.curveImplementation
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-b border-line px-4 py-3 last:border-b-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-sm font-medium",
									children: "Version"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "mt-1 text-sm text-muted",
									children: info.version
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-b border-line px-4 py-3 last:border-b-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-sm font-medium",
									children: "Launches"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "mt-1 text-sm text-muted",
									children: info.launchCount.toString()
								})]
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "rounded-2xl border border-line bg-surface px-4 py-3 text-sm text-muted",
						children: [
							proto.phase === "bad" ? proto.reason || "The saved factory did not verify." : proto.phase === "boot" || proto.phase === "checking" ? "Reading the pinned factory…" : "No factory is pinned in this browser yet. Deploy it from Create a token. These addresses appear here after it verifies.",
							" ",
							proto.factory && proto.phase === "bad" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExplorerLink, {
								kind: "address",
								value: proto.factory,
								children: proto.factory
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							"Build expected by this site: ",
							VERSION,
							"."
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-col gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-2xl",
						children: "Who is paid"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "overflow-hidden rounded-2xl border border-line",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "Treasury",
								v: "The wallet that deployed the factory. It receives the launch fee, 100% of the opening tax, and 30% of the 1% trade fee. All of that is paid in the same trade. There is no escrow."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "Your fee wallet",
								v: "Chosen at launch. It receives 100% of the creator tax and 70% of the 1% trade fee, in the same trade. Leave the field blank and that wallet is the one you sign with. Or paste a different address."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "Holders",
								v: "The other launch choice. The same creator-side cash is split across holders in proportion to balance. Each holder claims on the market page. The curve, the locker, and the Uniswap pool manager do not earn."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "Curve",
								v: "What remains after those cuts. That amount is the real reserve and is what sets the price. Nobody can withdraw it."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "Team",
								v: "The creator, plus up to 8 wallets they list. They skip the opening tax only. They still pay the creator tax and the trade fee."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: ["There is no buyback and nothing is locked for five years. The treasury address can be changed later by the current treasury. That change does not move quote already locked in a curve. The fee destination is chosen once, at launch, and cannot be switched later.", info?.rewards ? ` Holder claims are paid by the rewards contract at ${info.rewards}.` : ""]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-col gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-2xl",
					children: "The three cuts"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							title: "Launch fee",
							value: `${formatEth(LAUNCH_FEE, 4)} ETH`,
							detail: "Once, when the token is created. 100% to the treasury. Not a trade."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							title: "Trade fee",
							value: pct(FEE_BPS),
							detail: "30% treasury, 70% to the fee wallet or to holders. Paid from the trade. No five-year lock."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							title: "Creator tax",
							value: `0–${pct(MAX_CREATOR_TAX_BPS)}`,
							detail: "Chosen at launch. 100% to the same destination as the creator share of the trade fee."
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-col gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-2xl",
						children: "A buy, in order"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
						className: "flex list-decimal flex-col gap-2 pl-5 text-sm leading-6 text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Opening tax is taken from the full ETH sent. Team wallets and the creator pay 0. Sells pay 0." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								"Creator tax and the 1% trade fee are each calculated on what remains. They are not stacked on each other. At the ",
								pct(MAX_CREATOR_TAX_BPS),
								" maximum, both cuts together are ",
								pct(MAX_CREATOR_TAX_BPS + FEE_BPS),
								" of that remainder."
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "The rest is added to the curve. Token amount is based on that net, not on the ETH you sent." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "The opening tax goes entirely to the treasury." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Of the 1% trade fee, 30% goes to the treasury and 70% is the creator share." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "The creator tax is added to that share. If the launch picked a fee wallet, both are paid to that wallet in the same trade. If it picked Holders, both are deposited for holders to claim." })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Each cut rounds down to the nearest wei. Leftover wei from the tax and the fee stay in the curve. Holder rewards round down per token; that dust stays in the rewards contract."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-col gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-2xl",
						children: "Opening tax"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm leading-6 text-muted",
						children: [
							"For the first ",
							SNIPE_WINDOW.toString(),
							" seconds after launch, a buy by anyone who is not the creator or on the team list pays an opening tax. It starts at ",
							pct(SNIPE_START_BPS),
							" and falls by one fifth of that each second. It uses the block timestamp, so everyone in the same second pays the same rate. The check is the wallet that receives the tokens."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "overflow-hidden rounded-2xl border border-line",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 bg-inset px-4 py-2 text-sm text-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Second" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Opening tax" })]
						}), Array.from({ length: Number(SNIPE_WINDOW) + 1 }, (_, second) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 border-t border-line px-4 py-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: second === Number(5n) ? `${second}+` : String(second) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: pct(snipeAt(second)) })]
						}, second))]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-col gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "font-serif text-2xl",
						children: [
							"1 ETH buy, ",
							pct(EXAMPLE_TAX),
							" creator tax"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Same buy, two moments. Numbers are what the contract computes."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto rounded-2xl border border-line",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full min-w-[32rem] text-left text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "bg-inset text-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-2 font-medium",
										children: "Where it goes"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-2 font-medium",
										children: "Second 0"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-2 font-medium",
										children: "After 5 seconds"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									label: "Opening tax, to treasury now",
									a: open.snipe,
									b: later.snipe
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									label: "Creator tax, to the fee destination",
									a: open.tax,
									b: later.tax
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									label: "Trade fee, inside the split below",
									a: open.fee,
									b: later.fee
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									label: "Treasury, paid in the trade",
									a: open.treasury,
									b: later.treasury
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									label: "Fee wallet or holders",
									a: open.creator,
									b: later.creator
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									label: "Curve keeps",
									a: open.toCurve,
									b: later.toCurve
								})
							] })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							"At second 0 almost all of the buy is opening tax, and that tax goes to the treasury in the same trade. After the window, a 1 ETH buy puts ",
							formatEth(later.toCurve, 4),
							" ETH in the curve. The fee wallet, or the holders, receive ",
							formatEth(later.creator, 4),
							" ETH. The treasury receives ",
							formatEth(later.treasury, 4),
							" ETH. Nothing is bought back and nothing vests."
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-col gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-2xl",
						children: "A sell"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-6 text-muted",
						children: "There is no opening tax on a sell. The curve prices the tokens first and gets a gross ETH amount. Creator tax and the 1% trade fee come off that gross. The seller receives the rest. Reserves fall by the gross amount, not by what the seller receives, because the tax and the fee left the curve too."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm leading-6 text-muted",
						children: [
							"A sell whose gross is 1 ETH, with a ",
							pct(EXAMPLE_TAX),
							" creator tax, pays the same people as the “after 5 seconds” column: seller ",
							formatEth(later.toCurve, 4),
							" ETH, fee wallet or holders ",
							formatEth(later.creator, 4),
							" ETH, treasury",
							" ",
							formatEth(later.treasury, 4),
							" ETH."
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-col gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-2xl",
						children: "Creating the token"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm leading-6 text-muted",
						children: [
							"The launch transaction sends at least ",
							formatEth(LAUNCH_FEE, 4),
							" ETH. That fee goes entirely to the treasury, including when the pair is a Robinhood stock token. An ETH pair can add extra ETH as the creator’s first buy. A stock pair sends that buy in the stock token, and the wallet must approve it first. The creator is exempt from the opening tax, but that buy still pays the creator tax and the 1% trade fee (30% treasury, 70% to the fee wallet or to holders). Reserves are counted in the pair asset: 1.5 virtual, graduation at 4.2."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-6 text-muted",
						children: "Graduation at 4.2 of the pair is two steps. The crossing buy hands the real reserves to the pool helper and locks the virtual-reserve remainder so the Uniswap price matches the curve. Opening the pool can be retried if it does not land in that same transaction. The position is full range. The hook reverts on remove, and every later swap pays 1% plus the creator tax into the same split. The pool also keeps its own 0.30% liquidity fee inside the locked position."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/contracts",
								className: "underline underline-offset-4",
								children: "Contract source"
							}),
							" · ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/guide",
								className: "underline underline-offset-4",
								children: "How to go live"
							})
						]
					})
				]
			})
		]
	}) });
}
function Addr({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border-b border-line px-4 py-3 last:border-b-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-sm font-medium",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "mt-1 break-all font-mono text-xs leading-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExplorerLink, {
				kind: "address",
				value: v,
				children: v
			})
		})]
	});
}
function Row({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border-b border-line px-4 py-3 last:border-b-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-sm font-medium",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "mt-1 text-sm leading-6 text-muted",
			children: v
		})]
	});
}
function Card({ title, value, detail }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-line bg-surface p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-2xl font-semibold",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm leading-6 text-muted",
				children: detail
			})
		]
	});
}
function Line({ label, a, b }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
		className: "border-t border-line",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
				className: "px-4 py-2 text-left font-normal",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
				className: "px-4 py-2",
				children: [formatEth(a, 6), " ETH"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
				className: "px-4 py-2",
				children: [formatEth(b, 6), " ETH"]
			})
		]
	});
}
//#endregion
export { DocsPage as component };
