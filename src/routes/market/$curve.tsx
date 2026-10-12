import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, YAxis } from "recharts";
import { toast } from "sonner";
import { zeroAddress, type Address } from "viem";
import { Button, ExplorerLink, Ident, Meter, Notice, Shell, controlClass } from "@/components/ui";
import {
  approveCalldata,
  buyCalldata,
  buyQuoteCalldata,
  ensureRobinhood,
  estimateOrThrow,
  sellCalldata,
  sendTx,
  waitForReceipt,
} from "@/lib/chain/browser";
import {
  ago,
  bpsLabel,
  capNumber,
  explainError,
  formatEth,
  formatTokens,
  isAddress,
  parseEth,
  shortAddr,
} from "@/lib/chain/format";
import { withSlippage } from "@/lib/chain/math";
import { MIN_TRADE_ETH } from "@/lib/chain/params";
import { useProtocol } from "@/lib/chain/protocol";
import { quoteCurveBuy, quoteCurveSell, readDescription, readHolding, readMarket, type Holding, type MarketDetail } from "@/lib/chain/reads";
import { useWallet } from "@/lib/chain/wallet";

export const Route = createFileRoute("/market/$curve")({
  component: MarketPage,
  params: {
    parse: (params) => {
      if (!isAddress(params.curve)) throw new Error("That market address is not valid.");
      return { curve: params.curve };
    },
  },
});

function MarketPage() {
  const { curve } = Route.useParams();
  const proto = useProtocol();
  const wallet = useWallet();
  const [market, setMarket] = useState<MarketDetail | null>(null);
  const [holding, setHolding] = useState<Holding | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function reload() {
    try {
      const next = await readMarket(proto.relay, curve as Address);
      setMarket(next);
      setError("");
      if (wallet.address) {
        setHolding(await readHolding(proto.relay, next.token, next.curve, wallet.address, next.quote));
      } else {
        setHolding(null);
      }
    } catch (err) {
      setError(explainError(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    void reload();
    const timer = window.setInterval(() => void reload(), 12_000);
    return () => window.clearInterval(timer);
    // reload closes over the latest wallet and relay via the effect deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curve, wallet.address, proto.relay]);

  return (
    <Shell>
      {loading && !market ? <p className="text-muted">Loading market from Robinhood Chain…</p> : null}
      {error ? <Notice tone="bad">{error}</Notice> : null}
      {market ? (
        <TradeDesk
          market={market}
          holding={holding}
          onDone={() => void reload()}
        />
      ) : null}
    </Shell>
  );
}

function TradeDesk({
  market,
  holding,
  onDone,
}: {
  market: MarketDetail;
  holding: Holding | null;
  onDone: () => void;
}) {
  const wallet = useWallet();
  const proto = useProtocol();
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("0.01");
  const [slipBps, setSlipBps] = useState(100n);
  const [quote, setQuote] = useState("");
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState("");
  const description = market.metadataUri.startsWith("data:") ? readDescription(market.metadataUri) : market.metadataUri;
  const chart = market.history.map((point) => ({
    t: point.time,
    cap: capNumber(point.cap),
  }));

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      void (async () => {
        try {
          if (side === "buy") {
            const wei = parseEth(amount);
            if (wei == null || wei < MIN_TRADE_ETH) {
              if (!cancelled) setQuote("");
              return;
            }
            const tokens = await quoteCurveBuy(proto.relay, market.curve, wallet.address ?? market.creator, wei);
            if (!cancelled) setQuote(`About ${formatTokens(tokens)} ${market.symbol}`);
          } else {
            const tokens = parseEth(amount);
            if (tokens == null || tokens <= 0n) {
              if (!cancelled) setQuote("");
              return;
            }
            const eth = await quoteCurveSell(proto.relay, market.curve, tokens);
            if (!cancelled) setQuote(`About ${formatEth(eth, 6)} ${market.quoteSymbol} after the 1% fee`);
          }
        } catch (error) {
          if (!cancelled) setQuote(explainError(error));
        }
      })();
    }, 250);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [amount, side, market.curve, market.symbol, proto.relay]);

  async function submit() {
    if (!wallet.address) {
      toast.error("Connect a wallet on Robinhood Chain.");
      return;
    }
    setPending(true);
    try {
      const eth = wallet.ethereum();
      await ensureRobinhood(eth);
      if (side === "buy") {
        const value = parseEth(amount);
        if (value == null || value < MIN_TRADE_ETH) throw new Error(`Enter at least 0.00001 ${market.quoteSymbol}.`);
        const tokens = await quoteCurveBuy(proto.relay, market.curve, wallet.address ?? market.creator, value);
        const minTokens = withSlippage(tokens, slipBps);
        if (market.quote !== zeroAddress) {
          if ((holding?.quoteAllowance ?? 0n) < value) {
            setStatus(`Sign the approval. The curve can spend this ${market.quoteSymbol} amount.`);
            const approveTx = {
              from: wallet.address,
              to: market.quote,
              data: approveCalldata(market.curve, value),
              value: 0n,
            };
            await estimateOrThrow(proto.relay, approveTx);
            const approveHash = await sendTx(eth, approveTx);
            const approveReceipt = await waitForReceipt(proto.relay, approveHash);
            if (!approveReceipt.ok) throw new Error("Approval reverted.");
          }
          const data = buyQuoteCalldata(wallet.address, value, minTokens);
          const tx = { from: wallet.address, to: market.curve, data, value: 0n };
          setStatus("Simulating buy…");
          await estimateOrThrow(proto.relay, tx);
          setStatus("Sign the buy.");
          const hash = await sendTx(eth, tx);
          setStatus("Waiting for the buy…");
          const receipt = await waitForReceipt(proto.relay, hash);
          if (!receipt.ok) throw new Error("Buy reverted.");
          toast.success("Buy landed.");
        } else {
        const data = buyCalldata(wallet.address, minTokens);
        const tx = { from: wallet.address, to: market.curve, data, value };
        setStatus("Simulating buy…");
        await estimateOrThrow(proto.relay, tx);
        setStatus("Sign the buy.");
        const hash = await sendTx(eth, tx);
        setStatus("Waiting for the buy…");
        const receipt = await waitForReceipt(proto.relay, hash);
        if (!receipt.ok) throw new Error("Buy reverted.");
        toast.success("Buy landed.");
        }
      } else {
        const tokens = parseEth(amount);
        if (tokens == null || tokens <= 0n) throw new Error("Enter a token amount. 1 means one whole token.");
        const ethOut = await quoteCurveSell(proto.relay, market.curve, tokens);
        const allowance = holding?.allowance ?? 0n;
        if (allowance < tokens) {
          setStatus("Sign the approval. The curve can spend only this token amount, not your ETH.");
          const approveTx = {
            from: wallet.address,
            to: market.token,
            data: approveCalldata(market.curve, tokens),
            value: 0n,
          };
          await estimateOrThrow(proto.relay, approveTx);
          const approveHash = await sendTx(eth, approveTx);
          const approveReceipt = await waitForReceipt(proto.relay, approveHash);
          if (!approveReceipt.ok) throw new Error("Approval reverted.");
        }
        const data = sellCalldata(tokens, withSlippage(ethOut, slipBps));
        const tx = { from: wallet.address, to: market.curve, data, value: 0n };
        setStatus("Sign the sell.");
        await estimateOrThrow(proto.relay, tx);
        const hash = await sendTx(eth, tx);
        const receipt = await waitForReceipt(proto.relay, hash);
        if (!receipt.ok) throw new Error("Sell reverted.");
        toast.success("Sell landed.");
      }
      setStatus("");
      onDone();
    } catch (error) {
      const message = explainError(error);
      setStatus(message);
      toast.error(message);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          {market.logo.startsWith("http") ? (
            <img
              src={market.logo}
              alt=""
              className="h-14 w-14 rounded-2xl border border-line object-cover"
            />
          ) : (
            <Ident seed={market.token} />
          )}
          <div>
            <h1 className="font-serif text-4xl leading-none">
              {market.name} <span className="text-muted">{market.symbol}</span>
            </h1>
            <p className="mt-2 text-sm text-muted">
              {market.graduated ? "Graduated" : `${bpsLabel(market.progressBps)} toward graduation`} · launched{" "}
              {ago(market.launchedAt)}
            </p>
          </div>
        </div>
        {description ? <p className="max-w-xl text-base text-fg">{description}</p> : null}
        <div>
          <div className="mb-2 flex items-end justify-between">
            <p className="font-serif text-3xl">{formatEth(market.marketCap)} {market.quoteSymbol}</p>
            <p className="text-sm text-muted">market cap</p>
          </div>
          <div className="h-56 rounded-2xl border border-line bg-surface p-2">
            {chart.length > 1 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chart}>
                  <YAxis hide domain={["auto", "auto"]} />
                  <Tooltip
                    formatter={(value) => [`${Number(value).toFixed(4)} ${market.quoteSymbol}`, "Mcap"]}
                    labelFormatter={() => "Market cap"}
                    contentStyle={{ background: "#e8f4ff", border: "1px solid #c5dff2", borderRadius: 12, color: "#12304c" }}
                  />
                  <Area dataKey="cap" stroke="#1c8fe6" fill="#1c8fe6" fillOpacity={0.18} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted">
                The curve records a point on each trade. History starts at launch.
              </div>
            )}
          </div>
        </div>
        <div>
          <Meter bps={market.progressBps} graduated={market.graduated} />
          <p className="mt-2 text-sm text-muted">
            {formatEth(market.realEth, 4)} / 4.2 {market.quoteSymbol} real reserves.
            {market.graduated
              ? " Graduated is permanent. Trading continues on the same locked curve."
              : " Graduation does not migrate liquidity. It only marks the threshold."}
          </p>
        </div>
        <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <Info label="Token" value={<ExplorerLink kind="address" value={market.token}>{shortAddr(market.token)}</ExplorerLink>} />
          <Info label="Curve" value={<ExplorerLink kind="address" value={market.curve}>{shortAddr(market.curve)}</ExplorerLink>} />
          <Info
            label="Creator"
            value={
              <Link to="/profile/$address" params={{ address: market.creator }} className="underline underline-offset-4">
                {shortAddr(market.creator)}
              </Link>
            }
          />
          <Info label="Treasury" value={shortAddr(market.protocol)} />
        </dl>
        <section>
          <h2 className="font-serif text-2xl">Prints</h2>
          {market.prints.length === 0 ? (
            <p className="mt-2 text-sm text-muted">No trades yet. The launch itself is not a print unless the creator bought.</p>
          ) : (
            <ul className="mt-3 divide-y divide-line rounded-2xl border border-line">
              {[...market.prints].reverse().map((print, index) => (
                <li key={`${print.time}-${index}`} className="flex items-center justify-between gap-3 px-3 py-3 text-sm">
                  <span className={print.isBuy ? "text-up" : "text-primary"}>{print.isBuy ? "Buy" : "Sell"}</span>
                  <span>{formatTokens(print.tokenAmount)} {market.symbol}</span>
                  <span>{formatEth(print.ethAmount, 5)} {market.quoteSymbol}</span>
                  <span className="text-muted">{shortAddr(print.trader)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
      <aside className="h-fit rounded-2xl border border-line bg-surface p-4">
        <div className="grid grid-cols-2 gap-2">
          <button type="button" className={`min-h-11 rounded-full text-sm ${side === "buy" ? "bg-up text-bg" : "bg-inset text-muted"}`} onClick={() => { setSide("buy"); setAmount("0.01"); }}>
            Buy
          </button>
          <button type="button" className={`min-h-11 rounded-full text-sm ${side === "sell" ? "bg-primary text-primary-fg" : "bg-inset text-muted"}`} onClick={() => { setSide("sell"); setAmount("1000"); }}>
            Sell
          </button>
        </div>
        <label className="mt-4 flex flex-col gap-2 text-sm">
          <span>{side === "buy" ? `You pay (${market.quoteSymbol})` : `You sell (whole ${market.symbol})`}</span>
          <input value={amount} onChange={(event) => setAmount(event.target.value)} inputMode="decimal" className={controlClass} />
        </label>
        <div className="mt-3 flex gap-2">
          {[50n, 100n, 300n].map((bps) => (
            <button key={String(bps)} type="button" className={`min-h-11 flex-1 rounded-full text-sm ${slipBps === bps ? "bg-inset text-fg" : "text-muted"}`} onClick={() => setSlipBps(bps)}>
              {Number(bps) / 100}% slip
            </button>
          ))}
        </div>
        <p className="mt-3 min-h-11 text-sm text-muted">{quote || "Enter an amount to quote the curve."}</p>
        <Button className="w-full" disabled={pending} onClick={() => void submit()}>
          {pending ? "Check your wallet" : side === "buy" ? "Buy from curve" : "Sell to curve"}
        </Button>
        {status ? <p className="mt-3 text-sm text-muted">{status}</p> : null}
        <dl className="mt-4 flex flex-col gap-2 text-sm text-muted">
          <div className="flex justify-between gap-3"><dt>Your {market.quoteSymbol}</dt><dd className="text-fg">{holding ? formatEth(market.quote === zeroAddress ? holding.eth : holding.quoteBalance, 5) : "—"}</dd></div>
          <div className="flex justify-between gap-3"><dt>Your tokens</dt><dd className="text-fg">{holding ? formatTokens(holding.tokens) : "—"}</dd></div>
          <div className="flex justify-between gap-3"><dt>Fee</dt><dd className="text-fg">1%</dd></div>
        </dl>
      </aside>
    </div>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-line bg-surface px-3 py-3">
      <dt className="text-muted">{label}</dt>
      <dd className="mt-1 break-all text-fg">{value}</dd>
    </div>
  );
}
