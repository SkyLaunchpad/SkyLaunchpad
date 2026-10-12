import { useServerFn } from "@tanstack/react-start";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Address } from "viem";
import { explainError, isAddress } from "./format";
import type { FactoryInfo, LaunchRow, Relay } from "./reads";
import { readChain, readFactory, unwrap } from "./reads";
import { robinhoodRelay, type RpcCall, type RpcItem } from "./rpc";

const STORAGE_KEY = "skylaunchpad.factory";

type ChainPulse = { chainId: number; block: bigint; gas: bigint };

type ProtocolState = {
  phase: "boot" | "none" | "checking" | "ready" | "bad";
  factory: Address | null;
  info: FactoryInfo | null;
  launches: LaunchRow[];
  chain: ChainPulse | null;
  reason: string;
  refreshedAt: number;
};

type ProtocolApi = ProtocolState & {
  relay: Relay;
  refresh: () => Promise<void>;
  pinFactory: (factory: Address) => Promise<void>;
  clearFactory: () => void;
};

const Ctx = createContext<ProtocolApi | null>(null);

function readStored(): Address | null {
  try {
    const url = new URLSearchParams(window.location.search).get("factory");
    if (isAddress(url)) {
      localStorage.setItem(STORAGE_KEY, url);
      return url;
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    return isAddress(stored) ? stored : null;
  } catch {
    return null;
  }
}

export function ProtocolProvider({ children }: { children: ReactNode }) {
  const relayFn = useServerFn(robinhoodRelay);
  const relayRef = useRef(relayFn);
  relayRef.current = relayFn;
  const relay = useCallback<Relay>(async (calls: RpcCall[]) => {
    return unwrap((await relayRef.current({ data: { calls } })) as RpcItem[]);
  }, []);
  const factoryRef = useRef<Address | null>(null);
  const busy = useRef(false);
  const [state, setState] = useState<ProtocolState>({
    phase: "boot",
    factory: null,
    info: null,
    launches: [],
    chain: null,
    reason: "",
    refreshedAt: 0,
  });

  const load = useCallback(
    async (factory: Address | null) => {
      let chain: ChainPulse | null = null;
      try {
        chain = await readChain(relay);
      } catch (error) {
        setState({
          phase: factory ? "bad" : "none",
          factory,
          info: null,
          launches: [],
          chain: null,
          reason: explainError(error),
          refreshedAt: Date.now(),
        });
        return;
      }
      if (!factory) {
        setState({
          phase: "none",
          factory: null,
          info: null,
          launches: [],
          chain,
          reason: "",
          refreshedAt: Date.now(),
        });
        return;
      }
      try {
        const verified = await readFactory(relay, factory);
        setState({
          phase: "ready",
          factory,
          info: verified.info,
          launches: verified.launches,
          chain,
          reason: "",
          refreshedAt: Date.now(),
        });
      } catch (error) {
        setState({
          phase: "bad",
          factory,
          info: null,
          launches: [],
          chain,
          reason: explainError(error),
          refreshedAt: Date.now(),
        });
      }
    },
    [relay],
  );

  const refresh = useCallback(async () => {
    if (busy.current) return;
    busy.current = true;
    try {
      await load(factoryRef.current);
    } finally {
      busy.current = false;
    }
  }, [load]);

  const pinFactory = useCallback(
    async (factory: Address) => {
      localStorage.setItem(STORAGE_KEY, factory);
      factoryRef.current = factory;
      const url = new URL(window.location.href);
      url.searchParams.set("factory", factory);
      window.history.replaceState({}, "", url);
      await load(factory);
    },
    [load],
  );

  const clearFactory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    factoryRef.current = null;
    const url = new URL(window.location.href);
    url.searchParams.delete("factory");
    window.history.replaceState({}, "", url);
    void load(null);
  }, [load]);

  useEffect(() => {
    const initial = readStored();
    factoryRef.current = initial;
    void refresh();
    const timer = window.setInterval(() => {
      void refresh();
    }, 20_000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  const api = useMemo<ProtocolApi>(
    () => ({ ...state, relay, refresh, pinFactory, clearFactory }),
    [state, relay, refresh, pinFactory, clearFactory],
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useProtocol(): ProtocolApi {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("Protocol provider missing.");
  return ctx;
}
