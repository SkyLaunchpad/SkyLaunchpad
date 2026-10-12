import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { decodeEventLog, zeroAddress, type Address, type Hex } from "viem";
import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Button, controlClass, Field } from "@/components/ui";
import { factoryAbi } from "@/lib/chain/artifacts";
import {
  ensureRobinhood,
  estimateOrThrow,
  approveCalldata,
  factoryInitData,
  launchCalldata,
  mineHookSalt,
  pendingNonce,
  predictedFactory,
  sendTx,
  waitForReceipt,
  type TxReceipt,
} from "@/lib/chain/browser";
import { explainError, formatEth, formatTokens, isAddress, parseEth } from "@/lib/chain/format";
import { applyBuy, initialSnap, marketCapOf, withSlippage } from "@/lib/chain/math";
import { GRADUATION_ETH, LAUNCH_FEE, MAX_CREATOR_TAX_BPS, MIN_TRADE_ETH, VIRTUAL_ETH } from "@/lib/chain/params";
import { useProtocol } from "@/lib/chain/protocol";
import { hostLogo } from "@/lib/chain/logo-host";
import { quoteInitialBuy, readAllowance } from "@/lib/chain/reads";
import { listStockPairs, type StockAsset } from "@/lib/chain/stocks";
import { useWallet } from "@/lib/chain/wallet";

function launchedFrom(receipt: TxReceipt): { token: Address; curve: Address } | null {
  for (const log of receipt.logs) {
    if (log.topics.length === 0) continue;
    try {
      const decoded = decodeEventLog({
        abi: factoryAbi,
        data: log.data,
        topics: log.topics as [Hex, ...Hex[]],
      });
      if (decoded.eventName === "Launched") {
        return { token: decoded.args.token, curve: decoded.args.curve };
      }
    } catch {
      // unrelated log
    }
  }
  return null;
}

function logoOk(value: string): boolean {
  const logo = value.trim();
  return logo.length > 0 && logo.length <= 160 && /^https:\/\/\S+$/.test(logo);
}

async function shrinkLogo(file: File): Promise<{ data: string; type: string }> {
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) throw new Error("Could not read that image.");
  try {
    const max = 512;
    const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
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
    let blob = await canvasBlob(canvas, mime, keepAlpha ? undefined : 0.86);
    let type = mime;
    if (blob.size > 1_800_000 && keepAlpha) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(bitmap, 0, 0, width, height);
      blob = await canvasBlob(canvas, "image/jpeg", 0.86);
      type = "image/jpeg";
    }
    if (blob.size > 2_000_000) throw new Error("Image must be under 2 MB.");
    return { data: await blobToBase64(blob), type };
  } finally {
    bitmap.close();
  }
}

function canvasBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Could not read that image."))),
      type,
      quality,
    );
  });
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const value = String(reader.result || "");
      const comma = value.indexOf(",");
      resolve(comma >= 0 ? value.slice(comma + 1) : value);
    };
    reader.onerror = () => reject(new Error("Could not read that image."));
    reader.readAsDataURL(blob);
  });
}

export function CreateToken() {
  const proto = useProtocol();
  const uploadLogo = useServerFn(hostLogo);
  const loadStocks = useServerFn(listStockPairs);
  const wallet = useWallet();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState("");
  const [localPreview, setLocalPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [twitter, setTwitter] = useState("");
  const [telegram, setTelegram] = useState("");
  const [website, setWebsite] = useState("");
  const [discord, setDiscord] = useState("");
  const [farcaster, setFarcaster] = useState("");
  const [feePct, setFeePct] = useState("0");
  const [feeMode, setFeeMode] = useState<"wallet" | "holders">("wallet");
  const [feeWallet, setFeeWallet] = useState("");
  const [pair, setPair] = useState<{ symbol: string; name: string; address: Address }>({
    symbol: "ETH",
    name: "Ether",
    address: zeroAddress,
  });
  const [stocks, setStocks] = useState<StockAsset[]>([]);
  const [stockNote, setStockNote] = useState("");
  const [pairQuery, setPairQuery] = useState("");
  const [teamText, setTeamText] = useState("");
  const [buy, setBuy] = useState("");
  const [slipBps, setSlipBps] = useState(100n);
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(false);
  const [chainTokens, setChainTokens] = useState<bigint | null>(null);

  async function onPickLogo(file: File) {
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
      const hosted = await uploadLogo({ data: { data: prepared.data, type: prepared.type } });
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

  useEffect(() => {
    let cancelled = false;
    loadStocks()
      .then((rows) => {
        if (!cancelled) setStocks(rows);
      })
      .catch((error) => {
        if (!cancelled) setStockNote(explainError(error));
      });
    return () => {
      cancelled = true;
    };
  }, [loadStocks]);

  useEffect(() => {
    if (proto.phase !== "ready" || !proto.factory || devBuy < MIN_TRADE_ETH) {
      setChainTokens(null);
      return;
    }
    let cancelled = false;
    const timer = window.setTimeout(() => {
      void quoteInitialBuy(proto.relay, proto.factory as Address, devBuy, taxBps)
        .then((tokens) => {
          if (!cancelled) setChainTokens(tokens);
        })
        .catch(() => {
          if (!cancelled) setChainTokens(null);
        });
    }, 300);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [devBuy, proto.factory, proto.phase, proto.relay, taxBps]);

  const afterTax = taxBps === 0 ? devBuy : devBuy - (devBuy * BigInt(taxBps)) / 10_000n;
  let previewCap = marketCapOf(initialSnap());
  let previewTokens = 0n;
  let previewError = "";
  if (devBuy > 0n && afterTax >= MIN_TRADE_ETH) {
    try {
      const applied = applyBuy(initialSnap(), afterTax);
      previewCap = marketCapOf(applied.snap);
      previewTokens = chainTokens ?? applied.tokensOut;
    } catch (error) {
      previewError = explainError(error);
    }
  }

  const nameOk = name.trim().length >= 1 && name.trim().length <= 32 && /^[\x20-\x7E]+$/.test(name.trim());
  const symbolOk = /^[A-Za-z0-9]{1,8}$/.test(symbol.trim());
  const descOk = description.trim().length <= 140;
  const imageOk = logoOk(logo);
  const feeOk = feePct.trim() === "" || (Number.isFinite(Number(feePct)) && Number(feePct) >= 0 && Number(feePct) <= maxCreatorPct);
  const buyOk = buyWei !== null && (buyWei === 0n || buyWei >= MIN_TRADE_ETH);
  const identityOk = nameOk && symbolOk && descOk && imageOk;
  const quoteIsEth = pair.address === zeroAddress;
  const total = LAUNCH_FEE + (quoteIsEth && buyOk ? devBuy : 0n);
  const shownPairs = stocks
    .filter((stock) => {
      const q = pairQuery.trim().toLowerCase();
      if (!q) return true;
      return stock.symbol.toLowerCase().includes(q) || stock.name.toLowerCase().includes(q);
    })
    .slice(0, 60);
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
      const tx = { from: wallet.address, data, value: 0n };
      setStatus("Simulating the factory…");
      try {
        await estimateOrThrow(proto.relay, tx);
      } catch (error) {
        const message = explainError(error);
        const relayBlocked = /too large|413|payload|timeout|returned \d{3}/i.test(message);
        if (!relayBlocked) throw error;
        setStatus("The network relay could not simulate this factory. Your wallet will check it.");
      }
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
      const team = teamText
        .split(/[\s,]+/)
        .map((part) => part.trim())
        .filter(Boolean)
        .slice(0, 8) as Address[];
      if (team.some((address) => !isAddress(address))) throw new Error("Exemption list has an invalid address.");
      const minTokens = devBuy === 0n ? 0n : withSlippage(previewTokens, slipBps);
      const eth = wallet.ethereum();
      await ensureRobinhood(eth);
      if (!quoteIsEth && devBuy > 0n) {
        const allowance = await readAllowance(proto.relay, pair.address, wallet.address, proto.factory);
        if (allowance < devBuy) {
          setStatus(`Approve ${pair.symbol} for the opening buy.`);
          const approveTx = {
            from: wallet.address,
            to: pair.address,
            data: approveCalldata(proto.factory, devBuy),
            value: 0n,
          };
          await estimateOrThrow(proto.relay, approveTx);
          const approveHash = await sendTx(eth, approveTx);
          const approveReceipt = await waitForReceipt(proto.relay, approveHash);
          if (!approveReceipt.ok) throw new Error(`${pair.symbol} approval reverted.`);
        }
      }
      if (feeMode === "wallet") {
        const custom = feeWallet.trim();
        if (custom && !isAddress(custom)) throw new Error("Fee wallet is not a valid address.");
      }
      const feeTo = feeMode === "holders" ? zeroAddress : ((feeWallet.trim() || wallet.address) as Address);
      const data = launchCalldata(
        name.trim(),
        symbol.trim(),
        logo.trim(),
        description.trim(),
        {
          twitter: twitter.trim(),
          telegram: telegram.trim(),
          discord: discord.trim(),
          website: website.trim(),
          farcaster: farcaster.trim(),
        },
        pair.address,
        quoteIsEth ? 0n : devBuy,
        taxBps,
        feeMode === "holders" ? zeroAddress : feeTo,
        team,
        minTokens,
      );
      const tx = { from: wallet.address, to: proto.factory, data, value: total };
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
      await navigate({ to: "/market/$curve", params: { curve: created.curve } });
    } catch (error) {
      const message = explainError(error);
      setStatus(message);
      toast.error(message);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Launch a token on Sky.</h1>
          <p className="mt-2 max-w-xl text-muted">
            Two steps on Robinhood Chain. Give it a name and a face, choose what it trades against, and the curve opens the moment you sign.
          </p>
        </div>

        <ol className="flex items-center gap-6 text-sm">
          <li>
            <button type="button" onClick={() => setStep(1)} className="flex items-center gap-2">
              <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${step === 1 ? "bg-fg text-bg" : "bg-inset text-muted"}`}>1</span>
              Identity
            </button>
          </li>
          <li className="h-px w-8 bg-line" />
          <li>
            <button type="button" disabled={!identityOk} onClick={() => identityOk && setStep(2)} className="flex items-center gap-2 disabled:opacity-50">
              <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${step === 2 ? "bg-fg text-bg" : "bg-inset text-muted"}`}>2</span>
              Economics
            </button>
          </li>
        </ol>

        {step === 1 ? (
          <form
            className="flex flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              if (identityOk) setStep(2);
            }}
          >
            <h2 className="text-xl font-semibold">Give it a name and a face.</h2>
            <div>
              <div className="mb-2 flex items-baseline justify-between text-sm">
                <span className="font-medium">Image</span>
                <span className="text-muted">Square logo, under 2 MB</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-line bg-surface">
                  {shown ? <img src={shown} alt="" className="h-full w-full object-cover" /> : <span className="px-2 text-center text-xs text-muted">No image</span>}
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <label className={`inline-flex min-h-11 w-fit cursor-pointer items-center rounded-full border border-line bg-surface px-4 text-sm ${uploading ? "pointer-events-none opacity-60" : ""}`}>
                    {uploading ? "Uploading…" : shown ? "Replace image" : "Choose image"}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/gif,image/webp"
                      className="sr-only"
                      disabled={uploading}
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        event.target.value = "";
                        if (file) void onPickLogo(file);
                      }}
                    />
                  </label>
                  <p className="text-sm text-muted">
                    {uploading
                      ? "Sending the file. The token will store the public link."
                      : imageOk
                        ? "Uploaded. The token stores this public link."
                        : "Pick a file from your computer. PNG, JPG, GIF, or WebP."}
                  </p>
                  <details className="text-sm">
                    <summary className="cursor-pointer text-muted">Or paste an https link</summary>
                    <input
                      value={logo}
                      onChange={(event) => {
                        setLogo(event.target.value);
                        setLocalPreview("");
                      }}
                      placeholder="https://…"
                      className={`${controlClass} mt-2`}
                    />
                  </details>
                </div>
              </div>
            </div>
            <Counter label="Name" value={name.length} max={32}>
              <input value={name} onChange={(event) => setName(event.target.value)} className={controlClass} maxLength={32} required />
            </Counter>
            <Counter label="Ticker" value={symbol.length} max={8}>
              <input value={symbol} onChange={(event) => setSymbol(event.target.value.toUpperCase())} className={controlClass} maxLength={8} required />
            </Counter>
            <Counter label="Description" value={description.length} max={140}>
              <textarea value={description} onChange={(event) => setDescription(event.target.value)} className={`${controlClass} min-h-24 py-2`} maxLength={140} />
            </Counter>
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="X">
                <input value={twitter} onChange={(event) => setTwitter(event.target.value)} className={controlClass} maxLength={48} />
              </Field>
              <Field label="Telegram">
                <input value={telegram} onChange={(event) => setTelegram(event.target.value)} className={controlClass} maxLength={48} />
              </Field>
              <Field label="Website">
                <input value={website} onChange={(event) => setWebsite(event.target.value)} className={controlClass} maxLength={48} />
              </Field>
            </div>
            <details className="text-sm">
              <summary className="cursor-pointer text-muted">Discord and Farcaster</summary>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <input value={discord} onChange={(event) => setDiscord(event.target.value)} placeholder="Discord" className={controlClass} maxLength={48} />
                <input value={farcaster} onChange={(event) => setFarcaster(event.target.value)} placeholder="Farcaster" className={controlClass} maxLength={48} />
              </div>
            </details>
            <Button type="submit" disabled={!identityOk || uploading}>
              Continue
            </Button>
            {uploading ? <p className="text-sm text-muted">Wait for the image upload to finish.</p> : null}
          </form>
        ) : (
          <form
            className="flex flex-col gap-5"
            onSubmit={(event) => {
              event.preventDefault();
              void onLaunch();
            }}
          >
            <h2 className="text-xl font-semibold">Choose what it trades against.</h2>
            <div>
              <p className="mb-2 text-sm font-medium">Paired with</p>
              <input
                value={pairQuery}
                onChange={(event) => setPairQuery(event.target.value)}
                placeholder={stocks.length ? `Search ${stocks.length} Robinhood stocks` : "Search stocks"}
                className={controlClass}
              />
              <div className="mt-2 max-h-64 overflow-y-auto rounded-2xl border border-line">
                <PairChoice
                  selected={quoteIsEth}
                  symbol="ETH"
                  name="Ether"
                  onPick={() => setPair({ symbol: "ETH", name: "Ether", address: zeroAddress })}
                />
                {shownPairs.map((stock) => (
                  <PairChoice
                    key={stock.address}
                    selected={pair.address.toLowerCase() === stock.address.toLowerCase()}
                    symbol={stock.symbol}
                    name={stock.name}
                    onPick={() => setPair(stock)}
                  />
                ))}
                {stocks.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-muted">{stockNote || "Loading Robinhood stock tokens…"}</p>
                ) : shownPairs.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-muted">No stock matches that search.</p>
                ) : null}
              </div>
              <p className="mt-2 text-sm text-muted">
                Buyers pay {pair.symbol}. The curve opens with {formatEth(VIRTUAL_ETH, 1)} {pair.symbol} of virtual reserves and graduates at {formatEth(GRADUATION_ETH, 1)} {pair.symbol} real. The launch fee stays {formatEth(LAUNCH_FEE)} ETH.
              </p>
            </div>
            <Field label="Creator fee" hint={`Up to ${maxCreatorPct}% of each trade. Permanent. It goes to the destination you pick below, and it cannot be raised later.`}>
              <div className="flex items-center gap-2">
                <input value={feePct} onChange={(event) => setFeePct(event.target.value)} inputMode="decimal" className={controlClass} />
                <span className="text-sm text-muted">%</span>
              </div>
            </Field>
            <Field label="Opening buy" hint="Optional. Buys first, in the same transaction as the launch. You pay no opening tax.">
              <div className="flex items-center gap-2">
                <input value={buy} onChange={(event) => setBuy(event.target.value)} inputMode="decimal" placeholder="0" className={controlClass} />
                <span className="text-sm text-muted">{pair.symbol}</span>
              </div>
            </Field>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  [50n, "0.5% slip"],
                  [100n, "1% slip"],
                  [300n, "3% slip"],
                ] as const
              ).map(([bps, label]) => (
                <button key={label} type="button" onClick={() => setSlipBps(bps)} className={`min-h-11 rounded-full px-3 text-sm ${slipBps === bps ? "bg-fg text-bg" : "bg-inset text-muted"}`}>
                  {label}
                </button>
              ))}
            </div>
            <details className="rounded-2xl border border-line bg-surface p-4 text-sm">
              <summary className="cursor-pointer font-medium">Snipe-tax exemptions</summary>
              <p className="mt-2 text-muted">Up to 8 wallets, plus you. Everyone else pays a buy tax that starts at 99% and falls to 0% over 5 seconds. Sells are never opening-taxed.</p>
              <textarea value={teamText} onChange={(event) => setTeamText(event.target.value)} placeholder="0x…, 0x…" className={`${controlClass} mt-3 min-h-20 py-2 font-mono text-xs`} />
            </details>
            <fieldset className="flex flex-col gap-2">
              <legend className="mb-1 text-sm font-medium">Where creator fees go</legend>
              <p className="text-sm text-muted">No buyback. Nothing is locked for five years. Pick one destination. It is permanent.</p>
              <label className={`rounded-2xl border-2 p-4 text-sm ${feeMode === "wallet" ? "border-primary bg-surface" : "border-line bg-surface"}`}>
                <span className="flex items-center gap-2 font-medium">
                  <input type="radio" name="fee-mode" checked={feeMode === "wallet"} onChange={() => setFeeMode("wallet")} /> Your fee wallet
                </span>
                <span className="mt-1 block text-muted">Paid in the same trade. Leave this blank and fees go to the wallet you sign with. Or paste a different wallet.</span>
                {feeMode === "wallet" ? (
                  <input
                    value={feeWallet}
                    onChange={(event) => setFeeWallet(event.target.value)}
                    placeholder={wallet.address ?? "0x… custom wallet"}
                    className={`${controlClass} mt-3 font-mono text-xs`}
                  />
                ) : null}
              </label>
              <label className={`rounded-2xl border-2 p-4 text-sm ${feeMode === "holders" ? "border-primary bg-surface" : "border-line bg-surface"}`}>
                <span className="flex items-center gap-2 font-medium">
                  <input type="radio" name="fee-mode" checked={feeMode === "holders"} onChange={() => setFeeMode("holders")} /> Holders
                </span>
                <span className="mt-1 block text-muted">The creator tax and 70% of the 1% trade fee are split across holders by balance. Each holder claims their share on the market page. The curve, the locker, and the Uniswap pool do not earn.</span>
              </label>
            </fieldset>
            <p className="text-sm text-muted">
              Launch fee {formatEth(LAUNCH_FEE)} ETH. Graduates at {formatEth(GRADUATION_ETH, 2)} {pair.symbol}. Curve fee 1%.
            </p>
            {proto.phase !== "ready" ? (
              <section className="rounded-2xl border border-line bg-surface p-4">
                <h3 className="font-medium">Deploy the V4 factory</h3>
                <p className="mt-1 text-sm text-muted">
                  The saved factory cannot graduate into Uniswap v4. One signature deploys this build. At 4.2 of the pair, reserves move into a full-range position that the hook will not let anyone remove.
                </p>
                <p className="mt-2 break-all font-mono text-xs text-muted">{proto.factory}</p>
                {proto.reason ? <p className="mt-2 text-sm text-down">{proto.reason}</p> : null}
                <div className="mt-3">
                  <Button disabled={pending || !wallet.address} onClick={() => void onDeploy()}>Deploy V4 factory</Button>
                </div>
              </section>
            ) : (
              <p className="break-all text-sm text-up">Factory verified. {proto.factory}</p>
            )}
            <div className="flex gap-2">
              <Button type="button" variant="line" onClick={() => setStep(1)}>Back</Button>
              <Button type="submit" className="flex-1" disabled={pending || proto.phase !== "ready" || !wallet.address || !buyOk || !feeOk}>
                {pending ? "Waiting for wallet…" : proto.phase === "ready" ? `Launch for ${formatEth(total)} ETH${quoteIsEth || devBuy === 0n ? "" : ` + ${formatEth(devBuy, 4)} ${pair.symbol}`}` : "Waiting for the official factory"}
              </Button>
            </div>
            {status ? <p className="text-sm text-muted">{status}</p> : null}
            {previewError ? <p className="text-sm text-down">{previewError}</p> : null}
          </form>
        )}
      </div>

      <aside className="rounded-2xl border border-line bg-surface p-4 lg:sticky lg:top-6">
        <p className="text-sm text-muted">On the board</p>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-inset">
            {shown ? <img src={shown} alt="" className="h-full w-full object-cover" /> : <span className="text-xs text-muted">SKY</span>}
          </div>
          <div>
            <p className="font-semibold">{name.trim() || "Your token"}</p>
            <p className="text-sm text-muted">{symbol.trim() || "TICKER"} · {pair.symbol} pair</p>
          </div>
        </div>
        {description.trim() ? <p className="mt-3 text-sm">{description.trim()}</p> : null}
        <dl className="mt-4 flex flex-col gap-2 border-t border-line pt-4 text-sm">
          <Row k="Supply" v="1,000,000,000" />
          <Row k="Graduates at" v={`${formatEth(GRADUATION_ETH, 2)} ${pair.symbol}`} />
          <Row k="Creator fee" v={`${(taxBps / 100).toFixed(1)}%`} />
          <Row k="Fees go to" v={feeMode === "holders" ? "Holders" : feeWallet.trim() ? `${feeWallet.slice(0, 6)}…${feeWallet.slice(-4)}` : "Your wallet"} />
          <Row k="Launch fee" v={`${formatEth(LAUNCH_FEE)} ETH`} />
          <Row k="Opening mcap" v={`${formatEth(previewCap, 2)} ${pair.symbol}`} />
          <Row k="Tokens to you" v={devBuy === 0n ? "0" : formatTokens(previewTokens)} />
        </dl>
      </aside>
    </div>
  );
}

function PairChoice({
  selected,
  symbol,
  name,
  onPick,
}: {
  selected: boolean;
  symbol: string;
  name: string;
  onPick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onPick}
      className={`flex w-full items-center justify-between gap-3 border-b border-line px-4 py-3 text-left last:border-b-0 ${selected ? "bg-primary/10" : "hover:bg-inset"}`}
    >
      <span>
        <span className="block font-medium">{symbol}</span>
        <span className="block text-sm text-muted">{name}</span>
      </span>
      {selected ? <span className="text-sm text-primary">Selected</span> : null}
    </button>
  );
}

function Counter({ label, value, max, children }: { label: string; value: number; max: number; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-2 text-sm">
      <span className="flex items-baseline justify-between">
        <span className="font-medium">{label}</span>
        <span className="text-muted">{value}/{max}</span>
      </span>
      {children}
    </label>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-muted">{k}</dt>
      <dd>{v}</dd>
    </div>
  );
}
