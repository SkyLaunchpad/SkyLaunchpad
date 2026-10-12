import type { ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button, Notice, Shell } from "@/components/ui";
import { BRIDGE_DOCS, CHAIN_ID, CHAIN_NAME, CONNECT_DOCS, EXPLORER, RPC_PUBLIC } from "@/lib/chain/params";
import { useProtocol } from "@/lib/chain/protocol";

export const Route = createFileRoute("/guide")({ component: GuidePage });

const NETWORK = [
  ["Network name", CHAIN_NAME],
  ["Chain ID", String(CHAIN_ID)],
  ["Chain ID (hex)", "0x1237"],
  ["RPC URL", RPC_PUBLIC],
  ["Currency", "ETH"],
  ["Explorer", EXPLORER],
] as const;

function GuidePage() {
  const proto = useProtocol();
  return (
    <Shell>
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <header>
          <p className="text-sm text-primary">Go live · Robinhood Chain mainnet</p>
          <h1 className="mt-1 font-serif text-4xl leading-tight sm:text-5xl">Run SkyLaunchpad for real</h1>
          <p className="mt-3 text-base text-muted">
            Nothing here is a demo chain. Reads come from mainnet chain ID {CHAIN_ID}. A launch is a wallet
            signature that deploys contracts and moves ETH. This app never holds your keys.
          </p>
        </header>

        <section className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
          <Pulse label="RPC" value={proto.chain ? "Mainnet" : proto.reason ? "Unreachable" : "Reading…"} />
          <Pulse label="Chain" value={proto.chain ? String(proto.chain.chainId) : "—"} />
          <Pulse label="Block" value={proto.chain ? proto.chain.block.toLocaleString() : "—"} />
          <Pulse label="Gas" value={proto.chain ? `${(Number(proto.chain.gas) / 1e9).toFixed(3)} gwei` : "—"} />
        </section>

        {proto.chain ? (
          <Notice tone="ok">
            Robinhood Chain is answering. Latest block {proto.chain.block.toLocaleString()} was read through the
            app’s read-only relay. Sends still happen in your wallet.
          </Notice>
        ) : (
          <Notice tone="warn">{proto.reason || "Waiting for the first mainnet read."}</Notice>
        )}

        <ol className="flex flex-col gap-4">
          <Step n="1" title="Install a wallet">
            <p>
              Use MetaMask, Rabby, or any wallet that injects <span className="text-fg">window.ethereum</span>.
              SkyLaunchpad does not have an email login. The address that deploys the factory becomes the fee
              treasury.
            </p>
          </Step>
          <Step n="2" title="Add Robinhood Chain">
            <p>
              Connect, then use Switch to Robinhood in the header. If the network is missing, the wallet prompt
              fills these values. You can also add it by hand.
            </p>
            <dl className="mt-3 overflow-hidden rounded-2xl border border-line">
              {NETWORK.map(([label, value]) => (
                <div key={label} className="flex flex-col gap-1 border-b border-line px-3 py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
                  <dt className="text-muted">{label}</dt>
                  <dd className="flex items-center gap-2 break-all text-fg">
                    <span>{value}</span>
                    <button
                      type="button"
                      className="min-h-11 shrink-0 rounded-full bg-inset px-3 text-sm text-fg"
                      onClick={() => {
                        void navigator.clipboard.writeText(value).then(
                          () => toast.success(`Copied ${label}`),
                          () => toast.error("Clipboard blocked. Select the value and copy it."),
                        );
                      }}
                    >
                      Copy
                    </button>
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-3">
              Official connection notes:{" "}
              <a className="underline underline-offset-4" href={CONNECT_DOCS} target="_blank" rel="noreferrer">
                Robinhood Chain docs
              </a>
              . Gas is ETH on this chain, not a different coin.
            </p>
          </Step>
          <Step n="3" title="Bridge a little ETH">
            <p>
              A factory deploy is one transaction. A token launch costs 0.0005 ETH plus any creator buy, plus gas.
              A first trade can be 0.01 ETH. Bridge only what you will use.
            </p>
            <p className="mt-2">
              Bridge from Ethereum using{" "}
              <a className="underline underline-offset-4" href={BRIDGE_DOCS} target="_blank" rel="noreferrer">
                Robinhood’s bridge guide
              </a>
              . Testnet ETH will not pay mainnet gas. Confirm the wallet shows chain ID {CHAIN_ID} before you send
              anything.
            </p>
          </Step>
          <Step n="4" title="Deploy SkyFactory once">
            <p>
              Open Launch and choose Deploy SkyFactory. You sign one transaction. It deploys the factory and the
              token and curve implementations. The app checks the bytecode, the version string, and the economics
              before it will list markets. If the check fails, it refuses the address.
            </p>
            <p className="mt-2">
              You receive the 0.0005 ETH launch fee and 30% of the 1% trade fee on markets created while you are
              treasury. You cannot withdraw liquidity. Share the pinned address, or the page URL which carries{" "}
              <span className="text-fg">?factory=0x…</span>, so other people read the same protocol.
            </p>
            <p className="mt-2">
              Already deployed? Paste that factory on the Launch page. A factory from a different build will not
              pin.
            </p>
          </Step>
          <Step n="5" title="Launch a token">
            <p>
              Name (1–32 characters), symbol (1–8 letters or numbers), optional short description, optional
              creator buy. One signature creates the token, the curve, and your buy. Supply is one billion, all
              minted to the curve. There is no second mint.
            </p>
            <p className="mt-2">
              Opening price is a 1.5 ETH virtual reserve. That virtual ETH is not money. Real ETH appears only
              when someone buys.
            </p>
          </Step>
          <Step n="6" title="Trade">
            <p>
              Buys pay ETH to the curve. After a 1% fee, the rest is locked as real reserves and you receive
              tokens. Sells need an approval, then the curve pays ETH it actually holds. A sell cannot drain the
              virtual offset. Slippage is enforced on chain with the minimum you signed.
            </p>
          </Step>
          <Step n="7" title="Graduation is a mark, not a migration">
            <p>
              When real reserves reach 4.2 ETH the market is graduated forever. Trading stays on the same curve.
              There is no automatic Uniswap migration and no admin key that can move the ETH.
            </p>
          </Step>
        </ol>

        <section className="rounded-2xl border border-line bg-surface p-4">
          <h2 className="font-serif text-2xl">What this app will not do</h2>
          <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-sm text-muted">
            <li>It will not sign for you, store a seed phrase, or relay a send.</li>
            <li>It will not list a contract whose bytecode is not this build.</li>
            <li>It will not invent market caps. Empty means that factory has no launches yet.</li>
            <li>Contracts are unaudited. Tokens can go to zero. This is not Robinhood Markets and not Pons.</li>
          </ul>
        </section>

        <div className="flex flex-wrap gap-2">
          <Link to="/create" className="inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-fg">
            Open launch
          </Link>
          <Link to="/simulate" className="inline-flex min-h-11 items-center rounded-full border border-line px-5 text-sm">
            Try the curve first
          </Link>
          <Button
            variant="line"
            onClick={() => proto.refresh().then(() => toast.success("Reread mainnet")).catch(() => toast.error("Mainnet read failed"))}
          >
            Reread chain
          </Button>
        </div>
      </div>
    </Shell>
  );
}

function Pulse({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface px-4 py-3">
      <p className="text-sm text-muted">{label}</p>
      <p className="truncate text-base">{value}</p>
    </div>
  );
}

function Step({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <li className="rounded-2xl border border-line bg-surface p-4">
      <p className="text-sm text-primary">Step {n}</p>
      <h2 className="mt-1 font-serif text-2xl">{title}</h2>
      <div className="mt-2 text-sm leading-6 text-muted">{children}</div>
    </li>
  );
}
