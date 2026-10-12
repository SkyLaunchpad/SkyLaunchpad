import type { Address, Hex } from "viem";

/** EIP-1167 minimal proxy runtime code pointing at `impl`. */
export function expectedClone(impl: Address): Hex {
  return `0x363d3d373d3d3d363d73${impl.slice(2).toLowerCase()}5af43d82803e903d91602b57fd5bf3`;
}

export function cloneTarget(code: string): Address | null {
  const c = code.toLowerCase();
  if (!c.startsWith("0x363d3d373d3d3d363d73") || !c.endsWith("5af43d82803e903d91602b57fd5bf3")) {
    return null;
  }
  if (c.length !== 92) return null;
  return `0x${c.slice(22, 62)}`;
}

export function sameCode(a: string, b: string): boolean {
  return a.toLowerCase() === b.toLowerCase();
}

/** Factory runtime embeds immutable implementation addresses where the artifact still has zeros. */
export function sameFactoryCode(live: string, expected: string): boolean {
  const a = live.toLowerCase();
  const b = expected.toLowerCase();
  if (!a.startsWith("0x") || !b.startsWith("0x") || a.length !== b.length) return false;
  let i = 2;
  while (i < a.length) {
    if (a[i] === b[i] && a[i + 1] === b[i + 1]) {
      i += 2;
      continue;
    }
    const word = a.slice(i, i + 40);
    if (i + 40 <= a.length && b.slice(i, i + 40) === "0".repeat(40) && word !== "0".repeat(40)) {
      i += 40;
      continue;
    }
    return false;
  }
  return true;
}
