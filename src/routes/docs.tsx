import { createFileRoute, Link } from "@tanstack/react-router";
import { ExplorerLink, Shell } from "@/components/ui";
import { formatEth } from "@/lib/chain/format";
import {
  CHAIN_NAME,
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
  const protocolFee = (fee * 3_000n) / BPS;
  const creator = fee - protocolFee + tax;
  const treasury = protocolFee + snipe;
  return { snipe, tax, fee, toCurve, creator, treasury };
}

function DocsPage() {
  const open = splitBuy(EXAMPLE, EXAMPLE_TAX, snipeAt(0));
  const later = splitBuy(EXAMPLE, EXAMPLE_TAX, 0n);
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
            Addresses below are the official SkyFactory on {CHAIN_NAME}. Every visitor reads that contract. SKY, the site mark, has no token contract.
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
              v="The wallet that deployed the factory. It receives the launch fee, 100% of the opening tax, and 30% of the 1% trade fee. All of that is paid in the same trade. There is no escrow."
            />
            <Row
              k="Your fee wallet"
              v="Chosen at launch. It receives 100% of the creator tax and 70% of the 1% trade fee, in the same trade. Leave the field blank and that wallet is the one you sign with. Or paste a different address."
            />
            <Row
              k="Holders"
              v="The other launch choice. The same creator-side cash is split across holders in proportion to balance. Each holder claims on the market page. The curve, the locker, and the Uniswap pool manager do not earn."
            />
            <Row
              k="Curve"
              v="What remains after those cuts. That amount is the real reserve and is what sets the price. Nobody can withdraw it."
            />
            <Row k="Team" v="The creator, plus up to 8 wallets they list. They skip the opening tax only. They still pay the creator tax and the trade fee." />
          </dl>
          <p className="text-sm text-muted">
            There is no buyback and nothing is locked for five years. The treasury address can be changed later by the
            current treasury. That change does not move quote already locked in a curve. The fee destination is chosen
            once, at launch, and cannot be switched later.
            {info?.rewards ? ` Holder claims are paid by the rewards contract at ${info.rewards}.` : ""}
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-serif text-2xl">The three cuts</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <Card title="Launch fee" value={`${formatEth(LAUNCH_FEE, 4)} ETH`} detail="Once, when the token is created. 100% to the treasury. Not a trade." />
            <Card title="Trade fee" value={pct(FEE_BPS)} detail="30% treasury, 70% to the fee wallet or to holders. Paid from the trade. No five-year lock." />
            <Card title="Creator tax" value={`0–${pct(MAX_CREATOR_TAX_BPS)}`} detail="Chosen at launch. 100% to the same destination as the creator share of the trade fee." />
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-serif text-2xl">A buy, in order</h2>
          <ol className="flex list-decimal flex-col gap-2 pl-5 text-sm leading-6 text-muted">
            <li>Opening tax is taken from the full ETH sent. Team wallets and the creator pay 0. Sells pay 0.</li>
            <li>Creator tax and the 1% trade fee are each calculated on what remains. They are not stacked on each other. At the {pct(MAX_CREATOR_TAX_BPS)} maximum, both cuts together are {pct(MAX_CREATOR_TAX_BPS + FEE_BPS)} of that remainder.</li>
            <li>The rest is added to the curve. Token amount is based on that net, not on the ETH you sent.</li>
            <li>The opening tax goes entirely to the treasury.</li>
            <li>Of the 1% trade fee, 30% goes to the treasury and 70% is the creator share.</li>
            <li>The creator tax is added to that share. If the launch picked a fee wallet, both are paid to that wallet in the same trade. If it picked Holders, both are deposited for holders to claim.</li>
          </ol>
          <p className="text-sm text-muted">
            Each cut rounds down to the nearest wei. Leftover wei from the tax and the fee stay in the curve. Holder rewards round down per token; that dust stays in the rewards contract.
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
                <Line label="Opening tax, to treasury now" a={open.snipe} b={later.snipe} />
                <Line label="Creator tax, to the fee destination" a={open.tax} b={later.tax} />
                <Line label="Trade fee, inside the split below" a={open.fee} b={later.fee} />
                <Line label="Treasury, paid in the trade" a={open.treasury} b={later.treasury} />
                <Line label="Fee wallet or holders" a={open.creator} b={later.creator} />
                <Line label="Curve keeps" a={open.toCurve} b={later.toCurve} />
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted">
            At second 0 almost all of the buy is opening tax, and that tax goes to the treasury in the same trade.
            After the window, a 1 ETH buy puts {formatEth(later.toCurve, 4)} ETH in the curve. The fee wallet, or the
            holders, receive {formatEth(later.creator, 4)} ETH. The treasury receives {formatEth(later.treasury, 4)} ETH.
            Nothing is bought back and nothing vests.
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
            seller {formatEth(later.toCurve, 4)} ETH, fee wallet or holders {formatEth(later.creator, 4)} ETH, treasury{" "}
            {formatEth(later.treasury, 4)} ETH.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-serif text-2xl">Creating the token</h2>
          <p className="text-sm leading-6 text-muted">
            The launch transaction sends at least {formatEth(LAUNCH_FEE, 4)} ETH. That fee goes entirely to the
            treasury, including when the pair is a Robinhood stock token. An ETH pair can add extra ETH as the
            creator’s first buy. A stock pair sends that buy in the stock token, and the wallet must approve it
            first. The creator is exempt from the opening tax, but that buy still pays the creator tax and the 1%
            trade fee (30% treasury, 70% to the fee wallet or to holders). Reserves are counted in the pair asset:
            1.5 virtual, graduation at 4.2.
          </p>
          <p className="text-sm leading-6 text-muted">
            Graduation at 4.2 of the pair is two steps. The crossing buy hands the real reserves to the pool helper and locks the virtual-reserve remainder so the Uniswap price matches the curve. Opening the pool can be retried if it does not land in that same transaction. The position is full range. The hook reverts on remove, and every later swap pays 1% plus the creator tax into the same split. The pool also keeps its own 0.30% liquidity fee inside the locked position.
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
