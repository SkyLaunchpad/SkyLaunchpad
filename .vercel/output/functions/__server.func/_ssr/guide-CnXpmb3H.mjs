import { Z as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as CONNECT_DOCS, n as CHAIN_ID, p as RPC_PUBLIC, r as CHAIN_NAME, s as EXPLORER, t as BRIDGE_DOCS } from "./wallet-I32zn3lV.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as useProtocol } from "./router-CQscQTY8.mjs";
import { o as Notice, s as Shell, t as Button } from "./ui-CoyXQBXO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/guide-CnXpmb3H.js
var import_jsx_runtime = require_jsx_runtime();
var NETWORK = [
	["Network name", CHAIN_NAME],
	["Chain ID", String(CHAIN_ID)],
	["Chain ID (hex)", "0x1237"],
	["RPC URL", RPC_PUBLIC],
	["Currency", "ETH"],
	["Explorer", EXPLORER]
];
function GuidePage() {
	const proto = useProtocol();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-3xl flex-col gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-primary",
					children: "Go live · Robinhood Chain mainnet"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-serif text-4xl leading-tight sm:text-5xl",
					children: "Run SkyLaunchpad for real"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-base text-muted",
					children: [
						"Nothing here is a demo chain. Reads come from mainnet chain ID ",
						CHAIN_ID,
						". A launch is a wallet signature that deploys contracts and moves ETH. This app never holds your keys."
					]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pulse, {
						label: "RPC",
						value: proto.chain ? "Mainnet" : proto.reason ? "Unreachable" : "Reading…"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pulse, {
						label: "Chain",
						value: proto.chain ? String(proto.chain.chainId) : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pulse, {
						label: "Block",
						value: proto.chain ? proto.chain.block.toLocaleString() : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pulse, {
						label: "Gas",
						value: proto.chain ? `${(Number(proto.chain.gas) / 1e9).toFixed(3)} gwei` : "—"
					})
				]
			}),
			proto.chain ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Notice, {
				tone: "ok",
				children: [
					"Robinhood Chain is answering. Latest block ",
					proto.chain.block.toLocaleString(),
					" was read through the app’s read-only relay. Sends still happen in your wallet."
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Notice, {
				tone: "warn",
				children: proto.reason || "Waiting for the first mainnet read."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
				className: "flex flex-col gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
						n: "1",
						title: "Install a wallet",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"Use MetaMask, Rabby, or any wallet that injects ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-fg",
								children: "window.ethereum"
							}),
							". SkyLaunchpad does not have an email login. The address that deploys the factory becomes the fee treasury."
						] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Step, {
						n: "2",
						title: "Add Robinhood Chain",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Connect, then use Switch to Robinhood in the header. If the network is missing, the wallet prompt fills these values. You can also add it by hand." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
								className: "mt-3 overflow-hidden rounded-2xl border border-line",
								children: NETWORK.map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col gap-1 border-b border-line px-3 py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted",
										children: label
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
										className: "flex items-center gap-2 break-all text-fg",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: value }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "min-h-11 shrink-0 rounded-full bg-inset px-3 text-sm text-fg",
											onClick: () => {
												navigator.clipboard.writeText(value).then(() => toast.success(`Copied ${label}`), () => toast.error("Clipboard blocked. Select the value and copy it."));
											},
											children: "Copy"
										})]
									})]
								}, label))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-3",
								children: [
									"Official connection notes:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										className: "underline underline-offset-4",
										href: CONNECT_DOCS,
										target: "_blank",
										rel: "noreferrer",
										children: "Robinhood Chain docs"
									}),
									". Gas is ETH on this chain, not a different coin."
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Step, {
						n: "3",
						title: "Bridge a little ETH",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "A factory deploy is one transaction. A token launch costs 0.0005 ETH plus any creator buy, plus gas. A first trade can be 0.01 ETH. Bridge only what you will use." }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2",
							children: [
								"Bridge from Ethereum using",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									className: "underline underline-offset-4",
									href: BRIDGE_DOCS,
									target: "_blank",
									rel: "noreferrer",
									children: "Robinhood’s bridge guide"
								}),
								". Testnet ETH will not pay mainnet gas. Confirm the wallet shows chain ID ",
								CHAIN_ID,
								" before you send anything."
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Step, {
						n: "4",
						title: "Deploy SkyFactory once",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Open Launch and choose Deploy SkyFactory. You sign one transaction. It deploys the factory and the token and curve implementations. The app checks the bytecode, the version string, and the economics before it will list markets. If the check fails, it refuses the address." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2",
								children: [
									"You receive the 0.0005 ETH launch fee and 30% of the 1% trade fee on markets created while you are treasury. You cannot withdraw liquidity. Share the pinned address, or the page URL which carries",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-fg",
										children: "?factory=0x…"
									}),
									", so other people read the same protocol."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2",
								children: "Already deployed? Paste that factory on the Launch page. A factory from a different build will not pin."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Step, {
						n: "5",
						title: "Launch a token",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Name (1–32 characters), symbol (1–8 letters or numbers), optional short description, optional creator buy. One signature creates the token, the curve, and your buy. Supply is one billion, all minted to the curve. There is no second mint." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2",
							children: "Opening price is a 1.5 ETH virtual reserve. That virtual ETH is not money. Real ETH appears only when someone buys."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
						n: "6",
						title: "Trade",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Buys pay ETH to the curve. After a 1% fee, the rest is locked as real reserves and you receive tokens. Sells need an approval, then the curve pays ETH it actually holds. A sell cannot drain the virtual offset. Slippage is enforced on chain with the minimum you signed." })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
						n: "7",
						title: "Graduation is a mark, not a migration",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "When real reserves reach 4.2 ETH the market is graduated forever. Trading stays on the same curve. There is no automatic Uniswap migration and no admin key that can move the ETH." })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-2xl border border-line bg-surface p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-2xl",
					children: "What this app will not do"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-3 flex list-disc flex-col gap-2 pl-5 text-sm text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "It will not sign for you, store a seed phrase, or relay a send." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "It will not list a contract whose bytecode is not this build." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "It will not invent market caps. Empty means that factory has no launches yet." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Contracts are unaudited. Tokens can go to zero. This is not Robinhood Markets and not Pons." })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/create",
						className: "inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-fg",
						children: "Open launch"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/simulate",
						className: "inline-flex min-h-11 items-center rounded-full border border-line px-5 text-sm",
						children: "Try the curve first"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "line",
						onClick: () => proto.refresh().then(() => toast.success("Reread mainnet")).catch(() => toast.error("Mainnet read failed")),
						children: "Reread chain"
					})
				]
			})
		]
	}) });
}
function Pulse({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-surface px-4 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "truncate text-base",
			children: value
		})]
	});
}
function Step({ n, title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "rounded-2xl border border-line bg-surface p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-primary",
				children: ["Step ", n]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-1 font-serif text-2xl",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 text-sm leading-6 text-muted",
				children
			})
		]
	});
}
//#endregion
export { GuidePage as component };
