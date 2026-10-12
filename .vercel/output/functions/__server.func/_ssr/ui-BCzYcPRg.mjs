import { i as __toESM } from "../_runtime.mjs";
import { Q as require_react, m as useRouterState, w as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as explainError, it as useProtocol, j as ensureRobinhood, nt as shortAddr, o as EXPLORER, ot as useWallet } from "./wallet-CeYoLLWh.mjs";
import { a as Search, c as LayoutGrid, l as LayoutList, o as Moon, r as Sun, s as Menu, t as X } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ui-BCzYcPRg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Button({ children, variant = "primary", className = "", type = "button", ...props }) {
	const styles = {
		primary: "bg-primary text-primary-fg hover:opacity-90",
		ghost: "bg-transparent text-fg hover:bg-inset",
		line: "border border-line bg-surface text-fg hover:border-primary"
	}[variant];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type,
		className: `inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${styles} ${className}`,
		...props,
		children
	});
}
function Field({ label, hint, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex flex-col gap-2 text-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-medium text-fg",
				children: label
			}),
			children,
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm text-muted",
				children: hint
			}) : null
		]
	});
}
var controlClass = "min-h-11 w-full rounded-xl border border-line bg-inset px-3 text-base text-fg outline-none placeholder:text-muted focus:border-primary";
function Notice({ tone = "warn", children }) {
	const styles = {
		warn: "border-primary/40 bg-primary/10 text-fg",
		bad: "border-primary bg-primary/15 text-fg",
		ok: "border-up/40 bg-up/10 text-fg"
	}[tone];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `rounded-2xl border px-4 py-3 text-sm leading-6 ${styles}`,
		children
	});
}
function Ident({ seed, className = "" }) {
	let hash = 2166136261;
	for (const char of seed || "sky") hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
	const cells = [];
	const tones = [];
	for (let row = 0; row < 5; row++) for (let col = 0; col < 3; col++) {
		const bit = hash >> row * 3 + col & 1;
		const tone = hash >> 16 + row + col & 1;
		cells[row * 5 + col] = bit === 1;
		cells[row * 5 + (4 - col)] = bit === 1;
		tones[row * 5 + col] = tone === 1;
		tones[row * 5 + (4 - col)] = tone === 1;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `grid h-11 w-11 shrink-0 grid-cols-5 grid-rows-5 gap-px rounded-2xl bg-inset p-1.5 ${className}`,
		"aria-hidden": true,
		children: cells.map((on, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: on ? tones[index] ? "bg-primary" : "bg-fg/70" : "bg-transparent" }, index))
	});
}
function Meter({ bps, graduated }) {
	const width = Math.max(0, Math.min(100, Number(bps) / 100));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-2 overflow-hidden rounded-full bg-inset",
		role: "meter",
		"aria-valuenow": Math.round(width),
		"aria-valuemin": 0,
		"aria-valuemax": 100,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `h-full ${graduated ? "bg-up" : "bg-primary"}`,
			style: { width: `${width}%` }
		})
	});
}
function ExplorerLink({ kind, value, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		className: "underline decoration-line underline-offset-4 hover:text-primary",
		href: `${EXPLORER}/${kind}/${value}`,
		target: "_blank",
		rel: "noreferrer",
		children: children ?? value
	});
}
var NAV = [
	{
		to: "/launchpad/create",
		label: "Create a token",
		test: (path) => path.startsWith("/launchpad/create") || path.startsWith("/create")
	},
	{
		to: "/launchpad",
		label: "Launches",
		test: (path) => path === "/" || path === "/launchpad"
	},
	{
		to: "/plp",
		label: "PLP",
		test: (path) => path.startsWith("/plp")
	},
	{
		to: "/analytics",
		label: "Analytics",
		test: (path) => path.startsWith("/analytics")
	}
];
var SearchCtx = (0, import_react.createContext)({
	query: "",
	setQuery: () => {}
});
function useLaunchSearch() {
	return (0, import_react.useContext)(SearchCtx);
}
function Shell({ children }) {
	const pathname = useRouterState({ select: (state) => state.location.pathname });
	const proto = useProtocol();
	const [query, setQuery] = (0, import_react.useState)("");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [theme, setTheme] = (0, import_react.useState)("light");
	(0, import_react.useEffect)(() => {
		const next = localStorage.getItem("sky.theme") === "dark" ? "dark" : "light";
		setTheme(next);
		document.documentElement.dataset.theme = next === "dark" ? "dark" : "";
	}, []);
	(0, import_react.useEffect)(() => {
		const onKey = (event) => {
			const target = event.target;
			const typing = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;
			if (event.key === "/" && !typing) {
				event.preventDefault();
				document.getElementById("sky-search")?.focus();
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);
	function toggleTheme() {
		const next = theme === "dark" ? "light" : "dark";
		setTheme(next);
		document.documentElement.dataset.theme = next === "dark" ? "dark" : "";
		localStorage.setItem("sky.theme", next);
	}
	const side = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/launchpad",
				className: "flex items-center gap-2 px-1",
				onClick: () => setOpen(false),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/sky-mark.png",
					alt: "",
					className: "h-11 w-11 object-contain"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-xl font-semibold leading-none tracking-tight",
					children: "Sky"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted",
					children: "Launchpad"
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "rounded-2xl border border-line bg-surface px-3 py-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-baseline justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-muted",
							children: "Name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "text-right font-medium",
							children: "Sky Launchpad"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 flex items-baseline justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-muted",
							children: "Symbol"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "font-medium",
							children: "SKY"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 flex items-baseline justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-muted",
							children: "Contract"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "font-medium",
							children: "N/A"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 border-t border-line pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-muted",
							children: "Factory"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "mt-1 break-all font-mono text-[11px] leading-4",
							children: proto.phase === "ready" && proto.factory ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								className: "hover:text-fg",
								href: `${EXPLORER}/address/${proto.factory}`,
								target: "_blank",
								rel: "noreferrer",
								children: proto.factory
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Deploy the V4 factory" })
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex min-h-11 items-center gap-2 rounded-xl border border-line bg-surface px-3 text-sm text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
						className: "h-4 w-4 shrink-0",
						"aria-hidden": true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "sky-search",
						value: query,
						onChange: (event) => setQuery(event.target.value),
						placeholder: "Search tokens and people",
						className: "w-full bg-transparent text-base text-fg outline-none placeholder:text-muted"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-md bg-inset px-1.5 py-0.5 text-xs",
						children: "/"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "flex flex-col gap-1",
				"aria-label": "Primary",
				children: NAV.map((item) => {
					const active = item.test(pathname);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: item.to,
						onClick: () => setOpen(false),
						className: `flex min-h-11 items-center rounded-xl px-3 text-sm font-medium ${active ? "bg-inset text-fg" : "text-muted hover:bg-inset hover:text-fg"}`,
						children: item.label
					}, item.to);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-auto flex flex-col gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: toggleTheme,
					className: "flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm text-muted hover:bg-inset hover:text-fg",
					children: [theme === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "h-4 w-4" }), "Theme"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WalletButton, {})]
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchCtx.Provider, {
		value: {
			query,
			setQuery
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-screen md:grid md:grid-cols-[240px_minmax(0,1fr)]",
			children: [
				open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "fixed inset-0 z-30 bg-fg/40 md:hidden",
					"aria-label": "Close menu",
					onClick: () => setOpen(false)
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: `${open ? "fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-bg p-4 shadow-xl" : "hidden"} border-r border-line md:sticky md:top-0 md:flex md:h-screen md:w-auto md:flex-col md:bg-transparent md:p-3 md:shadow-none`,
					children: [open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line md:hidden",
						onClick: () => setOpen(false),
						"aria-label": "Close menu",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
					}) : null, side]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
							className: "flex items-center gap-3 border-b border-line px-4 py-3 md:hidden",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line",
									onClick: () => setOpen(true),
									"aria-label": "Open menu",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: "/sky-mark.png",
									alt: "",
									className: "h-8 w-8 object-contain"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/launchpad",
									className: "text-lg font-semibold",
									children: "Sky"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "ml-auto",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WalletButton, { compact: true })
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
							className: "mx-auto w-full max-w-6xl px-4 py-6 md:px-8",
							children
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
							className: "mx-auto grid w-full max-w-6xl gap-8 px-4 pb-8 md:grid-cols-3 md:px-8",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-sm font-semibold",
									children: "Launchpad"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
									className: "mt-3 flex flex-col gap-2 text-sm text-muted",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/launchpad/create",
											className: "hover:text-fg",
											children: "Create a token"
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/launchpad",
											className: "hover:text-fg",
											children: "Launches"
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/plp",
											className: "hover:text-fg",
											children: "PLP"
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/analytics",
											className: "hover:text-fg",
											children: "Analytics"
										}) })
									]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-sm font-semibold",
									children: "Resources"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
									className: "mt-3 flex flex-col gap-2 text-sm text-muted",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/docs",
											className: "hover:text-fg",
											children: "Fees and taxes"
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/guide",
											className: "hover:text-fg",
											children: "Go live"
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/simulate",
											className: "hover:text-fg",
											children: "Curve simulator"
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/contracts",
											className: "hover:text-fg",
											children: "Contracts"
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: EXPLORER,
											className: "hover:text-fg",
											target: "_blank",
											rel: "noreferrer",
											children: "Explorer"
										}) })
									]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-sm font-semibold",
									children: "Risks"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-sm leading-6 text-muted",
									children: "SkyLaunchpad is unaudited software. It is not Robinhood Markets and not Pons. Tokens can go to zero. Real ETH stays in the curve until holders sell. Nobody can withdraw it."
								})] })
							]
						})
					]
				})
			]
		})
	});
}
function ViewToggle({ view, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex rounded-xl border border-line bg-surface p-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": "List",
			onClick: () => onChange("list"),
			className: `inline-flex h-9 w-9 items-center justify-center rounded-lg ${view === "list" ? "bg-inset text-fg" : "text-muted"}`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutList, { className: "h-4 w-4" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": "Grid",
			onClick: () => onChange("grid"),
			className: `inline-flex h-9 w-9 items-center justify-center rounded-lg ${view === "grid" ? "bg-inset text-fg" : "text-muted"}`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { className: "h-4 w-4" })
		})]
	});
}
function WalletButton({ compact = false }) {
	const wallet = useWallet();
	const [pending, setPending] = (0, import_react.useState)(false);
	if (!wallet.ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "px-3 text-sm text-muted",
		children: "Wallet…"
	});
	if (!wallet.hasProvider) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		className: "inline-flex min-h-11 items-center justify-center rounded-full border border-line px-4 text-sm",
		href: "https://metamask.io/download/",
		target: "_blank",
		rel: "noreferrer",
		children: "Get a wallet"
	});
	if (!wallet.address) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		className: compact ? "" : "w-full",
		disabled: pending || wallet.busy,
		onClick: () => {
			setPending(true);
			wallet.connect().catch((error) => toast.error(explainError(error))).finally(() => setPending(false));
		},
		children: "Connect wallet"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `flex items-center gap-2 ${compact ? "" : "flex-col"}`,
		children: [!wallet.onRobinhood ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "line",
			className: compact ? "" : "w-full",
			onClick: () => {
				ensureRobinhood(wallet.ethereum()).catch((error) => toast.error(explainError(error)));
			},
			children: "Switch chain"
		}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: `min-h-11 rounded-full border border-line bg-surface px-3 text-sm ${compact ? "" : "w-full"}`,
			onClick: wallet.forget,
			title: "Forget this account in the app",
			children: shortAddr(wallet.address)
		})]
	});
}
//#endregion
export { Meter as a, ViewToggle as c, Ident as i, controlClass as l, ExplorerLink as n, Notice as o, Field as r, Shell as s, Button as t, useLaunchSearch as u };
