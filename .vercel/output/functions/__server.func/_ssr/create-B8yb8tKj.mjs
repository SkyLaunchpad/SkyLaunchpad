import { i as __toESM } from "../_runtime.mjs";
import { Q as require_react, S as useNavigate, Z as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as decodeEventLog } from "../_libs/viem.mjs";
import { A as formatEth, B as useWallet, D as explainError, E as estimateOrThrow, F as parseEth, L as sendTx, M as formatTokens, N as isAddress, O as factoryAbi, P as launchCalldata, T as ensureRobinhood, V as waitForReceipt, d as LAUNCH_FEE, k as factoryInitData, l as GRADUATION_ETH } from "./wallet-I32zn3lV.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as useProtocol, s as quoteInitialBuy } from "./router-CQscQTY8.mjs";
import { l as controlClass, r as Field, s as Shell, t as Button } from "./ui-CoyXQBXO.mjs";
import { c as withSlippage, i as marketCapOf, r as initialSnap, t as applyBuy } from "./math-CHOj4-XD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/create-B8yb8tKj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function launchedFrom(receipt) {
	for (const log of receipt.logs) {
		if (log.topics.length === 0) continue;
		try {
			const decoded = decodeEventLog({
				abi: factoryAbi,
				data: log.data,
				topics: log.topics
			});
			if (decoded.eventName === "Launched") return {
				token: decoded.args.token,
				curve: decoded.args.curve
			};
		} catch {}
	}
	return null;
}
function logoOk(value) {
	const logo = value.trim();
	return logo.length > 0 && logo.length <= 160 && /^https:\/\/\S+$/.test(logo);
}
function CreateToken() {
	const proto = useProtocol();
	const wallet = useWallet();
	const navigate = useNavigate();
	const [step, setStep] = (0, import_react.useState)(1);
	const [name, setName] = (0, import_react.useState)("");
	const [symbol, setSymbol] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [logo, setLogo] = (0, import_react.useState)("");
	const [localPreview, setLocalPreview] = (0, import_react.useState)("");
	const [twitter, setTwitter] = (0, import_react.useState)("");
	const [telegram, setTelegram] = (0, import_react.useState)("");
	const [website, setWebsite] = (0, import_react.useState)("");
	const [discord, setDiscord] = (0, import_react.useState)("");
	const [farcaster, setFarcaster] = (0, import_react.useState)("");
	const [feePct, setFeePct] = (0, import_react.useState)("0");
	const [teamText, setTeamText] = (0, import_react.useState)("");
	const [buy, setBuy] = (0, import_react.useState)("");
	const [slipBps, setSlipBps] = (0, import_react.useState)(100n);
	const [paste, setPaste] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("");
	const [pending, setPending] = (0, import_react.useState)(false);
	const [chainTokens, setChainTokens] = (0, import_react.useState)(null);
	const taxBps = Math.min(1e3, Math.max(0, Math.round((Number(feePct) || 0) * 100)));
	const buyWei = parseEth(buy.trim() === "" ? "0" : buy);
	const devBuy = buyWei ?? 0n;
	(0, import_react.useEffect)(() => {
		if (proto.phase !== "ready" || !proto.factory || devBuy < 10000000000000n) {
			setChainTokens(null);
			return;
		}
		let cancelled = false;
		const timer = window.setTimeout(() => {
			quoteInitialBuy(proto.relay, proto.factory, devBuy, taxBps).then((tokens) => {
				if (!cancelled) setChainTokens(tokens);
			}).catch(() => {
				if (!cancelled) setChainTokens(null);
			});
		}, 300);
		return () => {
			cancelled = true;
			window.clearTimeout(timer);
		};
	}, [
		devBuy,
		proto.factory,
		proto.phase,
		proto.relay,
		taxBps
	]);
	const afterTax = taxBps === 0 ? devBuy : devBuy - devBuy * BigInt(taxBps) / 10000n;
	let previewCap = marketCapOf(initialSnap());
	let previewTokens = 0n;
	let previewError = "";
	if (devBuy > 0n && afterTax >= 10000000000000n) try {
		const applied = applyBuy(initialSnap(), afterTax);
		previewCap = marketCapOf(applied.snap);
		previewTokens = chainTokens ?? applied.tokensOut;
	} catch (error) {
		previewError = explainError(error);
	}
	const nameOk = name.trim().length >= 1 && name.trim().length <= 32 && /^[\x20-\x7E]+$/.test(name.trim());
	const symbolOk = /^[A-Za-z0-9]{1,8}$/.test(symbol.trim());
	const descOk = description.trim().length <= 140;
	const imageOk = logoOk(logo);
	const feeOk = feePct.trim() === "" || Number.isFinite(Number(feePct)) && Number(feePct) >= 0 && Number(feePct) <= 10;
	const buyOk = buyWei !== null && (buyWei === 0n || buyWei >= 10000000000000n);
	const identityOk = nameOk && symbolOk && descOk && imageOk;
	const total = LAUNCH_FEE + (buyOk ? devBuy : 0n);
	const shown = imageOk ? logo.trim() : localPreview;
	async function onDeploy() {
		if (!wallet.address) {
			toast.error("Connect a wallet first.");
			return;
		}
		setPending(true);
		setStatus("Confirm the factory deployment in your wallet.");
		try {
			const eth = wallet.ethereum();
			await ensureRobinhood(eth);
			const data = factoryInitData(wallet.address);
			const tx = {
				from: wallet.address,
				data,
				value: 0n
			};
			await estimateOrThrow(proto.relay, tx);
			const hash = await sendTx(eth, tx);
			setStatus("Waiting for the factory…");
			const receipt = await waitForReceipt(proto.relay, hash);
			if (!receipt.ok || !receipt.contractAddress) throw new Error("Factory deployment reverted.");
			await proto.pinFactory(receipt.contractAddress);
			toast.success("Factory verified and pinned.");
			setStatus("");
		} catch (error) {
			const message = explainError(error);
			setStatus(message);
			toast.error(message);
		} finally {
			setPending(false);
		}
	}
	async function onPin() {
		if (!isAddress(paste.trim())) {
			toast.error("Paste a 0x factory address.");
			return;
		}
		setPending(true);
		try {
			await proto.pinFactory(paste.trim());
			toast.success("Factory pinned.");
			setStatus("");
		} catch (error) {
			setStatus(explainError(error));
			toast.error(explainError(error));
		} finally {
			setPending(false);
		}
	}
	async function onLaunch() {
		if (!wallet.address || !proto.factory || proto.phase !== "ready") {
			toast.error("Pin a verified factory and connect a wallet on Robinhood Chain.");
			return;
		}
		if (!identityOk || !buyOk || !feeOk) {
			toast.error("Check the token details before signing.");
			return;
		}
		setPending(true);
		try {
			const team = teamText.split(/[\s,]+/).map((part) => part.trim()).filter(Boolean).slice(0, 8);
			if (team.some((address) => !isAddress(address))) throw new Error("Exemption list has an invalid address.");
			const minTokens = devBuy === 0n ? 0n : withSlippage(previewTokens, slipBps);
			const eth = wallet.ethereum();
			await ensureRobinhood(eth);
			const data = launchCalldata(name.trim(), symbol.trim(), logo.trim(), description.trim(), {
				twitter: twitter.trim(),
				telegram: telegram.trim(),
				discord: discord.trim(),
				website: website.trim(),
				farcaster: farcaster.trim()
			}, taxBps, team, minTokens);
			const tx = {
				from: wallet.address,
				to: proto.factory,
				data,
				value: total
			};
			setStatus("Simulating the launch…");
			await estimateOrThrow(proto.relay, tx);
			setStatus("Sign once. The token, the curve, and your opening buy land together.");
			const hash = await sendTx(eth, tx);
			const receipt = await waitForReceipt(proto.relay, hash);
			if (!receipt.ok) throw new Error("Launch reverted. Nothing was created.");
			const created = launchedFrom(receipt);
			await proto.refresh();
			if (!created) throw new Error("Launch succeeded but the new curve was not in the receipt.");
			toast.success(`${symbol.trim()} is live.`);
			await navigate({
				to: "/market/$curve",
				params: { curve: created.curve }
			});
		} catch (error) {
			const message = explainError(error);
			setStatus(message);
			toast.error(message);
		} finally {
			setPending(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_300px]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-semibold tracking-tight",
					children: "Launch a token on Sky."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-xl text-muted",
					children: "Two steps on Robinhood Chain. Give it a name and a face, choose what it trades against, and the curve opens the moment you sign."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
					className: "flex items-center gap-6 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setStep(1),
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${step === 1 ? "bg-fg text-bg" : "bg-inset text-muted"}`,
								children: "1"
							}), "Identity"]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { className: "h-px w-8 bg-line" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							disabled: !identityOk,
							onClick: () => identityOk && setStep(2),
							className: "flex items-center gap-2 disabled:opacity-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${step === 2 ? "bg-fg text-bg" : "bg-inset text-muted"}`,
								children: "2"
							}), "Economics"]
						}) })
					]
				}),
				step === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "flex flex-col gap-4",
					onSubmit: (event) => {
						event.preventDefault();
						if (identityOk) setStep(2);
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl font-semibold",
							children: "Give it a name and a face."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-2 flex items-baseline justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: "Image"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted",
								children: "Square link, https only"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-line bg-surface",
								children: shown ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: shown,
									alt: "",
									className: "h-full w-full object-cover"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "px-2 text-center text-xs text-muted",
									children: "No image"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex min-w-0 flex-1 flex-col gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: logo,
									onChange: (event) => setLogo(event.target.value),
									placeholder: "https://…",
									className: controlClass
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "inline-flex min-h-11 w-fit cursor-pointer items-center rounded-full border border-line bg-surface px-4 text-sm",
									children: ["Choose image", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "file",
										accept: "image/*",
										className: "sr-only",
										onChange: (event) => {
											const file = event.target.files?.[0];
											if (!file) return;
											setLocalPreview(URL.createObjectURL(file));
											toast.message("Paste an https link. The token stores a link, not the file.");
										}
									})]
								})]
							})]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Counter, {
							label: "Name",
							value: name.length,
							max: 32,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: name,
								onChange: (event) => setName(event.target.value),
								className: controlClass,
								maxLength: 32,
								required: true
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Counter, {
							label: "Ticker",
							value: symbol.length,
							max: 8,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: symbol,
								onChange: (event) => setSymbol(event.target.value.toUpperCase()),
								className: controlClass,
								maxLength: 8,
								required: true
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Counter, {
							label: "Description",
							value: description.length,
							max: 140,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: description,
								onChange: (event) => setDescription(event.target.value),
								className: `${controlClass} min-h-24 py-2`,
								maxLength: 140
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "X",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: twitter,
										onChange: (event) => setTwitter(event.target.value),
										className: controlClass,
										maxLength: 48
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Telegram",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: telegram,
										onChange: (event) => setTelegram(event.target.value),
										className: controlClass,
										maxLength: 48
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Website",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: website,
										onChange: (event) => setWebsite(event.target.value),
										className: controlClass,
										maxLength: 48
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
							className: "text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
								className: "cursor-pointer text-muted",
								children: "Discord and Farcaster"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 grid gap-3 sm:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: discord,
									onChange: (event) => setDiscord(event.target.value),
									placeholder: "Discord",
									className: controlClass,
									maxLength: 48
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: farcaster,
									onChange: (event) => setFarcaster(event.target.value),
									placeholder: "Farcaster",
									className: controlClass,
									maxLength: 48
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: !identityOk,
							children: "Continue"
						}),
						!imageOk ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "An https image link is required. Files stay in the browser."
						}) : null
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "flex flex-col gap-5",
					onSubmit: (event) => {
						event.preventDefault();
						onLaunch();
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl font-semibold",
							children: "Choose what it trades against."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-2 text-sm font-medium",
							children: "Paired with"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border-2 border-primary bg-surface p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: "ETH"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted",
									children: "Ether"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-sm text-muted",
									children: [
										"Buyers pay in ETH on the curve. At ",
										formatEth(GRADUATION_ETH, 1),
										" ETH of real reserves the curve is marked graduated and trading stays on that same locked curve."
									]
								})
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Creator fee",
							hint: "Up to 10% of each trade. Permanent, paid to the launching wallet, and it cannot be raised later.",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: feePct,
									onChange: (event) => setFeePct(event.target.value),
									inputMode: "decimal",
									className: controlClass
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm text-muted",
									children: "%"
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Opening buy",
							hint: "Optional. Buys first, in the same transaction as the launch. You pay no opening tax.",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: buy,
									onChange: (event) => setBuy(event.target.value),
									inputMode: "decimal",
									placeholder: "0",
									className: controlClass
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm text-muted",
									children: "ETH"
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: [
								[50n, "0.5% slip"],
								[100n, "1% slip"],
								[300n, "3% slip"]
							].map(([bps, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setSlipBps(bps),
								className: `min-h-11 rounded-full px-3 text-sm ${slipBps === bps ? "bg-fg text-bg" : "bg-inset text-muted"}`,
								children: label
							}, label))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
							className: "rounded-2xl border border-line bg-surface p-4 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
									className: "cursor-pointer font-medium",
									children: "Snipe-tax exemptions"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-muted",
									children: "Up to 8 wallets, plus you. Everyone else pays a buy tax that starts at 99% and falls to 0% over 5 seconds. Sells are never opening-taxed."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									value: teamText,
									onChange: (event) => setTeamText(event.target.value),
									placeholder: "0x…, 0x…",
									className: `${controlClass} mt-3 min-h-20 py-2 font-mono text-xs`
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
							className: "flex flex-col gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
									className: "mb-1 text-sm font-medium",
									children: "Where your creator fees go"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "rounded-2xl border-2 border-primary bg-surface p-4 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-2 font-medium",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "radio",
											checked: true,
											readOnly: true
										}), " Your fee wallet"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "mt-1 block text-muted",
										children: [
											"Fees are paid to the launching wallet in the same trade. That wallet is ",
											wallet.address ? wallet.address : "the wallet you sign with",
											"."
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl border border-line bg-inset p-4 text-sm text-muted",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium text-fg",
										children: "Buyback and vest"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Not on this curve. Fees are not locked for five years." })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl border border-line bg-inset p-4 text-sm text-muted",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium text-fg",
										children: "Holders"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Not on this curve. Fees are not split across holders." })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: [
								"Launch fee ",
								formatEth(LAUNCH_FEE),
								" ETH. Graduates at ",
								formatEth(GRADUATION_ETH, 2),
								" ETH. Curve fee 1%."
							]
						}),
						proto.phase !== "ready" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "rounded-2xl border border-line bg-surface p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-medium",
									children: "Pin a factory"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted",
									children: "This browser has no verified Sky factory yet. One signature deploys it. You receive launch fees. You still cannot touch curve ETH."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex flex-col gap-2 sm:flex-row",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										disabled: pending || !wallet.address,
										onClick: () => void onDeploy(),
										children: "Deploy factory"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "line",
										disabled: pending,
										onClick: () => void wallet.connect().catch((error) => toast.error(explainError(error))),
										children: wallet.address ? "Wallet connected" : "Connect wallet"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex flex-col gap-2 sm:flex-row",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: paste,
										onChange: (event) => setPaste(event.target.value),
										placeholder: "Or paste a factory 0x…",
										className: controlClass
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "line",
										disabled: pending,
										onClick: () => void onPin(),
										children: "Verify and pin"
									})]
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-up",
							children: "Factory verified."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "line",
								onClick: () => setStep(1),
								children: "Back"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "flex-1",
								disabled: pending || proto.phase !== "ready" || !wallet.address || !buyOk || !feeOk,
								children: pending ? "Waiting for wallet…" : proto.phase === "ready" ? `Launch for ${formatEth(total)} ETH` : "Pin a factory to launch"
							})]
						}),
						status ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: status
						}) : null,
						previewError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-down",
							children: previewError
						}) : null
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "rounded-2xl border border-line bg-surface p-4 lg:sticky lg:top-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "On the board"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-inset",
						children: shown ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: shown,
							alt: "",
							className: "h-full w-full object-cover"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted",
							children: "SKY"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold",
						children: name.trim() || "Your token"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [symbol.trim() || "TICKER", " · ETH pair"]
					})] })]
				}),
				description.trim() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm",
					children: description.trim()
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-4 flex flex-col gap-2 border-t border-line pt-4 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Supply",
							v: "1,000,000,000"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Graduates at",
							v: `${formatEth(GRADUATION_ETH, 2)} ETH`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Creator fee",
							v: `${(taxBps / 100).toFixed(1)}%`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Launch fee",
							v: `${formatEth(LAUNCH_FEE)} ETH`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Opening mcap",
							v: `${formatEth(previewCap, 2)} ETH`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Tokens to you",
							v: devBuy === 0n ? "0" : formatTokens(previewTokens)
						})
					]
				})
			]
		})]
	});
}
function Counter({ label, value, max, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex flex-col gap-2 text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "flex items-baseline justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-medium",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-muted",
				children: [
					value,
					"/",
					max
				]
			})]
		}), children]
	});
}
function Row({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-muted",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: v })]
	});
}
var SplitComponent = function LaunchCreatePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreateToken, {}) });
};
//#endregion
export { SplitComponent as component };
