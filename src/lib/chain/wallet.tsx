import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Address } from "viem";
import { CHAIN_ID } from "./params";
import { connectWallet, getEthereum, readSilentAccount, type EthereumProvider } from "./browser";

type WalletState = {
  address: Address | null;
  chainId: number | null;
  hasProvider: boolean;
  ready: boolean;
  busy: boolean;
  onRobinhood: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  ethereum: () => EthereumProvider;
};

const Ctx = createContext<WalletState | null>(null);
const DISMISS_KEY = "sky.wallet.dismissed";

function dismissed(): boolean {
  try {
    return sessionStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<Address | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [hasProvider, setHasProvider] = useState(false);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const eth = getEthereum();
    setHasProvider(Boolean(eth));
    if (!eth) {
      setReady(true);
      return;
    }
    let cancelled = false;
    void readSilentAccount(eth)
      .then((found) => {
        if (cancelled) return;
        setChainId(found.chainId);
        if (!dismissed()) setAddress(found.address);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setReady(true);
      });

    const onAccounts = (...args: unknown[]) => {
      const accounts = args[0];
      const list = Array.isArray(accounts) ? accounts : [];
      const next = typeof list[0] === "string" ? (list[0] as Address) : null;
      if (!next) {
        try {
          sessionStorage.setItem(DISMISS_KEY, "1");
        } catch {
          /* ignore */
        }
        setAddress(null);
        return;
      }
      if (dismissed()) return;
      setAddress(next);
    };
    const onChain = (...args: unknown[]) => {
      const next = args[0];
      setChainId(typeof next === "string" ? Number(next) : null);
    };
    eth.on?.("accountsChanged", onAccounts);
    eth.on?.("chainChanged", onChain);
    return () => {
      cancelled = true;
      eth.removeListener?.("accountsChanged", onAccounts);
      eth.removeListener?.("chainChanged", onChain);
    };
  }, []);

  const api = useMemo<WalletState>(
    () => ({
      address,
      chainId,
      hasProvider,
      ready,
      busy,
      onRobinhood: chainId === CHAIN_ID,
      ethereum: () => {
        const eth = getEthereum();
        if (!eth) throw new Error("No wallet found. Install MetaMask or Rabby, then reload.");
        return eth;
      },
      connect: async () => {
        const eth = getEthereum();
        if (!eth) throw new Error("No wallet found. Install MetaMask or Rabby, then reload.");
        setBusy(true);
        try {
          try {
            sessionStorage.removeItem(DISMISS_KEY);
          } catch {
            /* ignore */
          }
          const next = await connectWallet(eth);
          const found = await readSilentAccount(eth);
          setAddress(next);
          setChainId(found.chainId);
        } finally {
          setBusy(false);
        }
      },
      disconnect: async () => {
        try {
          sessionStorage.setItem(DISMISS_KEY, "1");
        } catch {
          /* ignore */
        }
        setAddress(null);
        const eth = getEthereum();
        if (!eth) return;
        try {
          await eth.request({
            method: "wallet_revokePermissions",
            params: [{ eth_accounts: {} }],
          });
        } catch {
          /* Some wallets cannot revoke. The app still treats the wallet as signed out. */
        }
      },
    }),
    [address, chainId, hasProvider, ready, busy],
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useWallet(): WalletState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("Wallet provider missing.");
  return ctx;
}
