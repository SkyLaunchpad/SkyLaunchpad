import { createFileRoute, Link } from "@tanstack/react-router";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Ident, Notice, Shell } from "@/components/ui";
import { capNumber, formatEth, shortAddr } from "@/lib/chain/format";
import { useProtocol } from "@/lib/chain/protocol";

export const Route = createFileRoute("/analytics")({ component: AnalyticsPage });

function AnalyticsPage() {
  const proto = useProtocol();
  const rows = proto.launches;
  const locked = rows.reduce((sum, row) => sum + row.realEth, 0n);
  const graduated = rows.filter((row) => row.graduated).length;
  const near = rows.filter((row) => !row.graduated && Number(row.progressBps) >= 7000).length;
  const creators = new Set(rows.map((row) => row.creator.toLowerCase())).size;
  const ranked = [...rows].sort((a, b) => (a.marketCap > b.marketCap ? -1 : 1)).slice(0, 8);
  const chart = ranked.map((row) => ({
    name: row.symbol || shortAddr(row.token),
    cap: capNumber(row.marketCap),
  }));

  return (
    <Shell>
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-sm text-primary">Analytics</p>
          <h1 className="font-serif text-4xl">What this factory actually holds</h1>
          <p className="mt-2 max-w-xl text-muted">
            Figures are the latest {rows.length} markets returned by the pinned SkyFactory. There is no off-chain
            index and no estimated dollar price.
          </p>
        </div>

        {proto.phase !== "ready" ? (
          <Notice>
            {proto.phase === "bad"
              ? proto.reason
              : "Pin a verified factory on the Launch page. Until then there is nothing on chain to chart."}{" "}
            <Link to="/create" className="underline">
              Launch
            </Link>
          </Notice>
        ) : null}

        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
          <Stat label="Markets shown" value={String(rows.length)} />
          <Stat label="Real ETH locked" value={formatEth(locked, 4)} />
          <Stat label="Near graduation" value={String(near)} />
          <Stat label="Graduated" value={String(graduated)} />
        </dl>

        <section className="rounded-2xl border border-line bg-surface p-4">
          <div className="mb-3 flex items-end justify-between">
            <h2 className="font-serif text-2xl">Market cap, ETH</h2>
            <p className="text-sm text-muted">{creators} creators in this window</p>
          </div>
          {chart.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted">No launches to rank.</p>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chart}>
                  <XAxis dataKey="name" stroke="var(--color-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <Tooltip
                    formatter={(value) => [`${Number(value).toFixed(4)} ETH`, "Mcap"]}
                    contentStyle={{
                      background: "var(--color-inset)",
                      border: "1px solid var(--color-line)",
                      borderRadius: 12,
                      color: "var(--color-fg)",
                    }}
                  />
                  <Bar dataKey="cap" fill="var(--color-primary)" radius={6} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        <ul className="flex flex-col gap-2">
          {ranked.map((row) => (
            <li key={row.curve}>
              <Link
                to="/market/$curve"
                params={{ curve: row.curve }}
                className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface px-3 py-3"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <Ident seed={row.token} />
                  <span className="min-w-0">
                    <span className="block truncate font-medium">
                      {row.name} <span className="text-muted">{row.symbol}</span>
                    </span>
                    <span className="block text-sm text-muted">{formatEth(row.realEth, 4)} ETH real</span>
                  </span>
                </span>
                <span className="text-right text-sm">
                  <span className="block">{formatEth(row.marketCap)} ETH</span>
                  <span className="text-muted">{row.graduated ? "Graduated" : "Open"}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Shell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface px-4 py-3">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="truncate text-base">{value}</dd>
    </div>
  );
}
