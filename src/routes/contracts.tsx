import { createFileRoute, Link } from "@tanstack/react-router";
import { Notice, Shell } from "@/components/ui";
import { formatEth } from "@/lib/chain/format";
import {
  CREATOR_SHARE_BPS,
  FEE_BPS,
  GRADUATION_ETH,
  LAUNCH_FEE,
  MIN_TRADE_ETH,
  TOTAL_SUPPLY,
  VERSION,
  VIRTUAL_ETH,
} from "@/lib/chain/params";

export const Route = createFileRoute("/contracts")({ component: ContractsPage });

const FILES = [
  ["SkyParams.sol", "Economics. One library, imported by the others."],
  ["SkyFactory.sol", "Deploys the token, the curve, the rewards splitter, and the Uniswap hook."],
  ["SkyCurve.sol", "Bonding curve until 4.2 of the pair. No withdraw function."],
  ["SkyToken.sol", "Fixed-supply ERC-20. Minted once, to the curve. Checkpoints holder fees."],
  ["SkyRewards.sol", "Splits creator fees across holders when a launch picks Holders."],
  ["SkyHook.sol", "Locks the Uniswap v4 position and takes the same fee after graduation."],
  ["SkyPool.sol", "Seeds the full-range position and routes later trades."],
  ["SkyLocker.sol", "Holds the leftover curve tokens. They cannot be withdrawn."],
] as const;

function ContractsPage() {
  const supply = (TOTAL_SUPPLY / 10n ** 18n).toLocaleString();
  return (
    <Shell>
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <header>
          <p className="text-sm text-primary">Contracts · {VERSION}</p>
          <h1 className="font-serif text-4xl">What your wallet deploys</h1>
          <p className="mt-3 text-muted">
            Deploy SkyFactory and the constructor also deploys the token and curve implementations. Each launch is
            an EIP-1167 clone of those implementations, initialized in the same transaction. The app pins a factory
            only when its bytecode, version, and parameters match this source.
          </p>
        </header>

        <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
          <Fact k="Supply" v={supply} />
          <Fact k="Virtual ETH" v={`${formatEth(VIRTUAL_ETH)} ETH`} />
          <Fact k="Graduation" v={`${formatEth(GRADUATION_ETH)} ETH real`} />
          <Fact k="Launch fee" v={`${formatEth(LAUNCH_FEE)} ETH`} />
          <Fact k="Trade fee" v={`${Number(FEE_BPS) / 100}%`} />
          <Fact k="Creator share of fee" v={`${Number(CREATOR_SHARE_BPS) / 100}%`} />
          <Fact k="Min trade" v={`${formatEth(MIN_TRADE_ETH, 5)} ETH`} />
          <Fact k="Admin on a token" v="None" />
        </dl>

        <ul className="flex flex-col gap-2">
          {FILES.map(([file, blurb]) => (
            <li key={file} className="rounded-2xl border border-line bg-surface px-4 py-3">
              <a className="font-medium underline decoration-line underline-offset-4" href={`/contracts/${file}`} target="_blank" rel="noreferrer">
                {file}
              </a>
              <p className="mt-1 text-sm text-muted">{blurb}</p>
            </li>
          ))}
        </ul>

        <Notice>
          Source on this site is the source this build compiles. After you deploy, compare the factory address on
          the explorer with the address the app pinned. An unaudited contract can still contain a bug. Do not send
          size you cannot lose. The ETH split is written up in{" "}
          <Link to="/docs" className="underline underline-offset-4">Fees and taxes</Link>.
        </Notice>
      </div>
    </Shell>
  );
}

function Fact({ k, v }: { k: string; v: string }) {
  return (
    <div className="bg-surface px-4 py-3">
      <dt className="text-sm text-muted">{k}</dt>
      <dd className="text-base">{v}</dd>
    </div>
  );
}
