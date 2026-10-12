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
