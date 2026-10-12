import { w as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { I as formatEth, _ as TOTAL_SUPPLY, a as CREATOR_SHARE_BPS, b as VIRTUAL_ETH, c as GRADUATION_ETH, f as MIN_TRADE_ETH, s as FEE_BPS, u as LAUNCH_FEE, y as VERSION } from "./wallet-CeYoLLWh.mjs";
import { o as Notice, s as Shell } from "./ui-BCzYcPRg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contracts-C-DsNiKQ.js
var import_jsx_runtime = require_jsx_runtime();
var FILES = [
	["SkyParams.sol", "Economics. One library, imported by the others."],
	["SkyFactory.sol", "Deploys the token, the curve, the rewards splitter, and the Uniswap hook."],
	["SkyCurve.sol", "Bonding curve until 4.2 of the pair. No withdraw function."],
	["SkyToken.sol", "Fixed-supply ERC-20. Minted once, to the curve. Checkpoints holder fees."],
	["SkyRewards.sol", "Splits creator fees across holders when a launch picks Holders."],
	["SkyHook.sol", "Locks the Uniswap v4 position and takes the same fee after graduation."],
	["SkyPool.sol", "Seeds the full-range position and routes later trades."],
	["SkyLocker.sol", "Holds the leftover curve tokens. They cannot be withdrawn."]
];
function ContractsPage() {
	const supply = (TOTAL_SUPPLY / 10n ** 18n).toLocaleString();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-3xl flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-primary",
					children: ["Contracts · ", VERSION]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-serif text-4xl",
					children: "What your wallet deploys"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-muted",
					children: "Deploy SkyFactory and the constructor also deploys the token and curve implementations. Each launch is an EIP-1167 clone of those implementations, initialized in the same transaction. The app pins a factory only when its bytecode, version, and parameters match this source."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						k: "Supply",
						v: supply
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						k: "Virtual ETH",
						v: `${formatEth(VIRTUAL_ETH)} ETH`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						k: "Graduation",
						v: `${formatEth(GRADUATION_ETH)} ETH real`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						k: "Launch fee",
						v: `${formatEth(LAUNCH_FEE)} ETH`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						k: "Trade fee",
						v: `${Number(FEE_BPS) / 100}%`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						k: "Creator share of fee",
						v: `${Number(CREATOR_SHARE_BPS) / 100}%`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						k: "Min trade",
						v: `${formatEth(MIN_TRADE_ETH, 5)} ETH`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						k: "Admin on a token",
						v: "None"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "flex flex-col gap-2",
				children: FILES.map(([file, blurb]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-2xl border border-line bg-surface px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						className: "font-medium underline decoration-line underline-offset-4",
						href: `/contracts/${file}`,
						target: "_blank",
						rel: "noreferrer",
						children: file
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: blurb
					})]
				}, file))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Notice, { children: [
				"Source on this site is the source this build compiles. After you deploy, compare the factory address on the explorer with the address the app pinned. An unaudited contract can still contain a bug. Do not send size you cannot lose. The ETH split is written up in",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/docs",
					className: "underline underline-offset-4",
					children: "Fees and taxes"
				}),
				"."
			] })
		]
	}) });
}
function Fact({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-surface px-4 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-sm text-muted",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "text-base",
			children: v
		})]
	});
}
//#endregion
export { ContractsPage as component };
