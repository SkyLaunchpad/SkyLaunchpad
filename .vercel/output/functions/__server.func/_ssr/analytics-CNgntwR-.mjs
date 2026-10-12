import { Z as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as formatEth, R as shortAddr, S as capNumber } from "./wallet-I32zn3lV.mjs";
import { i as useProtocol } from "./router-CQscQTY8.mjs";
import { i as Ident, o as Notice, s as Shell } from "./ui-CoyXQBXO.mjs";
import { c as Tooltip, i as XAxis, n as BarChart, o as Bar, r as YAxis, s as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/analytics-CNgntwR-.js
var import_jsx_runtime = require_jsx_runtime();
function AnalyticsPage() {
	const proto = useProtocol();
	const rows = proto.launches;
	const locked = rows.reduce((sum, row) => sum + row.realEth, 0n);
	const graduated = rows.filter((row) => row.graduated).length;
	const near = rows.filter((row) => !row.graduated && Number(row.progressBps) >= 7e3).length;
	const creators = new Set(rows.map((row) => row.creator.toLowerCase())).size;
	const ranked = [...rows].sort((a, b) => a.marketCap > b.marketCap ? -1 : 1).slice(0, 8);
	const chart = ranked.map((row) => ({
		name: row.symbol || shortAddr(row.token),
		cap: capNumber(row.marketCap)
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-primary",
					children: "Analytics"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-serif text-4xl",
					children: "What this factory actually holds"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 max-w-xl text-muted",
					children: [
						"Figures are the latest ",
						rows.length,
						" markets returned by the pinned SkyFactory. There is no off-chain index and no estimated dollar price."
					]
				})
			] }),
			proto.phase !== "ready" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Notice, { children: [
				proto.phase === "bad" ? proto.reason : "Pin a verified factory on the Launch page. Until then there is nothing on chain to chart.",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/create",
					className: "underline",
					children: "Launch"
				})
			] }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Markets shown",
						value: String(rows.length)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Real ETH locked",
						value: formatEth(locked, 4)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Near graduation",
						value: String(near)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Graduated",
						value: String(graduated)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-2xl border border-line bg-surface p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-end justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-2xl",
						children: "Market cap, ETH"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [creators, " creators in this window"]
					})]
				}), chart.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "py-10 text-center text-sm text-muted",
					children: "No launches to rank."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-72",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: chart,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "name",
									stroke: "var(--color-muted)",
									fontSize: 12,
									tickLine: false,
									axisLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { hide: true }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									formatter: (value) => [`${Number(value).toFixed(4)} ETH`, "Mcap"],
									contentStyle: {
										background: "var(--color-inset)",
										border: "1px solid var(--color-line)",
										borderRadius: 12,
										color: "var(--color-fg)"
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "cap",
									fill: "var(--color-primary)",
									radius: 6
								})
							]
						})
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "flex flex-col gap-2",
				children: ranked.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/market/$curve",
					params: { curve: row.curve },
					className: "flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface px-3 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex min-w-0 items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ident, { seed: row.token }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "block truncate font-medium",
								children: [
									row.name,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted",
										children: row.symbol
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "block text-sm text-muted",
								children: [formatEth(row.realEth, 4), " ETH real"]
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-right text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "block",
							children: [formatEth(row.marketCap), " ETH"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted",
							children: row.graduated ? "Graduated" : "Open"
						})]
					})]
				}) }, row.curve))
			})
		]
	}) });
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-surface px-4 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-sm text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "truncate text-base",
			children: value
		})]
	});
}
//#endregion
export { AnalyticsPage as component };
