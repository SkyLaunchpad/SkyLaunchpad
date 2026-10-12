import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Notice, Shell, controlClass } from "@/components/ui";
import { explainError, formatEth, formatTokens, parseEth } from "@/lib/chain/format";
import { initialSnap, quoteBuy, splitFee } from "@/lib/chain/math";
import { FEE_BPS, GRADUATION_ETH, LAUNCH_FEE } from "@/lib/chain/params";
import { useProtocol } from "@/lib/chain/protocol";

export const Route = createFileRoute("/plp")({ component: PlpPage });

function PlpPage() {
  const proto = useProtocol();
  const [eth, setEth] = useState("0.1");
  const locked = proto.launches.reduce((sum, row) => sum + row.realEth, 0n);

  const quote = useMemo(() => {
    const value = parseEth(eth);
    if (value == null) return { error: "Enter a plain ETH amount." };
    try {
      const q = quoteBuy(initialSnap(), value);
      const parts = splitFee(q.fee);
      return { q, parts, value };
    } catch (error) {
      return { error: explainError(error) };
    }
  }, [eth]);

  return (
    <Shell>
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <header>
          <p className="text-sm text-primary">PLP</p>
          <h1 className="font-serif text-4xl leading-tight">Liquidity stays in the curve</h1>
          <p className="mt-3 text-muted">
            Pons describes a liquidity pool that opens later. SkyLaunchpad does not take LP deposits and does not
            mint pool shares. The only ETH inside a market is what buyers paid, minus the fee that was sent out
            in the same transaction.
          </p>
        </header>

        <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
          <Cell label="Locked in this window" value={proto.phase === "ready" ? `${formatEth(locked, 4)} ETH` : "No factory"} />
          <Cell label="Trade fee" value={`${Number(FEE_BPS) / 100}%`} />
          <Cell label="Graduation" value={`${formatEth(GRADUATION_ETH)} ETH real`} />
        </dl>

        <section className="rounded-2xl border border-line bg-surface p-4">
          <h2 className="font-serif text-2xl">Where a buy goes</h2>
          <ol className="mt-3 flex list-decimal flex-col gap-2 pl-5 text-sm leading-6 text-muted">
            <li>You send ETH to the curve. Minimum size is 0.00001 ETH.</li>
            <li>1% is a fee. 70% of that fee is paid to the token creator. 30% is paid to the factory treasury.</li>
            <li>The other 99% is added to real reserves and to the virtual ETH that sets price.</li>
            <li>You receive tokens from the billion sitting in the curve. Nothing new is minted.</li>
            <li>A sell reverses the curve only as far as real ETH allows. The 1.5 ETH virtual offset never leaves.</li>
          </ol>
        </section>

        <section className="rounded-2xl border border-line bg-surface p-4">
          <h2 className="font-serif text-2xl">Fee on a fresh curve</h2>
          <p className="mt-2 text-sm text-muted">
            This quotes the opening reserves, not a live market. A launched curve is tighter after people have
            bought. Launch itself also charges {formatEth(LAUNCH_FEE)} ETH to the treasury, separate from the trade
            fee.
          </p>
          <label className="mt-4 flex flex-col gap-2 text-sm">
            <span>Buy size (ETH)</span>
            <input value={eth} onChange={(event) => setEth(event.target.value)} inputMode="decimal" className={controlClass} />
          </label>
          {"error" in quote ? (
            <p className="mt-3 text-sm text-primary">{quote.error}</p>
          ) : (
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <Cell label="Tokens out" value={formatTokens(quote.q.tokensOut)} />
              <Cell label="Stays in the curve" value={`${formatEth(quote.q.net, 6)} ETH`} />
              <Cell label="Creator fee" value={`${formatEth(quote.parts.creator, 6)} ETH`} />
              <Cell label="Treasury fee" value={`${formatEth(quote.parts.protocol, 6)} ETH`} />
            </dl>
          )}
        </section>

        <Notice>
          Fees are pushed to the creator and treasury during the trade. There is no claim function and no way for
          either of them to sweep reserves. Practice the path on the{" "}
          <Link to="/simulate" className="underline">
            simulator
          </Link>{" "}
          before you spend mainnet ETH.
        </Notice>
      </div>
    </Shell>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface px-4 py-3">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="text-base">{value}</dd>
    </div>
  );
}
