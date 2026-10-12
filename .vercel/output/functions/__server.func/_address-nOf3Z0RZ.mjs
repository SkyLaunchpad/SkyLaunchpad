import { Z as require_jsx_runtime, x as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { A as formatEth, R as shortAddr, b as bpsLabel, v as ago } from "./_ssr/wallet-I32zn3lV.mjs";
import { i as useProtocol, n as Route } from "./_ssr/router-CQscQTY8.mjs";
import { a as Meter, i as Ident, n as ExplorerLink, o as Notice, s as Shell } from "./_ssr/ui-CoyXQBXO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_address-nOf3Z0RZ.js
var import_jsx_runtime = require_jsx_runtime();
function ProfilePage() {
	const { address } = Route.useParams();
	const proto = useProtocol();
	const mine = proto.launches.filter((row) => row.creator.toLowerCase() === address.toLowerCase());
	const locked = mine.reduce((sum, row) => sum + row.realEth, 0n);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-primary",
					children: "Creator"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "break-all font-serif text-3xl sm:text-4xl",
					children: shortAddr(address)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExplorerLink, {
						kind: "address",
						value: address,
						children: "View on the explorer"
					})
				})
			] }),
			proto.phase !== "ready" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Notice, { children: [
				"Creator markets are read from the pinned factory.",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/create",
					className: "underline",
					children: "Pin one"
				}),
				" ",
				"to see launches by this address. The list only includes the newest markets the factory returns."
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-surface px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-sm text-muted",
						children: "Launches in view"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: mine.length })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-surface px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-sm text-muted",
						children: "Real ETH in those curves"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: formatEth(locked, 4) })]
				})]
			}),
			proto.phase === "ready" && mine.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-2xl border border-line bg-surface px-4 py-8 text-center text-sm text-muted",
				children: "No launch by this address in the current window."
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "flex flex-col gap-2",
				children: mine.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/market/$curve",
					params: { curve: row.curve },
					className: "grid items-center gap-3 rounded-2xl border border-line bg-surface px-3 py-3 sm:grid-cols-[1fr_auto]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ident, { seed: row.token }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "block font-medium",
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
							children: [
								ago(row.launchedAt),
								" · ",
								row.graduated ? "Graduated" : bpsLabel(row.progressBps)
							]
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "max-w-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
							bps: row.progressBps,
							graduated: row.graduated
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "mt-1 block text-sm text-muted",
							children: [formatEth(row.marketCap), " ETH mcap"]
						})]
					})]
				}) }, row.curve))
			})
		]
	}) });
}
//#endregion
export { ProfilePage as component };
