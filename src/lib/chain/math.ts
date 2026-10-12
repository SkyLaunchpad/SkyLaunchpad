import {
  CREATOR_SHARE_BPS,
  FEE_BPS,
  GRADUATION_ETH,
  K,
  MIN_TRADE_ETH,
  TOTAL_SUPPLY,
  VIRTUAL_ETH,
} from "./params";

export type Snap = {
  virtualEth: bigint;
  virtualToken: bigint;
  realEth: bigint;
  graduated: boolean;
};

export function initialSnap(): Snap {
  return {
    virtualEth: VIRTUAL_ETH,
    virtualToken: TOTAL_SUPPLY,
    realEth: 0n,
    graduated: false,
  };
}

export function marketCapOf(snap: Snap): bigint {
  return (snap.virtualEth * TOTAL_SUPPLY) / snap.virtualToken;
}

export function progressBpsOf(snap: Snap): bigint {
  if (snap.graduated) return 10_000n;
  const p = (snap.realEth * 10_000n) / GRADUATION_ETH;
  return p > 10_000n ? 10_000n : p;
}

export function splitFee(fee: bigint): { creator: bigint; protocol: bigint } {
  const creator = (fee * CREATOR_SHARE_BPS) / 10_000n;
  return { creator, protocol: fee - creator };
}

export function quoteBuy(snap: Snap, value: bigint): { tokensOut: bigint; fee: bigint; net: bigint } {
  if (value < MIN_TRADE_ETH) throw new Error("Minimum buy is 0.00001 ETH.");
  const fee = (value * FEE_BPS) / 10_000n;
  const net = value - fee;
  const newVirtualEth = snap.virtualEth + net;
  const newVirtualToken = K / newVirtualEth;
  if (newVirtualToken >= snap.virtualToken) throw new Error("Not enough tokens left in the curve.");
  const tokensOut = snap.virtualToken - newVirtualToken;
  if (tokensOut <= 0n) throw new Error("Buy is too small.");
  return { tokensOut, fee, net };
}

export function applyBuy(snap: Snap, value: bigint): { snap: Snap; tokensOut: bigint; fee: bigint } {
  const q = quoteBuy(snap, value);
  const next: Snap = {
    virtualEth: snap.virtualEth + q.net,
    virtualToken: snap.virtualToken - q.tokensOut,
    realEth: snap.realEth + q.net,
    graduated: snap.graduated || snap.realEth + q.net >= GRADUATION_ETH,
  };
  return { snap: next, tokensOut: q.tokensOut, fee: q.fee };
}

export function quoteSell(snap: Snap, tokensIn: bigint): { ethOut: bigint; fee: bigint; ethGross: bigint } {
  if (tokensIn <= 0n) throw new Error("Enter a token amount.");
  const newVirtualToken = snap.virtualToken + tokensIn;
  const newVirtualEth = K / newVirtualToken;
  if (newVirtualEth >= snap.virtualEth) throw new Error("Sell is too small.");
  if (newVirtualEth < VIRTUAL_ETH) throw new Error("That sell asks for ETH the curve does not hold.");
  const ethGross = snap.virtualEth - newVirtualEth;
  if (ethGross > snap.realEth || ethGross <= 0n) {
    throw new Error("The curve cannot pay that sell. Real ETH is only what buyers paid in.");
  }
  const fee = (ethGross * FEE_BPS) / 10_000n;
  const ethOut = ethGross - fee;
  if (ethOut <= 0n) throw new Error("Sell is too small after the fee.");
  return { ethOut, fee, ethGross };
}

export function applySell(snap: Snap, tokensIn: bigint): { snap: Snap; ethOut: bigint; fee: bigint } {
  const q = quoteSell(snap, tokensIn);
  return {
    snap: {
      virtualEth: snap.virtualEth - q.ethGross,
      virtualToken: snap.virtualToken + tokensIn,
      realEth: snap.realEth - q.ethGross,
      graduated: snap.graduated,
    },
    ethOut: q.ethOut,
    fee: q.fee,
  };
}

export function withSlippage(amount: bigint, bps: bigint): bigint {
  return (amount * (10_000n - bps)) / 10_000n;
}
