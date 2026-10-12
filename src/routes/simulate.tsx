import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, YAxis } from "recharts";
import { Button, Meter, Notice, Shell, controlClass } from "@/components/ui";
import { bpsLabel, capNumber, explainError, formatEth, formatTokens, parseEth } from "@/lib/chain/format";
import { applyBuy, applySell, initialSnap, marketCapOf, progressBpsOf, splitFee, type Snap } from "@/lib/chain/math";
import { GRADUATION_ETH, MIN_TRADE_ETH } from "@/lib/chain/params";

export const Route = createFileRoute("/simulate")({ component: SimulatePage });

type Tape = { side: "buy" | "sell"; eth: bigint; tokens: bigint; fee: bigint };

function SimulatePage() {
  const [snap, setSnap] = useState<Snap>(initialSnap);
  const [bag, setBag] = useState(0n);
  const [spent, setSpent] = useState(0n);
  const [received, setReceived] = useState(0n);
  const [amount, setAmount] = useState("0.05");
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [error, setError] = useState("");
  const [tape, setTape] = useState<Tape[]>([]);
  const [series, setSeries] = useState<{ i: number; cap: number }[]>([{ i: 0, cap: capNumber(marketCapOf(initialSnap())) }]);

  function reset() {
    const fresh = initialSnap();
    setSnap(fresh);
    setBag(0n);
    setSpent(0n);
    setReceived(0n);
    setTape([]);
    setError("");
    setSeries([{ i: 0, cap: capNumber(marketCapOf(fresh)) }]);
  }

  function trade() {
    setError("");
    const qty = parseEth(amount);
    if (qty == null) {
      setError("Use a plain number, up to 18 decimals.");
      return;
    }
    try {
      if (side === "buy") {
        if (qty < MIN_TRADE_ETH) throw new Error("Minimum buy is 0.00001 ETH.");
        const next = applyBuy(snap, qty);
        const entry: Tape = { side: "buy", eth: qty, tokens: next.tokensOut, fee: next.fee };
        setSnap(next.snap);
        setBag((held) => held + next.tokensOut);
        setSpent((value) => value + qty);
        setTape((rows) => [entry, ...rows].slice(0, 12));
        setSeries((points) => [...points, { i: points.length, cap: capNumber(marketCapOf(next.snap)) }]);
      } else {
        if (qty > bag) throw new Error("The paper wallet does not hold that many tokens.");
        const next = applySell(snap, qty);
        const entry: Tape = { side: "sell", eth: next.ethOut, tokens: qty, fee: next.fee };
        setSnap(next.snap);
        setBag((held) => held - qty);
        setReceived((value) => value + next.ethOut);
        setTape((rows) => [entry, ...rows].slice(0, 12));
        setSeries((points) => [...points, { i: points.length, cap: capNumber(marketCapOf(next.snap)) }]);
      }
    } catch (err) {
      setError(explainError(err));
    }
  }

  const cap = marketCapOf(snap);
  const progress = progressBpsOf(snap);
  const lastFee = tape[0] ? splitFee(tape[0].fee) : null;

  return (
    <Shell>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm text-primary">Simulator</p>
            <h1 className="font-serif text-4xl">Same math, no gas</h1>
            <p className="mt-2 max-w-xl text-muted">
              This paper curve uses the published SkyLaunchpad formula. It does not touch Robinhood Chain. A live
              market can move between your quote and your signature.
            </p>
          </div>
          <Notice>
            Opening market cap is 1.5 ETH of virtual reserves. Graduation needs {formatEth(GRADUATION_ETH)} ETH of
            real buys after fees. Virtual ETH cannot be withdrawn.
          </Notice>
          <div>
            <div className="mb-2 flex items-end justify-between">
              <p className="font-serif text-3xl">{formatEth(cap)} ETH</p>
              <p className="text-sm text-muted">{snap.graduated ? "Graduated" : bpsLabel(progress)}</p>
            </div>
            <div className="h-56 rounded-2xl border border-line bg-surface p-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={series}>
                  <YAxis hide domain={["auto", "auto"]} />
                  <Tooltip
                    formatter={(value) => [`${Number(value).toFixed(4)} ETH`, "Mcap"]}
                    labelFormatter={() => "Paper market cap"}
                    contentStyle={{
                      background: "var(--color-surface)",
                      border: "1px solid var(--color-line)",
                      borderRadius: 12,
                      color: "var(--color-fg)",
                    }}
                  />
                  <Area dataKey="cap" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.18} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <Meter bps={progress} graduated={snap.graduated} />
            <p className="mt-2 text-sm text-muted">
              {formatEth(snap.realEth, 4)} / {formatEth(GRADUATION_ETH)} ETH real
            </p>
          </div>
          <section>
            <h2 className="font-serif text-2xl">Paper prints</h2>
            {tape.length === 0 ? (
              <p className="mt-2 text-sm text-muted">No trades yet. Buy first — a fresh curve has no real ETH to sell against.</p>
            ) : (
              <ul className="mt-3 divide-y divide-line rounded-2xl border border-line">
                {tape.map((row, index) => (
                  <li key={index} className="flex items-center justify-between gap-3 px-3 py-3 text-sm">
                    <span className={row.side === "buy" ? "text-up" : "text-primary"}>{row.side === "buy" ? "Buy" : "Sell"}</span>
                    <span>{formatTokens(row.tokens)}</span>
                    <span>{formatEth(row.eth, 5)} ETH</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
        <aside className="flex h-fit flex-col gap-3 rounded-2xl border border-line bg-surface p-4">
          <div className="grid grid-cols-2 gap-2">
            <button type="button" className={`min-h-11 rounded-full text-sm ${side === "buy" ? "bg-up text-bg" : "bg-inset text-muted"}`} onClick={() => { setSide("buy"); setAmount("0.05"); }}>
              Buy
            </button>
            <button type="button" className={`min-h-11 rounded-full text-sm ${side === "sell" ? "bg-primary text-primary-fg" : "bg-inset text-muted"}`} onClick={() => setSide("sell")}>
              Sell
            </button>
          </div>
          <label className="flex flex-col gap-2 text-sm">
            <span>{side === "buy" ? "ETH in" : "Whole tokens out"}</span>
            <input value={amount} onChange={(event) => setAmount(event.target.value)} inputMode="decimal" className={controlClass} />
          </label>
          <div className="flex flex-wrap gap-2">
            {(side === "buy" ? ["0.01", "0.05", "0.2", "1"] : ["1000", "10000", "100000"]).map((preset) => (
              <button key={preset} type="button" className="min-h-11 rounded-full bg-inset px-3 text-sm" onClick={() => setAmount(preset)}>
                {preset}
              </button>
            ))}
          </div>
          <Button onClick={trade}>{side === "buy" ? "Paper buy" : "Paper sell"}</Button>
          <Button variant="line" onClick={reset}>Reset curve</Button>
          {error ? <p className="text-sm text-primary">{error}</p> : null}
          <dl className="flex flex-col gap-2 border-t border-line pt-3 text-sm">
            <Row k="Tokens held" v={formatTokens(bag)} />
            <Row k="ETH paid in" v={formatEth(spent, 4)} />
            <Row k="ETH received" v={formatEth(received, 4)} />
            <Row k="Last creator fee" v={lastFee ? `${formatEth(lastFee.creator, 6)} ETH` : "—"} />
            <Row k="Last treasury fee" v={lastFee ? `${formatEth(lastFee.protocol, 6)} ETH` : "—"} />
          </dl>
        </aside>
      </div>
    </Shell>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted">{k}</dt>
      <dd>{v}</dd>
    </div>
  );
}
