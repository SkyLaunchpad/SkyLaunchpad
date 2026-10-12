import { i as __toESM } from "../_runtime.mjs";
import { Q as require_react, S as useNavigate, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as createServerFn } from "./ssr.mjs";
import { o as decodeEventLog, t as zeroAddress } from "../_libs/viem.mjs";
import { B as mineHookSalt, C as approveCalldata, F as factoryInitData, G as predictedFactory, H as parseEth, I as formatEth, J as quoteInitialBuy, L as formatTokens, M as estimateOrThrow, N as explainError, P as factoryAbi, R as isAddress$1, U as pendingNonce, X as readAllowance, at as useServerFn, b as VIRTUAL_ETH, c as GRADUATION_ETH, d as MAX_CREATOR_TAX_BPS, it as useProtocol, j as ensureRobinhood, k as createSsrRpc, ot as useWallet, st as waitForReceipt, tt as sendTx, u as LAUNCH_FEE, z as launchCalldata } from "./wallet-CeYoLLWh.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { l as controlClass, r as Field, s as Shell, t as Button } from "./ui-BCzYcPRg.mjs";
import { c as withSlippage, i as marketCapOf, r as initialSnap, t as applyBuy } from "./math-DN_h4F2G.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/create-Jeqizm6h.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TYPES = /* @__PURE__ */ new Set([
	"image/jpeg",
	"image/png",
	"image/gif",
	"image/webp"
]);
function assertLogo(input) {
	if (!input || typeof input !== "object") throw new Error("Missing image.");
	const data = input.data;
	const type = input.type;
	if (typeof data !== "string" || typeof type !== "string") throw new Error("Missing image.");
	if (!TYPES.has(type)) throw new Error("Use a PNG, JPG, GIF, or WebP.");
	if (data.length < 32 || data.length > 28e5) throw new Error("Image must be under 2 MB.");
	return {
		data,
		type
	};
}
/** Turn a logo file into a short public https URL. The token contract stores the link, not the bytes. */
var hostLogo = createServerFn({ method: "POST" }).validator(assertLogo).handler(createSsrRpc("8c5dd71f7e36d5ac2400c8f3e57ecd74befc9ebf5cb7c8c75a2c9b7ab48e2419"));
/** Official Robinhood Stock Tokens on chain 4663. A same ticker at another address is not this list. */
var listStockPairs = createServerFn({ method: "GET" }).handler(createSsrRpc("204a79e0dd3b988dcb000191f56bcb4e22be9a7427d05360d01e51feffde6e7e"));
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
async function shrinkLogo(file) {
	const bitmap = await createImageBitmap(file).catch(() => null);
	if (!bitmap) throw new Error("Could not read that image.");
	try {
		const scale = Math.min(1, 512 / Math.max(bitmap.width, bitmap.height));
		const width = Math.max(1, Math.round(bitmap.width * scale));
		const height = Math.max(1, Math.round(bitmap.height * scale));
		const canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		const ctx = canvas.getContext("2d");
		if (!ctx) throw new Error("Could not read that image.");
		const keepAlpha = file.type !== "image/jpeg";
		if (!keepAlpha) {
			ctx.fillStyle = "#ffffff";
			ctx.fillRect(0, 0, width, height);
		}
		ctx.drawImage(bitmap, 0, 0, width, height);
		const mime = keepAlpha ? "image/png" : "image/jpeg";
		let blob = await canvasBlob(canvas, mime, keepAlpha ? void 0 : .86);
		let type = mime;
		if (blob.size > 18e5 && keepAlpha) {
			ctx.fillStyle = "#ffffff";
			ctx.fillRect(0, 0, width, height);
			ctx.drawImage(bitmap, 0, 0, width, height);
			blob = await canvasBlob(canvas, "image/jpeg", .86);
			type = "image/jpeg";
		}
		if (blob.size > 2e6) throw new Error("Image must be under 2 MB.");
		return {
			data: await blobToBase64(blob),
			type
		};
	} finally {
		bitmap.close();
	}
}
function canvasBlob(canvas, type, quality) {
	return new Promise((resolve, reject) => {
		canvas.toBlob((blob) => blob ? resolve(blob) : reject(/* @__PURE__ */ new Error("Could not read that image.")), type, quality);
	});
}
function blobToBase64(blob) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			const value = String(reader.result || "");
			const comma = value.indexOf(",");
			resolve(comma >= 0 ? value.slice(comma + 1) : value);
		};
		reader.onerror = () => reject(/* @__PURE__ */ new Error("Could not read that image."));
		reader.readAsDataURL(blob);
	});
}
function CreateToken() {
	const proto = useProtocol();
	const uploadLogo = useServerFn(hostLogo);
	const loadStocks = useServerFn(listStockPairs);
	const wallet = useWallet();
	const navigate = useNavigate();
	const [step, setStep] = (0, import_react.useState)(1);
	const [name, setName] = (0, import_react.useState)("");
	const [symbol, setSymbol] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [logo, setLogo] = (0, import_react.useState)("");
	const [localPreview, setLocalPreview] = (0, import_react.useState)("");
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const [twitter, setTwitter] = (0, import_react.useState)("");
	const [telegram, setTelegram] = (0, import_react.useState)("");
	const [website, setWebsite] = (0, import_react.useState)("");
	const [discord, setDiscord] = (0, import_react.useState)("");
	const [farcaster, setFarcaster] = (0, import_react.useState)("");
	const [feePct, setFeePct] = (0, import_react.useState)("0");
	const [feeMode, setFeeMode] = (0, import_react.useState)("wallet");
	const [feeWallet, setFeeWallet] = (0, import_react.useState)("");
	const [pair, setPair] = (0, import_react.useState)({
		symbol: "ETH",
		name: "Ether",
		address: zeroAddress
	});
	const [stocks, setStocks] = (0, import_react.useState)([]);
	const [stockNote, setStockNote] = (0, import_react.useState)("");
	const [pairQuery, setPairQuery] = (0, import_react.useState)("");
	const [teamText, setTeamText] = (0, import_react.useState)("");
	const [buy, setBuy] = (0, import_react.useState)("");
	const [slipBps, setSlipBps] = (0, import_react.useState)(100n);
	const [status, setStatus] = (0, import_react.useState)("");
	const [pending, setPending] = (0, import_react.useState)(false);
	const [chainTokens, setChainTokens] = (0, import_react.useState)(null);
	async function onPickLogo(file) {
		if (!/^image\/(png|jpeg|gif|webp)$/.test(file.type)) {
			toast.error("Use a PNG, JPG, GIF, or WebP.");
			return;
		}
		setUploading(true);
		const preview = URL.createObjectURL(file);
		setLocalPreview((current) => {
			if (current.startsWith("blob:")) URL.revokeObjectURL(current);
			return preview;
		});
		try {
			const prepared = await shrinkLogo(file);
			const hosted = await uploadLogo({ data: {
				data: prepared.data,
				type: prepared.type
			} });
			if (!logoOk(hosted.url)) throw new Error("The image host returned a link this token cannot store.");
			setLogo(hosted.url);
			toast.success("Image uploaded.");
		} catch (error) {
			setLocalPreview((current) => {
				if (!logoOk(logo)) return current;
				if (current.startsWith("blob:")) URL.revokeObjectURL(current);
				return "";
			});
			toast.error(explainError(error));
		} finally {
			setUploading(false);
		}
	}
	const maxCreatorPct = Number(MAX_CREATOR_TAX_BPS) / 100;
	const taxBps = Math.min(maxCreatorPct * 100, Math.max(0, Math.round((Number(feePct) || 0) * 100)));
	const buyWei = parseEth(buy.trim() === "" ? "0" : buy);
	const devBuy = buyWei ?? 0n;
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		loadStocks().then((rows) => {
			if (!cancelled) setStocks(rows);
		}).catch((error) => {
			if (!cancelled) setStockNote(explainError(error));
		});
		return () => {
			cancelled = true;
		};
	}, [loadStocks]);
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
	const feeOk = feePct.trim() === "" || Number.isFinite(Number(feePct)) && Number(feePct) >= 0 && Number(feePct) <= maxCreatorPct;
	const buyOk = buyWei !== null && (buyWei === 0n || buyWei >= 10000000000000n);
	const identityOk = nameOk && symbolOk && descOk && imageOk;
	const quoteIsEth = pair.address === zeroAddress;
	const total = LAUNCH_FEE + (quoteIsEth && buyOk ? devBuy : 0n);
	const shownPairs = stocks.filter((stock) => {
		const q = pairQuery.trim().toLowerCase();
		if (!q) return true;
		return stock.symbol.toLowerCase().includes(q) || stock.name.toLowerCase().includes(q);
	}).slice(0, 60);
	const shown = localPreview || (imageOk ? logo.trim() : "");
	async function onDeploy() {
		if (!wallet.address) {
			toast.error("Connect a wallet first.");
			return;
		}
		setPending(true);
		setStatus("Finding a Uniswap v4 hook address…");
		try {
			const eth = wallet.ethereum();
			await ensureRobinhood(eth);
			const nonce = await pendingNonce(eth, wallet.address);
			const salt = mineHookSalt(predictedFactory(wallet.address, nonce));
			const data = factoryInitData(wallet.address, salt);
			const tx = {
				from: wallet.address,
				data,
				value: 0n
			};
			setStatus("Simulating the factory…");
			await estimateOrThrow(proto.relay, tx);
			setStatus("Sign the factory. This build graduates into a locked Uniswap v4 pool.");
			const hash = await sendTx(eth, tx);
			setStatus("Waiting for the factory…");
			const receipt = await waitForReceipt(proto.relay, hash);
			if (!receipt.ok || !receipt.contractAddress) throw new Error("Factory deployment reverted.");
			await proto.pinFactory(receipt.contractAddress);
			toast.success("V4 factory verified in this browser.");
			setStatus(`Factory ${receipt.contractAddress}`);
		} catch (error) {
			const message = explainError(error);
			setStatus(message);
			toast.error(message);
		} finally {
			setPending(false);
		}
	}
	async function onLaunch() {
		if (!wallet.address || !proto.factory || proto.phase !== "ready") {
			toast.error("Connect a wallet on Robinhood Chain. The official factory must be verified first.");
			return;
		}
		if (!identityOk || !buyOk || !feeOk) {
			toast.error("Check the token details before signing.");
			return;
		}
		setPending(true);
		try {
			const team = teamText.split(/[\s,]+/).map((part) => part.trim()).filter(Boolean).slice(0, 8);
			if (team.some((address) => !isAddress$1(address))) throw new Error("Exemption list has an invalid address.");
			const minTokens = devBuy === 0n ? 0n : withSlippage(previewTokens, slipBps);
			const eth = wallet.ethereum();
			await ensureRobinhood(eth);
			if (!quoteIsEth && devBuy > 0n) {
				if (await readAllowance(proto.relay, pair.address, wallet.address, proto.factory) < devBuy) {
					setStatus(`Approve ${pair.symbol} for the opening buy.`);
					const approveTx = {
						from: wallet.address,
						to: pair.address,
						data: approveCalldata(proto.factory, devBuy),
						value: 0n
					};
					await estimateOrThrow(proto.relay, approveTx);
					const approveHash = await sendTx(eth, approveTx);
					if (!(await waitForReceipt(proto.relay, approveHash)).ok) throw new Error(`${pair.symbol} approval reverted.`);
				}
			}
			if (feeMode === "wallet") {
				const custom = feeWallet.trim();
				if (custom && !isAddress$1(custom)) throw new Error("Fee wallet is not a valid address.");
			}
			const feeTo = feeMode === "holders" ? zeroAddress : feeWallet.trim() || wallet.address;
			const data = launchCalldata(name.trim(), symbol.trim(), logo.trim(), description.trim(), {
				twitter: twitter.trim(),
				telegram: telegram.trim(),
				discord: discord.trim(),
				website: website.trim(),
				farcaster: farcaster.trim()
			}, pair.address, quoteIsEth ? 0n : devBuy, taxBps, feeMode === "holders" ? zeroAddress : feeTo, team, minTokens);
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
								children: "Square logo, under 2 MB"
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
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: `inline-flex min-h-11 w-fit cursor-pointer items-center rounded-full border border-line bg-surface px-4 text-sm ${uploading ? "pointer-events-none opacity-60" : ""}`,
										children: [uploading ? "Uploading…" : shown ? "Replace image" : "Choose image", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "file",
											accept: "image/png,image/jpeg,image/gif,image/webp",
											className: "sr-only",
											disabled: uploading,
											onChange: (event) => {
												const file = event.target.files?.[0];
												event.target.value = "";
												if (file) onPickLogo(file);
											}
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted",
										children: uploading ? "Sending the file. The token will store the public link." : imageOk ? "Uploaded. The token stores this public link." : "Pick a file from your computer. PNG, JPG, GIF, or WebP."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
										className: "text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
											className: "cursor-pointer text-muted",
											children: "Or paste an https link"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: logo,
											onChange: (event) => {
												setLogo(event.target.value);
												setLocalPreview("");
											},
											placeholder: "https://…",
											className: `${controlClass} mt-2`
										})]
									})
								]
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
							disabled: !identityOk || uploading,
							children: "Continue"
						}),
						uploading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "Wait for the image upload to finish."
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-2 text-sm font-medium",
								children: "Paired with"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: pairQuery,
								onChange: (event) => setPairQuery(event.target.value),
								placeholder: stocks.length ? `Search ${stocks.length} Robinhood stocks` : "Search stocks",
								className: controlClass
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 max-h-64 overflow-y-auto rounded-2xl border border-line",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PairChoice, {
										selected: quoteIsEth,
										symbol: "ETH",
										name: "Ether",
										onPick: () => setPair({
											symbol: "ETH",
											name: "Ether",
											address: zeroAddress
										})
									}),
									shownPairs.map((stock) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PairChoice, {
										selected: pair.address.toLowerCase() === stock.address.toLowerCase(),
										symbol: stock.symbol,
										name: stock.name,
										onPick: () => setPair(stock)
									}, stock.address)),
									stocks.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "px-4 py-3 text-sm text-muted",
										children: stockNote || "Loading Robinhood stock tokens…"
									}) : shownPairs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "px-4 py-3 text-sm text-muted",
										children: "No stock matches that search."
									}) : null
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-sm text-muted",
								children: [
									"Buyers pay ",
									pair.symbol,
									". The curve opens with ",
									formatEth(VIRTUAL_ETH, 1),
									" ",
									pair.symbol,
									" of virtual reserves and graduates at ",
									formatEth(GRADUATION_ETH, 1),
									" ",
									pair.symbol,
									" real. The launch fee stays ",
									formatEth(LAUNCH_FEE),
									" ETH."
								]
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Creator fee",
							hint: `Up to ${maxCreatorPct}% of each trade. Permanent. It goes to the destination you pick below, and it cannot be raised later.`,
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
									children: pair.symbol
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
									children: "Where creator fees go"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted",
									children: "No buyback. Nothing is locked for five years. Pick one destination. It is permanent."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: `rounded-2xl border-2 p-4 text-sm ${feeMode === "wallet" ? "border-primary bg-surface" : "border-line bg-surface"}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-2 font-medium",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "radio",
												name: "fee-mode",
												checked: feeMode === "wallet",
												onChange: () => setFeeMode("wallet")
											}), " Your fee wallet"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "mt-1 block text-muted",
											children: "Paid in the same trade. Leave this blank and fees go to the wallet you sign with. Or paste a different wallet."
										}),
										feeMode === "wallet" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: feeWallet,
											onChange: (event) => setFeeWallet(event.target.value),
											placeholder: wallet.address ?? "0x… custom wallet",
											className: `${controlClass} mt-3 font-mono text-xs`
										}) : null
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: `rounded-2xl border-2 p-4 text-sm ${feeMode === "holders" ? "border-primary bg-surface" : "border-line bg-surface"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-2 font-medium",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "radio",
											name: "fee-mode",
											checked: feeMode === "holders",
											onChange: () => setFeeMode("holders")
										}), " Holders"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-1 block text-muted",
										children: "The creator tax and 70% of the 1% trade fee are split across holders by balance. Each holder claims their share on the market page. The curve, the locker, and the Uniswap pool do not earn."
									})]
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
								" ",
								pair.symbol,
								". Curve fee 1%."
							]
						}),
						proto.phase !== "ready" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "rounded-2xl border border-line bg-surface p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-medium",
									children: "Deploy the V4 factory"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted",
									children: "The saved factory cannot graduate into Uniswap v4. One signature deploys this build. At 4.2 of the pair, reserves move into a full-range position that the hook will not let anyone remove."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 break-all font-mono text-xs text-muted",
									children: proto.factory
								}),
								proto.reason ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-down",
									children: proto.reason
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										disabled: pending || !wallet.address,
										onClick: () => void onDeploy(),
										children: "Deploy V4 factory"
									})
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "break-all text-sm text-up",
							children: ["Factory verified. ", proto.factory]
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
								children: pending ? "Waiting for wallet…" : proto.phase === "ready" ? `Launch for ${formatEth(total)} ETH${quoteIsEth || devBuy === 0n ? "" : ` + ${formatEth(devBuy, 4)} ${pair.symbol}`}` : "Waiting for the official factory"
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
						children: [
							symbol.trim() || "TICKER",
							" · ",
							pair.symbol,
							" pair"
						]
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
							v: `${formatEth(GRADUATION_ETH, 2)} ${pair.symbol}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Creator fee",
							v: `${(taxBps / 100).toFixed(1)}%`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Fees go to",
							v: feeMode === "holders" ? "Holders" : feeWallet.trim() ? `${feeWallet.slice(0, 6)}…${feeWallet.slice(-4)}` : "Your wallet"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Launch fee",
							v: `${formatEth(LAUNCH_FEE)} ETH`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Opening mcap",
							v: `${formatEth(previewCap, 2)} ${pair.symbol}`
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
function PairChoice({ selected, symbol, name, onPick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: onPick,
		className: `flex w-full items-center justify-between gap-3 border-b border-line px-4 py-3 text-left last:border-b-0 ${selected ? "bg-primary/10" : "hover:bg-inset"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "block font-medium",
			children: symbol
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "block text-sm text-muted",
			children: name
		})] }), selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm text-primary",
			children: "Selected"
		}) : null]
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
