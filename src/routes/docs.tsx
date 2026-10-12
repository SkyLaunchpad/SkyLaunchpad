import { createFileRoute, Link } from "@tanstack/react-router";
import { ExplorerLink, Shell } from "@/components/ui";
import { formatEth } from "@/lib/chain/format";
import {
  CHAIN_NAME,
  CREATOR_SHARE_BPS,
  FEE_BPS,
  LAUNCH_FEE,
  MAX_CREATOR_TAX_BPS,
  SNIPE_START_BPS,
  SNIPE_WINDOW,
  VERSION,
} from "@/lib/chain/params";
import { useProtocol } from "@/lib/chain/protocol";

export const Route = createFileRoute("/docs")({ component: DocsPage });

const BPS = 10_000n;
const EXAMPLE = 10n ** 18n;
const EXAMPLE_TAX = 300n;

function snipeAt(second: number): bigint {
  if (second >= Number(SNIPE_WINDOW)) return 0n;
  return (SNIPE_START_BPS * (SNIPE_WINDOW - BigInt(second))) / SNIPE_WINDOW;
}

function pct(bps: bigint): string {
  const whole = bps / 100n;
  const frac = bps % 100n;
  return frac === 0n ? `${whole}%` : `${whole}.${frac.toString().padStart(2, "0").replace(/0$/, "")}%`;
}

function splitBuy(value: bigint, taxBps: bigint, snipeBps: bigint) {
  const snipe = (value * snipeBps) / BPS;
  const after = value - snipe;
  const tax = (after * taxBps) / BPS;
  const fee = (after * FEE_BPS) / BPS;
  const toCurve = after - tax - fee;
  const pool = fee + snipe;
  const creatorFromPool = (pool * CREATOR_SHARE_BPS) / BPS;
  const treasury = pool - creatorFromPool;
  return { snipe, tax, fee, toCurve, creator: creatorFromPool + tax, treasury };
}

function DocsPage() {
  const open = splitBuy(EXAMPLE, EXAMPLE_TAX, snipeAt(0));
  const later = splitBuy(EXAMPLE, EXAMPLE_TAX, 0n);
  const treasuryShare = BPS - CREATOR_SHARE_BPS;
  const proto = useProtocol();
  const info = proto.info;
  return (
    <Shell>
      <article className="mx-auto flex max-w-3xl flex-col gap-8">
        <header>
          <p className="text-sm text-primary">Resources · Fees</p>
          <h1 className="mt-1 font-serif text-4xl leading-tight sm:text-5xl">How ETH is split</h1>
          <p className="mt-3 text-base text-muted">
            Taxes are taken in ETH when someone trades on a curve. The token itself has no transfer tax, so a
            wallet-to-wallet send is free. Nobody can withdraw the ETH sitting in a curve. It leaves only when a
            holder sells.
          </p>
        </header>

        <section id="factory" className="flex flex-col gap-3">
          <h2 className="font-serif text-2xl">This factory</h2>
          <p className="text-sm text-muted">
            Addresses below are the factory pinned in this browser on {CHAIN_NAME}. SKY, the site mark, has no token
            contract. That is separate from the factory.
          </p>
          {proto.phase === "ready" && info && proto.factory ? (
            <dl className="overflow-hidden rounded-2xl border border-line">
              <Addr k="Factory" v={proto.factory} />
              <Addr k="Treasury" v={info.protocol} />
              <Addr k="Token implementation" v={info.tokenImplementation} />
              <Addr k="Curve implementation" v={info.curveImplementation} />
              <div className="border-b border-line px-4 py-3 last:border-b-0">
                <dt className="text-sm font-medium">Version</dt>
                <dd className="mt-1 text-sm text-muted">{info.version}</dd>
              </div>
              <div className="border-b border-line px-4 py-3 last:border-b-0">
                <dt className="text-sm font-medium">Launches</dt>
                <dd className="mt-1 text-sm text-muted">{info.launchCount.toString()}</dd>
              </div>
            </dl>
          ) : (
            <p className="rounded-2xl border border-line bg-surface px-4 py-3 text-sm text-muted">
              {proto.phase === "bad"
                ? proto.reason || "The saved factory did not verify."
                : proto.phase === "boot" || proto.phase === "checking"
                  ? "Reading the pinned factory…"
                  : "No factory is pinned in this browser yet. Deploy it from Create a token. These addresses appear here after it verifies."}{" "}
              {proto.factory && proto.phase === "bad" ? (
                <ExplorerLink kind="address" value={proto.factory}>{proto.factory}</ExplorerLink>
              ) : null}
            </p>
          )}
          <p className="text-sm text-muted">Build expected by this site: {VERSION}.</p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-serif text-2xl">Who is paid</h2>
          <dl className="overflow-hidden rounded-2xl border border-line">
            <Row
              k="Treasury"
              v="The wallet that deployed SkyFactory. It receives the launch fee, and 30% of the trade fee plus the opening tax."
            />
            <Row
              k="Creator"
              v="The wallet that launched the token. It receives 100% of the creator tax, and 70% of the trade fee plus the opening tax."
            />
            <Row
              k="Curve"
              v="What remains after those cuts. That ETH is the real reserve and is what sets the price."
            />
            <Row k="Team" v="The creator, plus up to 8 wallets they list. They skip the opening tax only. They still pay the creator tax and the trade fee." />
          </dl>
          <p className="text-sm text-muted">
            The treasury address can be changed later by the current treasury. That change does not move ETH already
            locked in a curve.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-serif text-2xl">The three cuts</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <Card title="Launch fee" value={`${formatEth(LAUNCH_FEE, 4)} ETH`} detail="Once, when the token is created. 100% to the treasury. Not a trade." />
            <Card title="Trade fee" value={pct(FEE_BPS)} detail={`Fixed. ${pct(CREATOR_SHARE_BPS)} to the creator, ${pct(treasuryShare)} to the treasury.`} />
            <Card title="Creator tax" value={`0–${pct(MAX_CREATOR_TAX_BPS)}`} detail="Chosen at launch. 100% to the creator. It does not go to the treasury." />
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-serif text-2xl">A buy, in order</h2>
          <ol className="flex list-decimal flex-col gap-2 pl-5 text-sm leading-6 text-muted">
            <li>Opening tax is taken from the full ETH sent. Team wallets and the creator pay 0. Sells pay 0.</li>
            <li>Creator tax and the 1% trade fee are each calculated on what remains. They are not stacked on each other. At the {pct(MAX_CREATOR_TAX_BPS)} maximum, both cuts together are {pct(MAX_CREATOR_TAX_BPS + FEE_BPS)} of that remainder.</li>
            <li>The rest is added to the curve. Token amount is based on that net, not on the ETH you sent.</li>
            <li>Opening tax and the trade fee are pooled, then split {pct(CREATOR_SHARE_BPS)} creator / {pct(treasuryShare)} treasury.</li>
            <li>The creator tax is paid on top of that, entirely to the creator.</li>
          </ol>
          <p className="text-sm text-muted">
            Each cut rounds down to the nearest wei. Leftover wei from the tax and the fee stay in the curve. Leftover
            wei from the 70/30 split go to the treasury.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-serif text-2xl">Opening tax</h2>
          <p className="text-sm leading-6 text-muted">
            For the first {SNIPE_WINDOW.toString()} seconds after launch, a buy by anyone who is not the creator or on
            the team list pays an opening tax. It starts at {pct(SNIPE_START_BPS)} and falls by one fifth of that
            each second. It uses the block timestamp, so everyone in the same second pays the same rate. The check is
            the wallet that receives the tokens.
          </p>
          <div className="overflow-hidden rounded-2xl border border-line">
            <div className="grid grid-cols-2 bg-inset px-4 py-2 text-sm text-muted">
              <span>Second</span>
              <span>Opening tax</span>
            </div>
            {Array.from({ length: Number(SNIPE_WINDOW) + 1 }, (_, second) => (
              <div key={second} className="grid grid-cols-2 border-t border-line px-4 py-2 text-sm">
                <span>{second === Number(SNIPE_WINDOW) ? `${second}+` : String(second)}</span>
                <span>{pct(snipeAt(second))}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-serif text-2xl">1 ETH buy, {pct(EXAMPLE_TAX)} creator tax</h2>
          <p className="text-sm text-muted">Same buy, two moments. Numbers are what the contract computes.</p>
          <div className="overflow-x-auto rounded-2xl border border-line">
            <table className="w-full min-w-[32rem] text-left text-sm">
              <thead className="bg-inset text-muted">
                <tr>
                  <th className="px-4 py-2 font-medium">Where it goes</th>
                  <th className="px-4 py-2 font-medium">Second 0</th>
                  <th className="px-4 py-2 font-medium">After 5 seconds</th>
                </tr>
              </thead>
              <tbody>
                <Line label="Opening tax, inside the split below" a={open.snipe} b={later.snipe} />
                <Line label="Creator tax, 100% to creator" a={open.tax} b={later.tax} />
                <Line label="Trade fee, inside the split below" a={open.fee} b={later.fee} />
                <Line label="Creator receives" a={open.creator} b={later.creator} />
                <Line label="Treasury receives" a={open.treasury} b={later.treasury} />
                <Line label="Curve keeps" a={open.toCurve} b={later.toCurve} />
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted">
            At second 0 almost all of the buy is tax, and 70% of that tax is paid to the creator, not the treasury.
            After the window, a 1 ETH buy puts {formatEth(later.toCurve, 4)} ETH in the curve. The creator receives{" "}
            {formatEth(later.creator, 4)} ETH ({formatEth(later.tax, 4)} tax + {formatEth((later.fee * CREATOR_SHARE_BPS) / BPS, 4)} of the fee). The treasury receives {formatEth(later.treasury, 4)} ETH.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-serif text-2xl">A sell</h2>
          <p className="text-sm leading-6 text-muted">
            There is no opening tax on a sell. The curve prices the tokens first and gets a gross ETH amount. Creator
            tax and the 1% trade fee come off that gross. The seller receives the rest. Reserves fall by the gross
            amount, not by what the seller receives, because the tax and the fee left the curve too.
          </p>
          <p className="text-sm leading-6 text-muted">
            A sell whose gross is 1 ETH, with a {pct(EXAMPLE_TAX)} creator tax, pays the same people as the “after 5 seconds” column:
            seller {formatEth(later.toCurve, 4)} ETH, creator {formatEth(later.creator, 4)} ETH, treasury{" "}
            {formatEth(later.treasury, 4)} ETH.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-serif text-2xl">Creating the token</h2>
          <p className="text-sm leading-6 text-muted">
            The launch transaction sends at least {formatEth(LAUNCH_FEE, 4)} ETH. That fee goes entirely to the
            treasury, including when the pair is a Robinhood stock token. An ETH pair can add extra ETH as the
            creator’s first buy. A stock pair sends that buy in the stock token, and the wallet must approve it
            first. The creator is exempt from the opening tax, but that buy still pays the creator tax (back to the
            creator) and the 1% trade fee (70% back, 30% to the treasury). Reserves are counted in the pair asset:
            1.5 virtual, graduation at 4.2.
          </p>
          <p className="text-sm leading-6 text-muted">
            Graduation at 4.2 ETH of real reserves only marks the market. It does not change the split and it does not
            send the reserves anywhere.
          </p>
          <p className="text-sm">
            <Link to="/contracts" className="underline underline-offset-4">Contract source</Link>
            {" · "}
            <Link to="/guide" className="underline underline-offset-4">How to go live</Link>
          </p>
        </section>
      </article>
    </Shell>
  );
}

function Addr({ k, v }: { k: string; v: string }) {
  return (
    <div className="border-b border-line px-4 py-3 last:border-b-0">
      <dt className="text-sm font-medium">{k}</dt>
      <dd className="mt-1 break-all font-mono text-xs leading-5">
        <ExplorerLink kind="address" value={v}>{v}</ExplorerLink>
      </dd>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="border-b border-line px-4 py-3 last:border-b-0">
      <dt className="text-sm font-medium">{k}</dt>
      <dd className="mt-1 text-sm leading-6 text-muted">{v}</dd>
    </div>
  );
}

function Card({ title, value, detail }: { title: string; value: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-4">
      <p className="text-sm text-muted">{title}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
      <p className="mt-2 text-sm leading-6 text-muted">{detail}</p>
    </div>
  );
}

function Line({ label, a, b }: { label: string; a: bigint; b: bigint }) {
  return (
    <tr className="border-t border-line">
      <th className="px-4 py-2 text-left font-normal">{label}</th>
      <td className="px-4 py-2">{formatEth(a, 6)} ETH</td>
      <td className="px-4 py-2">{formatEth(b, 6)} ETH</td>
    </tr>
  );
}
