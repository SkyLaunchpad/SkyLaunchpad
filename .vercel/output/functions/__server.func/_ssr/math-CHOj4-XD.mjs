import { a as CREATOR_SHARE_BPS, c as FEE_BPS, g as VIRTUAL_ETH, l as GRADUATION_ETH, m as TOTAL_SUPPLY, u as K } from "./wallet-I32zn3lV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/math-CHOj4-XD.js
function initialSnap() {
	return {
		virtualEth: VIRTUAL_ETH,
		virtualToken: TOTAL_SUPPLY,
		realEth: 0n,
		graduated: false
	};
}
function marketCapOf(snap) {
	return snap.virtualEth * TOTAL_SUPPLY / snap.virtualToken;
}
function progressBpsOf(snap) {
	if (snap.graduated) return 10000n;
	const p = snap.realEth * 10000n / GRADUATION_ETH;
	return p > 10000n ? 10000n : p;
}
function splitFee(fee) {
	const creator = fee * CREATOR_SHARE_BPS / 10000n;
	return {
		creator,
		protocol: fee - creator
	};
}
function quoteBuy(snap, value) {
	if (value < 10000000000000n) throw new Error("Minimum buy is 0.00001 ETH.");
	const fee = value * FEE_BPS / 10000n;
	const net = value - fee;
	const newVirtualEth = snap.virtualEth + net;
	const newVirtualToken = K / newVirtualEth;
	if (newVirtualToken >= snap.virtualToken) throw new Error("Not enough tokens left in the curve.");
	const tokensOut = snap.virtualToken - newVirtualToken;
	if (tokensOut <= 0n) throw new Error("Buy is too small.");
	return {
		tokensOut,
		fee,
		net
	};
}
function applyBuy(snap, value) {
	const q = quoteBuy(snap, value);
	return {
		snap: {
			virtualEth: snap.virtualEth + q.net,
			virtualToken: snap.virtualToken - q.tokensOut,
			realEth: snap.realEth + q.net,
			graduated: snap.graduated || snap.realEth + q.net >= 4200000000000000000n
		},
		tokensOut: q.tokensOut,
		fee: q.fee
	};
}
function quoteSell(snap, tokensIn) {
	if (tokensIn <= 0n) throw new Error("Enter a token amount.");
	const newVirtualToken = snap.virtualToken + tokensIn;
	const newVirtualEth = K / newVirtualToken;
	if (newVirtualEth >= snap.virtualEth) throw new Error("Sell is too small.");
	if (newVirtualEth < 1500000000000000000n) throw new Error("That sell asks for ETH the curve does not hold.");
	const ethGross = snap.virtualEth - newVirtualEth;
	if (ethGross > snap.realEth || ethGross <= 0n) throw new Error("The curve cannot pay that sell. Real ETH is only what buyers paid in.");
	const fee = ethGross * FEE_BPS / 10000n;
	const ethOut = ethGross - fee;
	if (ethOut <= 0n) throw new Error("Sell is too small after the fee.");
	return {
		ethOut,
		fee,
		ethGross
	};
}
function applySell(snap, tokensIn) {
	const q = quoteSell(snap, tokensIn);
	return {
		snap: {
			virtualEth: snap.virtualEth - q.ethGross,
			virtualToken: snap.virtualToken + tokensIn,
			realEth: snap.realEth - q.ethGross,
			graduated: snap.graduated
		},
		ethOut: q.ethOut,
		fee: q.fee
	};
}
function withSlippage(amount, bps) {
	return amount * (10000n - bps) / 10000n;
}
//#endregion
export { progressBpsOf as a, withSlippage as c, marketCapOf as i, applySell as n, quoteBuy as o, initialSnap as r, splitFee as s, applyBuy as t };
