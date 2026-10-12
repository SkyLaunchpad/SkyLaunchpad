import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { zeroAddress, type Address } from "viem";
import {
  claimRewardsCalldata,
  ensureRobinhood,
  estimateOrThrow,
  sendTx,
  waitForReceipt,
} from "@/lib/chain/browser";
import { bpsLabel, explainError, formatEth, shortAddr } from "@/lib/chain/format";
import { useProtocol } from "@/lib/chain/protocol";
import { readFeeShares, type FeeShare } from "@/lib/chain/reads";
import { useWallet } from "@/lib/chain/wallet";

export function FeeShares({
  user,
  canClaim,
  dense = false,
}: {
  user: Address;
  canClaim: boolean;
  dense?: boolean;
}) {
  const proto = useProtocol();
  const wallet = useWallet();
  const [rows, setRows] = useState<FeeShare[] | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<string>("");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (proto.phase !== "ready" || proto.launches.length === 0) {
      setRows([]);
      setError("");
      return;
    }
    let cancelled = false;
    void readFeeShares(proto.relay, proto.launches, user, proto.info?.rewards ?? null)
      .then((next) => {
        if (!cancelled) {
          setRows(next);
          setError("");
        }
      })
      .catch((err) => {
        if (!cancelled) setError(explainError(err));
      });
    return () => {
      cancelled = true;
    };
  }, [proto.phase, proto.launches, proto.relay, proto.info?.rewards, user, tick]);

  async function claim(row: FeeShare) {
    const rewards = proto.info?.rewards;
    if (!wallet.address || !rewards) {
      toast.error("Connect the wallet that holds the tokens.");
      return;
    }
    const from = wallet.address;
    setBusy(row.token);
    try {
      const eth = wallet.ethereum();
      await ensureRobinhood(eth);
      const tx = { from, to: rewards, data: claimRewardsCalldata(row.token), value: 0n };
      await estimateOrThrow(proto.relay, tx);
      const hash = await sendTx(eth, tx);
      const receipt = await waitForReceipt(proto.relay, hash);
      if (!receipt.ok) throw new Error("Claim reverted.");
      toast.success(`Claimed ${row.symbol} fees.`);
      setTick((n) => n + 1);
    } catch (err) {
      toast.error(explainError(err));
    } finally {
      setBusy("");
    }
  }

  return (
    <section className={dense ? "" : "flex flex-col gap-3"}>
      {dense ? null : (
        <header>
          <h2 className="font-serif text-2xl">Creator fees</h2>
          <p className="mt-1 text-sm leading-6 text-muted">
            The creator tax, plus 70% of the 1% trade fee. A fee wallet is paid in the same trade. Holders mode splits that cash by token balance. Claim it here. The curve, the locker, and the Uniswap pool do not earn.
          </p>
        </header>
      )}
      {proto.phase !== "ready" ? (
        <p className="text-sm text-muted">Fees appear after the V4 factory is verified.</p>
      ) : error ? (
        <p className="text-sm text-down">{error}</p>
      ) : rows == null ? (
        <p className="text-sm text-muted">Reading fees…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-muted">No creator-fee share for this wallet in the current markets.</p>
      ) : (
        <ul className={`flex flex-col ${dense ? "max-h-64 gap-2 overflow-y-auto" : "gap-2"}`}>
          {rows.map((row) => (
            <li key={row.curve} className="rounded-2xl border border-line bg-surface px-3 py-3 text-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link to="/market/$curve" params={{ curve: row.curve }} className="font-medium hover:text-primary">
                    {row.symbol}
                  </Link>
                  <p className="text-muted">
                    {row.holders ? "Holders" : "Fee wallet"} · tax {bpsLabel(row.taxBps)}
                  </p>
                </div>
                {row.holders ? (
                  <p className="text-right">
                    <span className="block font-medium">{formatEth(row.pending, 6)} {row.quoteSymbol}</span>
                    <span className="text-muted">to claim</span>
                  </p>
                ) : (
                  <p className="max-w-36 text-right text-muted">Paid each trade</p>
                )}
              </div>
              <p className="mt-2 text-muted">
                {row.holders
                  ? row.balance > 0n
                    ? "Your share follows your token balance."
                    : "You earn only while you hold this token."
                  : row.feeRecipient.toLowerCase() === user.toLowerCase()
                    ? "This wallet receives the creator tax and fee share on every trade. There is nothing to claim."
                    : `Paid on every trade to ${shortAddr(row.feeRecipient)}.`}
              </p>
              {canClaim && row.holders ? (
                <button
                  type="button"
                  className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-full border border-line bg-surface px-4 text-sm font-medium disabled:opacity-50"
                  disabled={busy === row.token || row.pending === 0n || !wallet.address}
                  onClick={() => void claim(row)}
                >
                  {busy === row.token ? "Check your wallet" : row.pending === 0n ? "Nothing to claim" : `Claim ${row.symbol}`}
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      )}
      {dense ? null : proto.info?.rewards && proto.info.rewards !== zeroAddress ? (
        <p className="break-all text-xs text-muted">Rewards contract {proto.info.rewards}</p>
      ) : null}
    </section>
  );
}
