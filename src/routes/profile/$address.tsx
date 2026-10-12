import { createFileRoute, Link } from "@tanstack/react-router";
import { ExplorerLink, Ident, Meter, Notice, Shell } from "@/components/ui";
import { ago, bpsLabel, formatEth, isAddress, shortAddr } from "@/lib/chain/format";
import { useProtocol } from "@/lib/chain/protocol";

export const Route = createFileRoute("/profile/$address")({
  component: ProfilePage,
  params: {
    parse: (params) => {
      if (!isAddress(params.address)) throw new Error("That creator address is not valid.");
      return { address: params.address };
    },
  },
});

function ProfilePage() {
  const { address } = Route.useParams();
  const proto = useProtocol();
  const mine = proto.launches.filter((row) => row.creator.toLowerCase() === address.toLowerCase());
  const locked = mine.reduce((sum, row) => sum + row.realEth, 0n);

  return (
    <Shell>
      <div className="flex flex-col gap-6">
        <header>
          <p className="text-sm text-primary">Creator</p>
          <h1 className="break-all font-serif text-3xl sm:text-4xl">{shortAddr(address)}</h1>
          <p className="mt-2 text-sm text-muted">
            <ExplorerLink kind="address" value={address}>
              View on the explorer
            </ExplorerLink>
          </p>
        </header>

        {proto.phase !== "ready" ? (
          <Notice>
            Creator markets are read from the pinned factory.{" "}
            <Link to="/create" className="underline">
              Pin one
            </Link>{" "}
            to see launches by this address. The list only includes the newest markets the factory returns.
          </Notice>
        ) : (
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line">
            <div className="bg-surface px-4 py-3">
              <dt className="text-sm text-muted">Launches in view</dt>
              <dd>{mine.length}</dd>
            </div>
            <div className="bg-surface px-4 py-3">
              <dt className="text-sm text-muted">Real ETH in those curves</dt>
              <dd>{formatEth(locked, 4)}</dd>
            </div>
          </dl>
        )}

        {proto.phase === "ready" && mine.length === 0 ? (
          <p className="rounded-2xl border border-line bg-surface px-4 py-8 text-center text-sm text-muted">
            No launch by this address in the current window.
          </p>
        ) : null}

        <ul className="flex flex-col gap-2">
          {mine.map((row) => (
            <li key={row.curve}>
              <Link
                to="/market/$curve"
                params={{ curve: row.curve }}
                className="grid items-center gap-3 rounded-2xl border border-line bg-surface px-3 py-3 sm:grid-cols-[1fr_auto]"
              >
                <span className="flex items-center gap-3">
                  <Ident seed={row.token} />
                  <span>
                    <span className="block font-medium">
                      {row.name} <span className="text-muted">{row.symbol}</span>
                    </span>
                    <span className="block text-sm text-muted">
                      {ago(row.launchedAt)} · {row.graduated ? "Graduated" : bpsLabel(row.progressBps)}
                    </span>
                  </span>
                </span>
                <span className="max-w-xs">
                  <Meter bps={row.progressBps} graduated={row.graduated} />
                  <span className="mt-1 block text-sm text-muted">{formatEth(row.marketCap)} ETH mcap</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Shell>
  );
}
