export function parseEth(input: string): bigint | null {
  const s = input.trim();
  if (!s) return 0n;
  if (!/^\d+(\.\d{0,18})?$/.test(s)) return null;
  const [whole, frac = ""] = s.split(".");
  const padded = (frac + "0".repeat(18)).slice(0, 18);
  try {
    return BigInt(whole) * 10n ** 18n + BigInt(padded || "0");
  } catch {
    return null;
  }
}

export function formatEth(wei: bigint, digits = 4): string {
  const neg = wei < 0n;
  const v = neg ? -wei : wei;
  const base = 10n ** 18n;
  const whole = v / base;
  const fracFull = (v % base).toString().padStart(18, "0").slice(0, digits).replace(/0+$/, "");
  const body = fracFull.length > 0 ? `${whole.toString()}.${fracFull}` : whole.toString();
  return neg ? `-${body}` : body;
}

export function formatTokens(amount: bigint, digits = 2): string {
  const base = 10n ** 18n;
  const whole = amount / base;
  const frac = (amount % base).toString().padStart(18, "0").slice(0, digits).replace(/0+$/, "");
  const grouped = whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return frac ? `${grouped}.${frac}` : grouped;
}

export function shortAddr(addr: string): string {
  if (addr.length < 12) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function ago(unixSeconds: number, now = Date.now()): string {
  const s = Math.max(0, Math.floor(now / 1000) - unixSeconds);
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  const d = Math.floor(s / 86400);
  return `${d}d`;
}

const NAME_A = ["Tiny", "Slow", "Bold", "Calm", "Keen", "Warm", "Fair", "Wild", "Neat", "Spry", "Quiet", "Vivid"];
const NAME_B = ["Mint", "Cedar", "Coral", "Amber", "Slate", "Pearl", "Olive", "Ivory", "Copper", "Silver", "Moss", "Indigo"];
const NAME_C = ["Quail", "Wren", "Otter", "Heron", "Lynx", "Finch", "Puffin", "Badger", "Marten", "Ibis", "Newt", "Robin"];

export function displayName(addr: string): string {
  let hash = 2166136261;
  for (const char of addr.toLowerCase()) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  const u = hash >>> 0;
  return `${NAME_A[u % NAME_A.length]}${NAME_B[(u >>> 8) % NAME_B.length]}${NAME_C[(u >>> 16) % NAME_C.length]}`;
}

export function formatMcap(wei: bigint, unit = "ETH"): string {
  const whole = Number(wei / 10n ** 14n) / 10_000;
  if (!Number.isFinite(whole)) return `${formatEth(wei, 2)} ${unit}`;
  if (whole >= 1000) return `${(whole / 1000).toFixed(whole >= 10000 ? 0 : 1)}k ${unit}`;
  if (whole >= 100) return `${whole.toFixed(0)} ${unit}`;
  if (whole >= 1) return `${whole.toFixed(2)} ${unit}`;
  return `${whole.toFixed(4)} ${unit}`;
}

export function bpsLabel(bps: bigint | number): string {
  const n = typeof bps === "number" ? bps : Number(bps);
  return `${(n / 100).toFixed(n % 100 === 0 ? 0 : 1)}%`;
}

export function isAddress(value: unknown): value is `0x${string}` {
  return typeof value === "string" && /^0x[a-fA-F0-9]{40}$/.test(value);
}

export function explainError(error: unknown): string {
  const msg = error instanceof Error ? error.message : String(error);
  if (/user rejected|user denied|rejected the request/i.test(msg)) return "Signature declined in the wallet.";
  if (/insufficient funds/i.test(msg)) return "Not enough ETH on Robinhood Chain for this amount plus gas.";
  if (/chain/i.test(msg) && /mismatch|wrong/i.test(msg)) return msg;
  const cleaned = msg.replace(/^Error:\s*/, "").trim();
  return cleaned.length > 320 ? `${cleaned.slice(0, 320)}…` : cleaned;
}

export function capNumber(wei: bigint): number {
  return Number(wei / 10n ** 14n) / 10_000;
}
