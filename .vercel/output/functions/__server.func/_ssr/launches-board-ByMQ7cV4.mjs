import { i as __toESM } from "../_runtime.mjs";
import { Q as require_react, Z as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as formatEth, j as formatMcap, l as GRADUATION_ETH, v as ago, w as displayName } from "./wallet-I32zn3lV.mjs";
import { d as ChevronLeft, i as Star, u as ChevronRight } from "../_libs/lucide-react.mjs";
import { i as useProtocol } from "./router-CQscQTY8.mjs";
import { c as ViewToggle, i as Ident, o as Notice, u as useLaunchSearch } from "./ui-CoyXQBXO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/launches-board-ByMQ7cV4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PINS = "sky.pins";
function bucket(row) {
	if (row.graduated) return "graduated";
	const pct = Number(row.progressBps);
	if (pct >= 7e3) return "near";
	if (pct >= 1500) return "active";
	return "new";
}
function readPins() {
	try {
		const raw = JSON.parse(localStorage.getItem(PINS) || "[]");
		return Array.isArray(raw) ? raw.filter((item) => typeof item === "string") : [];
	} catch {
		return [];
	}
}
function LaunchesBoard() {
	const proto = useProtocol();
	const { query } = useLaunchSearch();
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [sort, setSort] = (0, import_react.useState)("cap");
	const [view, setView] = (0, import_react.useState)("list");
	const [shown, setShown] = (0, import_react.useState)(12);
	const [pins, setPins] = (0, import_react.useState)([]);
	const [pairOpen, setPairOpen] = (0, import_react.useState)(false);
	const scroller = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		setPins(readPins());
	}, []);
	function togglePin(curve) {
		setPins((current) => {
			const next = current.includes(curve) ? current.filter((item) => item !== curve) : [curve, ...current].slice(0, 40);
			localStorage.setItem(PINS, JSON.stringify(next));
			return next;
		});
	}
	const counts = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const row of proto.launches) {
			const key = row.creator.toLowerCase();
			map.set(key, (map.get(key) ?? 0) + 1);
		}
		return map;
	}, [proto.launches]);
	const rows = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		let list = proto.launches.filter((row) => filter === "all" ? true : bucket(row) === filter);
		if (q) list = list.filter((row) => {
			const nick = displayName(row.creator).toLowerCase();
			return `${row.name} ${row.symbol} ${row.token} ${row.creator} ${nick}`.toLowerCase().includes(q);
		});
		list = [...list].sort((a, b) => {
			const ap = pins.includes(a.curve) ? 1 : 0;
			const bp = pins.includes(b.curve) ? 1 : 0;
			if (ap !== bp) return bp - ap;
			if (sort === "new") return b.launchedAt - a.launchedAt;
			return a.marketCap > b.marketCap ? -1 : 1;
		});
		return list;
	}, [
		filter,
		pins,
		proto.launches,
		query,
		sort
	]);
	const trending = (0, import_react.useMemo)(() => [...proto.launches].sort((a, b) => a.marketCap > b.marketCap ? -1 : 1).slice(0, 10), [proto.launches]);
	const visible = rows.slice(0, shown);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-semibold tracking-tight",
					children: "Launches"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/launchpad/create",
					className: "inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-fg",
					children: "Launch a token"
				})]
			}),
			proto.phase === "bad" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Notice, {
				tone: "bad",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: proto.reason }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "mt-2 underline",
					onClick: proto.clearFactory,
					children: "Clear this factory"
				})]
			}) : null,
			proto.phase === "none" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "No factory is pinned in this browser yet. Launch a token to deploy one, or paste an existing factory on the create page."
			}) : null,
			proto.phase === "boot" || proto.phase === "checking" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Reading Robinhood Chain…"
			}) : null,
			trending.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				"aria-label": "Trending",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-semibold",
						children: "Trending"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": "Previous",
							className: "inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface",
							onClick: () => scroller.current?.scrollBy({
								left: -280,
								behavior: "smooth"
							}),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": "Next",
							className: "inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface",
							onClick: () => scroller.current?.scrollBy({
								left: 280,
								behavior: "smooth"
							}),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					ref: scroller,
					className: "flex gap-3 overflow-x-auto pb-1",
					children: trending.map((row, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/market/$curve",
						params: { curve: row.curve },
						className: "flex w-44 shrink-0 items-center gap-3 rounded-2xl border border-line bg-surface p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-muted",
								children: index + 1
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TokenFace, {
								logo: row.logo,
								seed: row.token
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block truncate text-sm font-medium",
										children: row.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-sm text-up",
										children: formatMcap(row.marketCap)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-xs text-muted",
										children: row.graduated ? "Graduated" : `${(Number(row.progressBps) / 100).toFixed(0)}% filled`
									})
								]
							})
						]
					}, row.curve))
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2 overflow-x-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "sr-only",
							htmlFor: "sort-launches",
							children: "Sort"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							id: "sort-launches",
							value: sort,
							onChange: (event) => setSort(event.target.value),
							className: "min-h-11 rounded-full border border-line bg-surface px-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "cap",
								children: "Market cap"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "new",
								children: "New"
							})]
						}),
						[
							["new", "New"],
							["active", "Active"],
							["near", "Near graduation"],
							["graduated", "Graduated"]
						].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setFilter(filter === id ? "all" : id),
							className: `min-h-11 whitespace-nowrap rounded-full px-3 text-sm ${filter === id ? "bg-fg text-bg" : "bg-surface text-muted"}`,
							children: label
						}, id)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setPairOpen((open) => !open),
								className: "min-h-11 whitespace-nowrap rounded-full bg-surface px-3 text-sm text-muted",
								children: "Pair asset"
							}), pairOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute z-10 mt-2 w-40 rounded-xl border border-line bg-surface p-3 text-sm shadow-lg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: "ETH"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted",
									children: "Every curve on this factory."
								})]
							}) : null]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ViewToggle, {
					view,
					onChange: setView
				})]
			}),
			proto.phase === "ready" && rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-line bg-surface px-4 py-12 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-lg font-medium",
					children: "No tokens in this view"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: proto.launches.length === 0 ? "This factory has no launches yet." : "Nothing matches that filter."
				})]
			}) : null,
			visible.length > 0 && view === "grid" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
				children: visible.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TokenCard, {
					row,
					launches: counts.get(row.creator.toLowerCase()) ?? 1,
					pinned: pins.includes(row.curve),
					onPin: () => togglePin(row.curve)
				}) }, row.curve))
			}) : null,
			visible.length > 0 && view === "list" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "overflow-hidden rounded-2xl border border-line bg-surface",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden grid-cols-[minmax(0,1.4fr)_120px_140px_180px] gap-3 border-b border-line px-4 py-2 text-xs text-muted md:grid",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Token pair" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Graph" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-right",
							children: "Market cap"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-right",
							children: "Graduation"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: visible.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "border-b border-line last:border-b-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TokenRow, {
						row,
						launches: counts.get(row.creator.toLowerCase()) ?? 1,
						pinned: pins.includes(row.curve),
						onPin: () => togglePin(row.curve)
					})
				}, row.curve)) })]
			}) : null,
			rows.length > shown ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setShown((count) => count + 12),
				className: "mx-auto min-h-11 rounded-full border border-line bg-surface px-5 text-sm",
				children: "Show more"
			}) : null,
			proto.info && proto.info.launchCount > BigInt(proto.launches.length) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-center text-sm text-muted",
				children: [
					"Showing the latest ",
					proto.launches.length,
					" of ",
					proto.info.launchCount.toString(),
					"."
				]
			}) : null
		]
	});
}
function TokenFace({ logo, seed }) {
	const [bad, setBad] = (0, import_react.useState)(false);
	if (logo.startsWith("http") && !bad) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: logo,
		alt: "",
		className: "h-11 w-11 shrink-0 rounded-2xl bg-inset object-cover",
		onError: () => setBad(true)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ident, { seed });
}
function Spark({ bps }) {
	const p = Math.max(.08, Math.min(1, Number(bps) / 1e4));
	const points = Array.from({ length: 16 }, (_, i) => {
		const t = i / 15;
		const y = 28 - Math.pow(t, 1.4) * 22 * p;
		return `${(t * 96).toFixed(1)},${y.toFixed(1)}`;
	}).join(" ");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 96 32",
		className: "h-8 w-full",
		"aria-hidden": true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", {
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2",
			className: p > .08 ? "text-up" : "text-muted",
			points
		})
	});
}
function TokenRow({ row, launches, pinned, onPin }) {
	const pct = Math.max(0, Math.min(100, Number(row.progressBps) / 100));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid items-center gap-3 px-4 py-3 md:grid-cols-[minmax(0,1.4fr)_120px_140px_180px]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TokenFace, {
					logo: row.logo,
					seed: row.token
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/market/$curve",
							params: { curve: row.curve },
							className: "truncate font-medium hover:text-primary",
							children: row.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": pinned ? `Unpin ${row.symbol}` : `Pin ${row.symbol}`,
							onClick: onPin,
							className: `inline-flex h-8 w-8 items-center justify-center ${pinned ? "text-primary" : "text-muted"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
								className: "h-4 w-4",
								fill: pinned ? "currentColor" : "none"
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "truncate text-sm text-muted",
						children: [
							row.symbol,
							" · ETH · ",
							ago(row.launchedAt),
							" ·",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/profile/$address",
								params: { address: row.creator },
								className: "hover:text-fg",
								children: displayName(row.creator)
							}),
							launches > 1 ? ` · ${launches} launches` : ""
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden md:block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spark, { bps: row.progressBps })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: `text-lg font-semibold md:text-right ${row.realEth > 0n ? "text-up" : "text-fg"}`,
				children: formatMcap(row.marketCap)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-1.5 overflow-hidden rounded-full bg-inset",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full bg-up",
					style: { width: `${pct}%` }
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-right text-xs text-muted",
				children: row.graduated ? "Graduated" : `${formatEth(row.realEth, 2)} / ${formatEth(GRADUATION_ETH, 1)} ETH`
			})] })
		]
	});
}
function TokenCard({ row, launches, pinned, onPin }) {
	const pct = Math.max(0, Math.min(100, Number(row.progressBps) / 100));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col gap-3 rounded-2xl border border-line bg-surface p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TokenFace, {
						logo: row.logo,
						seed: row.token
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/market/$curve",
							params: { curve: row.curve },
							className: "block truncate font-medium hover:text-primary",
							children: row.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "truncate text-sm text-muted",
							children: [
								displayName(row.creator),
								launches > 1 ? ` · ${launches}` : "",
								" · ",
								ago(row.launchedAt)
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": pinned ? "Unpin" : "Pin",
						onClick: onPin,
						className: pinned ? "text-primary" : "text-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
							className: "h-4 w-4",
							fill: pinned ? "currentColor" : "none"
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spark, { bps: row.progressBps }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-semibold text-up",
					children: formatMcap(row.marketCap)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 h-1.5 overflow-hidden rounded-full bg-inset",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full bg-up",
						style: { width: `${pct}%` }
					})
				})]
			})
		]
	});
}
//#endregion
export { LaunchesBoard as t };
