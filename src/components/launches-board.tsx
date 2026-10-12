import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Ident, Notice, useLaunchSearch, ViewToggle } from "@/components/ui";
import { ago, displayName, formatEth, formatMcap } from "@/lib/chain/format";
import { GRADUATION_ETH } from "@/lib/chain/params";
import { useProtocol } from "@/lib/chain/protocol";
import type { LaunchRow } from "@/lib/chain/reads";

type Filter = "all" | "new" | "active" | "near" | "graduated";
type Sort = "cap" | "new";
type View = "list" | "grid";

const PINS = "sky.pins";

function bucket(row: LaunchRow): Filter {
  if (row.graduated) return "graduated";
  const pct = Number(row.progressBps);
  if (pct >= 7000) return "near";
  if (pct >= 1500) return "active";
  return "new";
}

function readPins(): string[] {
  try {
    const raw = JSON.parse(localStorage.getItem(PINS) || "[]") as unknown;
    return Array.isArray(raw) ? raw.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function LaunchesBoard() {
  const proto = useProtocol();
  const { query } = useLaunchSearch();
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("cap");
  const [view, setView] = useState<View>("list");
  const [shown, setShown] = useState(12);
  const [pins, setPins] = useState<string[]>([]);
  const [pairOpen, setPairOpen] = useState(false);
  const [pairFilter, setPairFilter] = useState("all");
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPins(readPins());
  }, []);

  function togglePin(curve: string) {
    setPins((current) => {
      const next = current.includes(curve) ? current.filter((item) => item !== curve) : [curve, ...current].slice(0, 40);
      localStorage.setItem(PINS, JSON.stringify(next));
      return next;
    });
  }

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const row of proto.launches) {
      const key = row.creator.toLowerCase();
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return map;
  }, [proto.launches]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = proto.launches.filter((row) => (filter === "all" ? true : bucket(row) === filter));
    if (pairFilter !== "all") list = list.filter((row) => row.quoteSymbol === pairFilter);
    if (q) {
      list = list.filter((row) => {
        const nick = displayName(row.creator).toLowerCase();
        return `${row.name} ${row.symbol} ${row.token} ${row.creator} ${nick}`.toLowerCase().includes(q);
      });
    }
    list = [...list].sort((a, b) => {
      const ap = pins.includes(a.curve) ? 1 : 0;
      const bp = pins.includes(b.curve) ? 1 : 0;
      if (ap !== bp) return bp - ap;
      if (sort === "new") return b.launchedAt - a.launchedAt;
      return a.marketCap > b.marketCap ? -1 : 1;
    });
    return list;
  }, [filter, pairFilter, pins, proto.launches, query, sort]);

  const trending = useMemo(
    () => [...proto.launches].sort((a, b) => (a.marketCap > b.marketCap ? -1 : 1)).slice(0, 10),
    [proto.launches],
  );

  const visible = rows.slice(0, shown);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-center gap-3">
          <img src="/sky-mark.png" alt="" className="h-14 w-14 object-contain" />
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Launches</h1>
            <p className="text-sm text-muted">Sky Launchpad · SKY · Contract N/A</p>
          </div>
        </div>
        <Link to="/launchpad/create" className="inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-fg">
          Launch a token
        </Link>
      </div>

      {proto.phase === "bad" ? (
        <Notice tone="bad">
          <p>{proto.reason}</p>
          <button type="button" className="mt-2 underline" onClick={proto.clearFactory}>
            Clear this factory
          </button>
        </Notice>
      ) : null}
      {proto.phase === "none" ? (
        <p className="text-sm text-muted">No factory is pinned in this browser yet. Launch a token to deploy one, or paste an existing factory on the create page.</p>
      ) : null}
      {proto.phase === "boot" || proto.phase === "checking" ? <p className="text-sm text-muted">Reading Robinhood Chain…</p> : null}

      {trending.length > 0 ? (
        <section aria-label="Trending">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Trending</h2>
            <div className="flex gap-1">
              <button type="button" aria-label="Previous" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface" onClick={() => scroller.current?.scrollBy({ left: -280, behavior: "smooth" })}>
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button type="button" aria-label="Next" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface" onClick={() => scroller.current?.scrollBy({ left: 280, behavior: "smooth" })}>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div ref={scroller} className="flex gap-3 overflow-x-auto pb-1">
            {trending.map((row, index) => (
              <Link key={row.curve} to="/market/$curve" params={{ curve: row.curve }} className="flex w-44 shrink-0 items-center gap-3 rounded-2xl border border-line bg-surface p-3">
                <span className="text-sm text-muted">{index + 1}</span>
                <TokenFace logo={row.logo} seed={row.token} />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{row.name}</span>
                  <span className="block text-sm text-up">{formatMcap(row.marketCap, row.quoteSymbol)}</span>
                  <span className="block text-xs text-muted">{row.graduated ? "Graduated" : `${(Number(row.progressBps) / 100).toFixed(0)}% filled`}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-2 overflow-x-auto">
          <label className="sr-only" htmlFor="sort-launches">Sort</label>
          <select id="sort-launches" value={sort} onChange={(event) => setSort(event.target.value as Sort)} className="min-h-11 rounded-full border border-line bg-surface px-3 text-sm">
            <option value="cap">Market cap</option>
            <option value="new">New</option>
          </select>
          {(
            [
              ["new", "New"],
              ["active", "Active"],
              ["near", "Near graduation"],
              ["graduated", "Graduated"],
            ] as const
          ).map(([id, label]) => (
            <button key={id} type="button" onClick={() => setFilter(filter === id ? "all" : id)} className={`min-h-11 whitespace-nowrap rounded-full px-3 text-sm ${filter === id ? "bg-fg text-bg" : "bg-surface text-muted"}`}>
              {label}
            </button>
          ))}
          <div className="relative">
            <button type="button" onClick={() => setPairOpen((open) => !open)} className="min-h-11 whitespace-nowrap rounded-full bg-surface px-3 text-sm text-muted">
              {pairFilter === "all" ? "Pair asset" : pairFilter}
            </button>
            {pairOpen ? (
              <div className="absolute z-10 mt-2 max-h-72 w-48 overflow-y-auto rounded-xl border border-line bg-surface p-2 text-sm shadow-lg">
                <button type="button" className="block w-full rounded-lg px-2 py-2 text-left hover:bg-inset" onClick={() => { setPairFilter("all"); setPairOpen(false); }}>
                  All pairs
                </button>
                {[...new Set(proto.launches.map((row) => row.quoteSymbol))].sort().map((symbol) => (
                  <button key={symbol} type="button" className="block w-full rounded-lg px-2 py-2 text-left hover:bg-inset" onClick={() => { setPairFilter(symbol); setPairOpen(false); }}>
                    {symbol}
                  </button>
                ))}
                {proto.launches.length === 0 ? <p className="px-2 py-2 text-muted">No launches yet. Create a token to pair with ETH or a Robinhood stock.</p> : null}
              </div>
            ) : null}
          </div>
        </div>
        <ViewToggle view={view} onChange={setView} />
      </div>

      {proto.phase === "ready" && rows.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface px-4 py-12 text-center">
          <p className="text-lg font-medium">No tokens in this view</p>
          <p className="mt-1 text-sm text-muted">
            {proto.launches.length === 0 ? "This factory has no launches yet." : "Nothing matches that filter."}
          </p>
        </div>
      ) : null}

      {visible.length > 0 && view === "grid" ? (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((row) => (
            <li key={row.curve}>
              <TokenCard row={row} launches={counts.get(row.creator.toLowerCase()) ?? 1} pinned={pins.includes(row.curve)} onPin={() => togglePin(row.curve)} />
            </li>
          ))}
        </ul>
      ) : null}

      {visible.length > 0 && view === "list" ? (
        <div className="overflow-hidden rounded-2xl border border-line bg-surface">
          <div className="hidden grid-cols-[minmax(0,1.4fr)_120px_140px_180px] gap-3 border-b border-line px-4 py-2 text-xs text-muted md:grid">
            <span>Token pair</span>
            <span>Graph</span>
            <span className="text-right">Market cap</span>
            <span className="text-right">Graduation</span>
          </div>
          <ul>
            {visible.map((row) => (
              <li key={row.curve} className="border-b border-line last:border-b-0">
                <TokenRow row={row} launches={counts.get(row.creator.toLowerCase()) ?? 1} pinned={pins.includes(row.curve)} onPin={() => togglePin(row.curve)} />
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {rows.length > shown ? (
        <button type="button" onClick={() => setShown((count) => count + 12)} className="mx-auto min-h-11 rounded-full border border-line bg-surface px-5 text-sm">
          Show more
        </button>
      ) : null}
      {proto.info && proto.info.launchCount > BigInt(proto.launches.length) ? (
        <p className="text-center text-sm text-muted">Showing the latest {proto.launches.length} of {proto.info.launchCount.toString()}.</p>
      ) : null}
    </div>
  );
}

function TokenFace({ logo, seed }: { logo: string; seed: string }) {
  const [bad, setBad] = useState(false);
  if (logo.startsWith("http") && !bad) {
    return <img src={logo} alt="" className="h-11 w-11 shrink-0 rounded-2xl bg-inset object-cover" onError={() => setBad(true)} />;
  }
  return <Ident seed={seed} />;
}

function Spark({ bps }: { bps: bigint }) {
  const p = Math.max(0.08, Math.min(1, Number(bps) / 10_000));
  const points = Array.from({ length: 16 }, (_, i) => {
    const t = i / 15;
    const y = 28 - Math.pow(t, 1.4) * 22 * p;
    return `${(t * 96).toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 96 32" className="h-8 w-full" aria-hidden>
      <polyline fill="none" stroke="currentColor" strokeWidth="2" className={p > 0.08 ? "text-up" : "text-muted"} points={points} />
    </svg>
  );
}

function TokenRow({ row, launches, pinned, onPin }: { row: LaunchRow; launches: number; pinned: boolean; onPin: () => void }) {
  const pct = Math.max(0, Math.min(100, Number(row.progressBps) / 100));
  return (
    <div className="grid items-center gap-3 px-4 py-3 md:grid-cols-[minmax(0,1.4fr)_120px_140px_180px]">
      <div className="flex min-w-0 items-center gap-3">
        <TokenFace logo={row.logo} seed={row.token} />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Link to="/market/$curve" params={{ curve: row.curve }} className="truncate font-medium hover:text-primary">
              {row.name}
            </Link>
            <button type="button" aria-label={pinned ? `Unpin ${row.symbol}` : `Pin ${row.symbol}`} onClick={onPin} className={`inline-flex h-8 w-8 items-center justify-center ${pinned ? "text-primary" : "text-muted"}`}>
              <Star className="h-4 w-4" fill={pinned ? "currentColor" : "none"} />
            </button>
          </div>
          <p className="truncate text-sm text-muted">
            {row.symbol} · {row.quoteSymbol} · {ago(row.launchedAt)} ·{" "}
            <Link to="/profile/$address" params={{ address: row.creator }} className="hover:text-fg">
              {displayName(row.creator)}
            </Link>
            {launches > 1 ? ` · ${launches} launches` : ""}
          </p>
        </div>
      </div>
      <div className="hidden md:block">
        <Spark bps={row.progressBps} />
      </div>
      <p className={`text-lg font-semibold md:text-right ${row.realEth > 0n ? "text-up" : "text-fg"}`}>{formatMcap(row.marketCap, row.quoteSymbol)}</p>
      <div>
        <div className="h-1.5 overflow-hidden rounded-full bg-inset">
          <div className="h-full bg-up" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-1 text-right text-xs text-muted">
          {row.graduated ? "Graduated" : `${formatEth(row.realEth, 2)} / ${formatEth(GRADUATION_ETH, 1)} ${row.quoteSymbol}`}
        </p>
      </div>
    </div>
  );
}

function TokenCard({ row, launches, pinned, onPin }: { row: LaunchRow; launches: number; pinned: boolean; onPin: () => void }) {
  const pct = Math.max(0, Math.min(100, Number(row.progressBps) / 100));
  return (
    <div className="flex h-full flex-col gap-3 rounded-2xl border border-line bg-surface p-4">
      <div className="flex items-center gap-3">
        <TokenFace logo={row.logo} seed={row.token} />
        <div className="min-w-0 flex-1">
          <Link to="/market/$curve" params={{ curve: row.curve }} className="block truncate font-medium hover:text-primary">
            {row.name}
          </Link>
          <p className="truncate text-sm text-muted">
            {displayName(row.creator)}
            {launches > 1 ? ` · ${launches}` : ""} · {ago(row.launchedAt)}
          </p>
        </div>
        <button type="button" aria-label={pinned ? "Unpin" : "Pin"} onClick={onPin} className={pinned ? "text-primary" : "text-muted"}>
          <Star className="h-4 w-4" fill={pinned ? "currentColor" : "none"} />
        </button>
      </div>
      <Spark bps={row.progressBps} />
      <div className="mt-auto">
        <p className="font-semibold text-up">{formatMcap(row.marketCap, row.quoteSymbol)}</p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-inset">
          <div className="h-full bg-up" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}
