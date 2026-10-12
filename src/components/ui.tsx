import { Link, useRouterState } from "@tanstack/react-router";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { LayoutGrid, LayoutList, Menu, Moon, Search, Sun, X } from "lucide-react";
import { toast } from "sonner";
import { ensureRobinhood } from "@/lib/chain/browser";
import { explainError, shortAddr } from "@/lib/chain/format";
import { EXPLORER } from "@/lib/chain/params";
import { useWallet } from "@/lib/chain/wallet";
import { useProtocol } from "@/lib/chain/protocol";
import { FeeShares } from "@/components/fee-shares";

export function Button({
  children,
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "line";
}) {
  const styles = {
    primary: "bg-primary text-primary-fg hover:opacity-90",
    ghost: "bg-transparent text-fg hover:bg-inset",
    line: "border border-line bg-surface text-fg hover:border-primary",
  }[variant];
  return (
    <button
      type={type}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${styles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm">
      <span className="font-medium text-fg">{label}</span>
      {children}
      {hint ? <span className="text-sm text-muted">{hint}</span> : null}
    </label>
  );
}

export const controlClass =
  "min-h-11 w-full rounded-xl border border-line bg-inset px-3 text-base text-fg outline-none placeholder:text-muted focus:border-primary";

export function Notice({ tone = "warn", children }: { tone?: "warn" | "bad" | "ok"; children: ReactNode }) {
  const styles = {
    warn: "border-primary/40 bg-primary/10 text-fg",
    bad: "border-primary bg-primary/15 text-fg",
    ok: "border-up/40 bg-up/10 text-fg",
  }[tone];
  return <div className={`rounded-2xl border px-4 py-3 text-sm leading-6 ${styles}`}>{children}</div>;
}

export function Ident({ seed, className = "" }: { seed: string; className?: string }) {
  let hash = 2166136261;
  for (const char of seed || "sky") hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  const cells: boolean[] = [];
  const tones: boolean[] = [];
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 3; col++) {
      const bit = (hash >> (row * 3 + col)) & 1;
      const tone = (hash >> (16 + row + col)) & 1;
      cells[row * 5 + col] = bit === 1;
      cells[row * 5 + (4 - col)] = bit === 1;
      tones[row * 5 + col] = tone === 1;
      tones[row * 5 + (4 - col)] = tone === 1;
    }
  }
  return (
    <span className={`grid h-11 w-11 shrink-0 grid-cols-5 grid-rows-5 gap-px rounded-2xl bg-inset p-1.5 ${className}`} aria-hidden>
      {cells.map((on, index) => (
        <span key={index} className={on ? (tones[index] ? "bg-primary" : "bg-fg/70") : "bg-transparent"} />
      ))}
    </span>
  );
}

export function Meter({ bps, graduated }: { bps: bigint; graduated: boolean }) {
  const width = Math.max(0, Math.min(100, Number(bps) / 100));
  return (
    <div className="h-2 overflow-hidden rounded-full bg-inset" role="meter" aria-valuenow={Math.round(width)} aria-valuemin={0} aria-valuemax={100}>
      <div className={`h-full ${graduated ? "bg-up" : "bg-primary"}`} style={{ width: `${width}%` }} />
    </div>
  );
}

export function ExplorerLink({
  kind,
  value,
  children,
}: {
  kind: "address" | "tx";
  value: string;
  children?: ReactNode;
}) {
  return (
    <a
      className="underline decoration-line underline-offset-4 hover:text-primary"
      href={`${EXPLORER}/${kind}/${value}`}
      target="_blank"
      rel="noreferrer"
    >
      {children ?? value}
    </a>
  );
}

const NAV = [
  { to: "/launchpad/create", label: "Create a token", test: (path: string) => path.startsWith("/launchpad/create") || path.startsWith("/create") },
  { to: "/launchpad", label: "Launches", test: (path: string) => path === "/" || path === "/launchpad" },
  { to: "/plp", label: "PLP", test: (path: string) => path.startsWith("/plp") },
  { to: "/analytics", label: "Analytics", test: (path: string) => path.startsWith("/analytics") },
] as const;

type SearchApi = { query: string; setQuery: (value: string) => void };
const SearchCtx = createContext<SearchApi>({ query: "", setQuery: () => {} });
export function useLaunchSearch(): SearchApi {
  return useContext(SearchCtx);
}

export function Shell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const proto = useProtocol();
  const wallet = useWallet();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = localStorage.getItem("sky.theme");
    const next = saved === "dark" ? "dark" : "light";
    setTheme(next);
    document.documentElement.dataset.theme = next === "dark" ? "dark" : "";
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target;
      const typing = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;
      if (event.key === "/" && !typing) {
        event.preventDefault();
        document.getElementById("sky-search")?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next === "dark" ? "dark" : "";
    localStorage.setItem("sky.theme", next);
  }

  const side = (
    <div className="flex h-full flex-col gap-4">
      <Link to="/launchpad" className="flex items-center gap-2 px-1" onClick={() => setOpen(false)}>
        <img src="/sky-mark.png" alt="" className="h-11 w-11 object-contain" />
        <span>
          <span className="block text-xl font-semibold leading-none tracking-tight">Sky</span>
          <span className="text-xs text-muted">Launchpad</span>
        </span>
      </Link>
      <dl className="rounded-2xl border border-line bg-surface px-3 py-3 text-sm">
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-muted">Name</dt>
          <dd className="text-right font-medium">Sky Launchpad</dd>
        </div>
        <div className="mt-1 flex items-baseline justify-between gap-3">
          <dt className="text-muted">Symbol</dt>
          <dd className="font-medium">SKY</dd>
        </div>
        <div className="mt-1 flex items-baseline justify-between gap-3">
          <dt className="text-muted">Contract</dt>
          <dd className="font-medium">N/A</dd>
        </div>
        <div className="mt-2 border-t border-line pt-2">
          <dt className="text-muted">Factory</dt>
          <dd className="mt-1 break-all font-mono text-[11px] leading-4">
            {proto.phase === "ready" && proto.factory ? (
              <a className="hover:text-fg" href={`${EXPLORER}/address/${proto.factory}`} target="_blank" rel="noreferrer">
                {proto.factory}
              </a>
            ) : (
              <span>Deploy the V4 factory</span>
            )}
          </dd>
        </div>
      </dl>
      <label className="flex min-h-11 items-center gap-2 rounded-xl border border-line bg-surface px-3 text-sm text-muted">
        <Search className="h-4 w-4 shrink-0" aria-hidden />
        <input
          id="sky-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search tokens and people"
          className="w-full bg-transparent text-base text-fg outline-none placeholder:text-muted"
        />
        <span className="rounded-md bg-inset px-1.5 py-0.5 text-xs">/</span>
      </label>
      <nav className="flex flex-col gap-1" aria-label="Primary">
        {NAV.map((item) => {
          const active = item.test(pathname);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={`flex min-h-11 items-center rounded-xl px-3 text-sm font-medium ${active ? "bg-inset text-fg" : "text-muted hover:bg-inset hover:text-fg"}`}
            >
              {item.label}
            </Link>
          );
        })}
        {wallet.address ? (
          <Link
            to="/profile/$address"
            params={{ address: wallet.address }}
            onClick={() => setOpen(false)}
            className={`flex min-h-11 items-center rounded-xl px-3 text-sm font-medium ${pathname.startsWith("/profile") ? "bg-inset text-fg" : "text-muted hover:bg-inset hover:text-fg"}`}
          >
            Profile
          </Link>
        ) : null}
      </nav>
      <div className="mt-auto flex flex-col gap-2">
        <button type="button" onClick={toggleTheme} className="flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm text-muted hover:bg-inset hover:text-fg">
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          Theme
        </button>
        <WalletButton />
      </div>
    </div>
  );

  return (
    <SearchCtx.Provider value={{ query, setQuery }}>
      <div className="min-h-screen md:grid md:grid-cols-[240px_minmax(0,1fr)]">
        {open ? <button type="button" className="fixed inset-0 z-30 bg-fg/40 md:hidden" aria-label="Close menu" onClick={() => setOpen(false)} /> : null}
        <aside className={`${open ? "fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-bg p-4 shadow-xl" : "hidden"} border-r border-line md:sticky md:top-0 md:flex md:h-screen md:w-auto md:flex-col md:bg-transparent md:p-3 md:shadow-none`}>
          {open ? (
            <button type="button" className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line md:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
              <X className="h-5 w-5" />
            </button>
          ) : null}
          {side}
        </aside>
        <div className="min-w-0">
          <header className="flex items-center gap-3 border-b border-line px-4 py-3 md:hidden">
            <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line" onClick={() => setOpen(true)} aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>
            <img src="/sky-mark.png" alt="" className="h-8 w-8 object-contain" />
            <Link to="/launchpad" className="text-lg font-semibold">Sky</Link>
            <div className="ml-auto">
              <WalletButton compact />
            </div>
          </header>
          <main className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8">{children}</main>
          <footer className="mx-auto grid w-full max-w-6xl gap-8 px-4 pb-8 md:grid-cols-3 md:px-8">
            <div>
              <h2 className="text-sm font-semibold">Launchpad</h2>
              <ul className="mt-3 flex flex-col gap-2 text-sm text-muted">
                <li><Link to="/launchpad/create" className="hover:text-fg">Create a token</Link></li>
                <li><Link to="/launchpad" className="hover:text-fg">Launches</Link></li>
                <li><Link to="/plp" className="hover:text-fg">PLP</Link></li>
                <li><Link to="/analytics" className="hover:text-fg">Analytics</Link></li>
              </ul>
            </div>
            <div>
              <h2 className="text-sm font-semibold">Resources</h2>
              <ul className="mt-3 flex flex-col gap-2 text-sm text-muted">
                <li><Link to="/docs" className="hover:text-fg">Fees and taxes</Link></li>
                <li><Link to="/guide" className="hover:text-fg">Go live</Link></li>
                <li><Link to="/simulate" className="hover:text-fg">Curve simulator</Link></li>
                <li><Link to="/contracts" className="hover:text-fg">Contracts</Link></li>
                <li><a href={EXPLORER} className="hover:text-fg" target="_blank" rel="noreferrer">Explorer</a></li>
              </ul>
            </div>
            <div>
              <h2 className="text-sm font-semibold">Risks</h2>
              <p className="mt-3 text-sm leading-6 text-muted">
                SkyLaunchpad is unaudited software. It is not Robinhood Markets and not Pons. Tokens can go to zero.
                Real ETH stays in the curve until holders sell. Nobody can withdraw it.
              </p>
            </div>
          </footer>
        </div>
      </div>
    </SearchCtx.Provider>
  );
}

export function ViewToggle({ view, onChange }: { view: "list" | "grid"; onChange: (view: "list" | "grid") => void }) {
  return (
    <div className="flex rounded-xl border border-line bg-surface p-1">
      <button type="button" aria-label="List" onClick={() => onChange("list")} className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${view === "list" ? "bg-inset text-fg" : "text-muted"}`}>
        <LayoutList className="h-4 w-4" />
      </button>
      <button type="button" aria-label="Grid" onClick={() => onChange("grid")} className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${view === "grid" ? "bg-inset text-fg" : "text-muted"}`}>
        <LayoutGrid className="h-4 w-4" />
      </button>
    </div>
  );
}

function WalletButton({ compact = false }: { compact?: boolean }) {
  const wallet = useWallet();
  const [pending, setPending] = useState(false);
  const [menu, setMenu] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menu) return;
    const onPointer = (event: MouseEvent) => {
      if (!root.current?.contains(event.target as Node)) setMenu(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenu(false);
    };
    window.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  if (!wallet.ready) {
    return <span className="px-3 text-sm text-muted">Wallet…</span>;
  }
  if (!wallet.hasProvider) {
    return (
      <a className="inline-flex min-h-11 items-center justify-center rounded-full border border-line px-4 text-sm" href="https://metamask.io/download/" target="_blank" rel="noreferrer">
        Get a wallet
      </a>
    );
  }
  if (!wallet.address) {
    return (
      <Button
        className={compact ? "" : "w-full"}
        disabled={pending || wallet.busy}
        onClick={() => {
          setPending(true);
          void wallet.connect().catch((error) => toast.error(explainError(error))).finally(() => setPending(false));
        }}
      >
        Connect wallet
      </Button>
    );
  }
  const address = wallet.address;
  return (
    <div ref={root} className={`relative ${compact ? "" : "w-full"}`}>
      <button
        type="button"
        className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-line bg-surface px-3 text-sm ${compact ? "" : "w-full"}`}
        aria-expanded={menu}
        aria-haspopup="menu"
        onClick={() => setMenu((open) => !open)}
      >
        <span className="h-2 w-2 rounded-full bg-up" aria-hidden />
        {shortAddr(address)}
      </button>
      {menu ? (
        <div
          role="menu"
          className={`absolute z-50 flex flex-col gap-3 rounded-2xl border border-line bg-bg p-3 shadow-xl ${compact ? "right-0 top-full mt-2 w-72" : "bottom-full left-0 mb-2 w-full"}`}
        >
          <div>
            <p className="text-xs text-muted">Connected</p>
            <p className="break-all font-mono text-xs">{address}</p>
          </div>
          {!wallet.onRobinhood ? (
            <Button
              variant="line"
              className="w-full"
              onClick={() => {
                void ensureRobinhood(wallet.ethereum()).catch((error) => toast.error(explainError(error)));
              }}
            >
              Switch to Robinhood Chain
            </Button>
          ) : (
            <p className="text-xs text-up">Robinhood Chain</p>
          )}
          <Link
            to="/profile/$address"
            params={{ address }}
            className="inline-flex min-h-11 items-center rounded-xl px-2 text-sm font-medium hover:bg-inset"
            onClick={() => setMenu(false)}
          >
            Profile
          </Link>
          <div className="border-t border-line pt-3">
            <p className="mb-2 text-xs font-medium text-muted">Tax rewards</p>
            <FeeShares user={address} canClaim dense />
          </div>
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-line text-sm"
            onClick={() => {
              setMenu(false);
              void wallet.disconnect();
            }}
          >
            Disconnect
          </button>
        </div>
      ) : null}
    </div>
  );
}
