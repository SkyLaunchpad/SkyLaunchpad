import { i as __toESM } from "../_runtime.mjs";
import { C as useRouter, Q as require_react, q as isRedirect, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as decodeFunctionResult, c as encodeAbiParameters, d as keccak256, f as toHex, i as encodeDeployData, l as concat, n as getContractAddress, r as getCreate2Address, s as encodeFunctionData, t as zeroAddress } from "../_libs/viem.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wallet-CeYoLLWh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useServerFn(serverFn) {
	const router = useRouter();
	return import_react.useCallback(async (...args) => {
		try {
			const res = await serverFn(...args);
			if (isRedirect(res)) throw res;
			return res;
		} catch (err) {
			if (isRedirect(err)) {
				err.options._fromLocation = router.stores.location.get();
				return router.navigate(router.resolveRedirect(err).options);
			}
			throw err;
		}
	}, [router, serverFn]);
}
function parseEth(input) {
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
function formatEth(wei, digits = 4) {
	const neg = wei < 0n;
	const v = neg ? -wei : wei;
	const base = 10n ** 18n;
	const whole = v / base;
	const fracFull = (v % base).toString().padStart(18, "0").slice(0, digits).replace(/0+$/, "");
	const body = fracFull.length > 0 ? `${whole.toString()}.${fracFull}` : whole.toString();
	return neg ? `-${body}` : body;
}
function formatTokens(amount, digits = 2) {
	const base = 10n ** 18n;
	const whole = amount / base;
	const frac = (amount % base).toString().padStart(18, "0").slice(0, digits).replace(/0+$/, "");
	const grouped = whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	return frac ? `${grouped}.${frac}` : grouped;
}
function shortAddr(addr) {
	if (addr.length < 12) return addr;
	return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}
function ago(unixSeconds, now = Date.now()) {
	const s = Math.max(0, Math.floor(now / 1e3) - unixSeconds);
	if (s < 60) return `${s}s`;
	if (s < 3600) return `${Math.floor(s / 60)}m`;
	if (s < 86400) return `${Math.floor(s / 3600)}h`;
	return `${Math.floor(s / 86400)}d`;
}
var NAME_A = [
	"Tiny",
	"Slow",
	"Bold",
	"Calm",
	"Keen",
	"Warm",
	"Fair",
	"Wild",
	"Neat",
	"Spry",
	"Quiet",
	"Vivid"
];
var NAME_B = [
	"Mint",
	"Cedar",
	"Coral",
	"Amber",
	"Slate",
	"Pearl",
	"Olive",
	"Ivory",
	"Copper",
	"Silver",
	"Moss",
	"Indigo"
];
var NAME_C = [
	"Quail",
	"Wren",
	"Otter",
	"Heron",
	"Lynx",
	"Finch",
	"Puffin",
	"Badger",
	"Marten",
	"Ibis",
	"Newt",
	"Robin"
];
function displayName(addr) {
	let hash = 2166136261;
	for (const char of addr.toLowerCase()) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
	const u = hash >>> 0;
	return `${NAME_A[u % NAME_A.length]}${NAME_B[(u >>> 8) % NAME_B.length]}${NAME_C[(u >>> 16) % NAME_C.length]}`;
}
function bpsLabel(bps) {
	const n = typeof bps === "number" ? bps : Number(bps);
	return `${(n / 100).toFixed(n % 100 === 0 ? 0 : 1)}%`;
}
function isAddress$1(value) {
	return typeof value === "string" && /^0x[a-fA-F0-9]{40}$/.test(value);
}
function explainError(error) {
	const msg = error instanceof Error ? error.message : String(error);
	if (/user rejected|user denied|rejected the request/i.test(msg)) return "Signature declined in the wallet.";
	if (/insufficient funds/i.test(msg)) return "Not enough ETH on Robinhood Chain for this amount plus gas.";
	if (/chain/i.test(msg) && /mismatch|wrong/i.test(msg)) return msg;
	const cleaned = msg.replace(/^Error:\s*/, "").trim();
	return cleaned.length > 320 ? `${cleaned.slice(0, 320)}…` : cleaned;
}
function capNumber(wei) {
	return Number(wei / 10n ** 14n) / 1e4;
}
/** Keep in lockstep with contracts/SkyParams.sol. Live factories are checked on chain. */
var TOTAL_SUPPLY = 1000000000n * 10n ** 18n;
var VIRTUAL_ETH = 1500000000000000000n;
var GRADUATION_ETH = 4200000000000000000n;
var FEE_BPS = 100n;
var CREATOR_SHARE_BPS = 7000n;
var LAUNCH_FEE = 500000000000000n;
var MIN_TRADE_ETH = 10000000000000n;
var K = VIRTUAL_ETH * TOTAL_SUPPLY;
var MAX_CREATOR_TAX_BPS = 300n;
var SNIPE_START_BPS = 9900n;
var SNIPE_WINDOW = 5n;
var VERSION = "skylaunchpad-7";
/** Deployed SkyFactory on Robinhood Chain. The site always reads this address. */
var OFFICIAL_FACTORY = "0x9a64d4DbB49949Fd73254Ce1ea3Ad99587667543";
var CHAIN_ID = 4663;
var CHAIN_ID_HEX = "0x1237";
var CHAIN_NAME = "Robinhood Chain";
var RPC_PUBLIC = "https://rpc.mainnet.chain.robinhood.com";
var EXPLORER = "https://robinhoodchain.blockscout.com";
var V4_POOL_MANAGER = "0x8366a39CC670B4001A1121B8F6A443A643e40951";
var V4_QUOTER = "0x8dc178efb8111bb0973dd9d722ebeff267c98f94";
var BRIDGE_DOCS = "https://docs.robinhood.com/chain/bridging/";
var CONNECT_DOCS = "https://docs.robinhood.com/chain/connecting/";
var EXPECTED_PARAMS = [
	LAUNCH_FEE,
	GRADUATION_ETH,
	VIRTUAL_ETH,
	TOTAL_SUPPLY,
	FEE_BPS,
	CREATOR_SHARE_BPS,
	MIN_TRADE_ETH,
	MAX_CREATOR_TAX_BPS
];
var tokenAbi = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [{
			"internalType": "address",
			"name": "",
			"type": "address"
		}, {
			"internalType": "address",
			"name": "",
			"type": "address"
		}],
		"name": "allowance",
		"outputs": [{
			"internalType": "uint256",
			"name": "",
			"type": "uint256"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [{
			"internalType": "address",
			"name": "spender",
			"type": "address"
		}, {
			"internalType": "uint256",
			"name": "amount",
			"type": "uint256"
		}],
		"name": "approve",
		"outputs": [{
			"internalType": "bool",
			"name": "",
			"type": "bool"
		}],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [{
			"internalType": "address",
			"name": "",
			"type": "address"
		}],
		"name": "balanceOf",
		"outputs": [{
			"internalType": "uint256",
			"name": "",
			"type": "uint256"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [{
			"internalType": "address",
			"name": "curve_",
			"type": "address"
		}],
		"name": "bindCurve",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "curve",
		"outputs": [{
			"internalType": "address",
			"name": "",
			"type": "address"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "decimals",
		"outputs": [{
			"internalType": "uint8",
			"name": "",
			"type": "uint8"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "description",
		"outputs": [{
			"internalType": "string",
			"name": "",
			"type": "string"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "factory",
		"outputs": [{
			"internalType": "address",
			"name": "",
			"type": "address"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name_",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "symbol_",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "factory_",
				"type": "address"
			}
		],
		"name": "initialize",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "logo",
		"outputs": [{
			"internalType": "string",
			"name": "",
			"type": "string"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [{
			"internalType": "string",
			"name": "",
			"type": "string"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "logo_",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "description_",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "twitter",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "telegram",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "discord",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "website",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "farcaster",
				"type": "string"
			}
		],
		"name": "setMeta",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "socials",
		"outputs": [
			{
				"internalType": "string",
				"name": "twitter",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "telegram",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "discord",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "website",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "farcaster",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [{
			"internalType": "string",
			"name": "",
			"type": "string"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [{
			"internalType": "uint256",
			"name": "",
			"type": "uint256"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [{
			"internalType": "address",
			"name": "to",
			"type": "address"
		}, {
			"internalType": "uint256",
			"name": "amount",
			"type": "uint256"
		}],
		"name": "transfer",
		"outputs": [{
			"internalType": "bool",
			"name": "",
			"type": "bool"
		}],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [{
			"internalType": "bool",
			"name": "",
			"type": "bool"
		}],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];
var curveAbi = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [{
			"indexed": true,
			"internalType": "address",
			"name": "curve",
			"type": "address"
		}, {
			"indexed": false,
			"internalType": "uint256",
			"name": "realEth",
			"type": "uint256"
		}],
		"name": "Graduated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [{
			"indexed": true,
			"internalType": "bytes32",
			"name": "poolId",
			"type": "bytes32"
		}],
		"name": "PoolOpened",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [{
			"indexed": true,
			"internalType": "address",
			"name": "next",
			"type": "address"
		}],
		"name": "ProtocolUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "trader",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "isBuy",
				"type": "bool"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "ethAmount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "tokenAmount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "realEth",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "marketCap",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "Trade",
		"type": "event"
	},
	{
		"inputs": [{
			"internalType": "address",
			"name": "recipient",
			"type": "address"
		}, {
			"internalType": "uint256",
			"name": "minTokens",
			"type": "uint256"
		}],
		"name": "buy",
		"outputs": [{
			"internalType": "uint256",
			"name": "tokensOut",
			"type": "uint256"
		}],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "minTokens",
				"type": "uint256"
			}
		],
		"name": "buyFromFactory",
		"outputs": [{
			"internalType": "uint256",
			"name": "tokensOut",
			"type": "uint256"
		}],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "minTokens",
				"type": "uint256"
			}
		],
		"name": "buyQuote",
		"outputs": [{
			"internalType": "uint256",
			"name": "tokensOut",
			"type": "uint256"
		}],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "creator",
		"outputs": [{
			"internalType": "address",
			"name": "",
			"type": "address"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "creatorTaxBps",
		"outputs": [{
			"internalType": "uint16",
			"name": "",
			"type": "uint16"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "deposited",
		"outputs": [{
			"internalType": "bool",
			"name": "",
			"type": "bool"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "factory",
		"outputs": [{
			"internalType": "address",
			"name": "",
			"type": "address"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "feeRecipient",
		"outputs": [{
			"internalType": "address",
			"name": "",
			"type": "address"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "graduated",
		"outputs": [{
			"internalType": "bool",
			"name": "",
			"type": "bool"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "histCount",
		"outputs": [{
			"internalType": "uint8",
			"name": "",
			"type": "uint8"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "histPos",
		"outputs": [{
			"internalType": "uint8",
			"name": "",
			"type": "uint8"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "history",
		"outputs": [{
			"internalType": "uint256[]",
			"name": "caps",
			"type": "uint256[]"
		}, {
			"internalType": "uint64[]",
			"name": "times",
			"type": "uint64[]"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "token_",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "creator_",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "protocol_",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "metadata_",
				"type": "string"
			},
			{
				"internalType": "uint16",
				"name": "taxBps_",
				"type": "uint16"
			},
			{
				"internalType": "address[]",
				"name": "team_",
				"type": "address[]"
			},
			{
				"internalType": "address",
				"name": "quote_",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "feeRecipient_",
				"type": "address"
			}
		],
		"name": "initialize",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [{
			"internalType": "address",
			"name": "who",
			"type": "address"
		}],
		"name": "isTeam",
		"outputs": [{
			"internalType": "bool",
			"name": "",
			"type": "bool"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "launchedAt",
		"outputs": [{
			"internalType": "uint64",
			"name": "",
			"type": "uint64"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "marketCap",
		"outputs": [{
			"internalType": "uint256",
			"name": "",
			"type": "uint256"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "metadataUri",
		"outputs": [{
			"internalType": "string",
			"name": "",
			"type": "string"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "openPool",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "poolId",
		"outputs": [{
			"internalType": "bytes32",
			"name": "",
			"type": "bytes32"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "printCount",
		"outputs": [{
			"internalType": "uint8",
			"name": "",
			"type": "uint8"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "printPos",
		"outputs": [{
			"internalType": "uint8",
			"name": "",
			"type": "uint8"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "prints",
		"outputs": [{
			"components": [
				{
					"internalType": "uint64",
					"name": "time",
					"type": "uint64"
				},
				{
					"internalType": "uint128",
					"name": "ethAmount",
					"type": "uint128"
				},
				{
					"internalType": "uint128",
					"name": "tokenAmount",
					"type": "uint128"
				},
				{
					"internalType": "bool",
					"name": "isBuy",
					"type": "bool"
				},
				{
					"internalType": "address",
					"name": "trader",
					"type": "address"
				}
			],
			"internalType": "struct SkyCurve.Print[]",
			"name": "out",
			"type": "tuple[]"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "progressBps",
		"outputs": [{
			"internalType": "uint256",
			"name": "",
			"type": "uint256"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "protocol",
		"outputs": [{
			"internalType": "address",
			"name": "",
			"type": "address"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "quote",
		"outputs": [{
			"internalType": "address",
			"name": "",
			"type": "address"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [{
			"internalType": "address",
			"name": "buyer",
			"type": "address"
		}, {
			"internalType": "uint256",
			"name": "value",
			"type": "uint256"
		}],
		"name": "quoteBuy",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "tokensOut",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "fee",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "tax",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "snipe",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "ethNet",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [{
			"internalType": "uint256",
			"name": "tokensIn",
			"type": "uint256"
		}],
		"name": "quoteSell",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "ethOut",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "fee",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "tax",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "ethGross",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "realEth",
		"outputs": [{
			"internalType": "uint256",
			"name": "",
			"type": "uint256"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [{
			"internalType": "uint256",
			"name": "tokensIn",
			"type": "uint256"
		}, {
			"internalType": "uint256",
			"name": "minEth",
			"type": "uint256"
		}],
		"name": "sell",
		"outputs": [{
			"internalType": "uint256",
			"name": "ethOut",
			"type": "uint256"
		}],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [{
			"internalType": "address",
			"name": "next",
			"type": "address"
		}],
		"name": "setProtocol",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [{
			"internalType": "address",
			"name": "buyer",
			"type": "address"
		}],
		"name": "snipeTaxBps",
		"outputs": [{
			"internalType": "uint256",
			"name": "",
			"type": "uint256"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "spotPrice",
		"outputs": [{
			"internalType": "uint256",
			"name": "",
			"type": "uint256"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "stageDeposit",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [{
			"internalType": "uint256",
			"name": "",
			"type": "uint256"
		}],
		"name": "team",
		"outputs": [{
			"internalType": "address",
			"name": "",
			"type": "address"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "teamCount",
		"outputs": [{
			"internalType": "uint8",
			"name": "",
			"type": "uint8"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "token",
		"outputs": [{
			"internalType": "address",
			"name": "",
			"type": "address"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "viewState",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "virtualEth_",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "virtualToken_",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "realEth_",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "marketCap_",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "progressBps_",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "graduated_",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "spotPrice_",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "virtualEth",
		"outputs": [{
			"internalType": "uint256",
			"name": "",
			"type": "uint256"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "virtualToken",
		"outputs": [{
			"internalType": "uint256",
			"name": "",
			"type": "uint256"
		}],
		"stateMutability": "view",
		"type": "function"
	}
];
var hookBytecode = "0x60e03461010b57601f610f7338819003918201601f19168301916001600160401b0383118484101761010f57808492604094855283398101031261010b57610052602061004b83610123565b9201610123565b906001600160a01b0381161515806100f9575b156100ce5760805260a0523360c052604051610e3b9081610138823960805181818160cd01528181610377015281816104030152610747015260a05181818161030c01528181610a3d0152610ade015260c05181818161013b01528181610186015261098f0152f35b606460405162461bcd60e51b81526020600482015260046024820152637a65726f60e01b6044820152fd5b506001600160a01b0382161515610065565b5f80fd5b634e487b7160e01b5f52604160045260245ffd5b51906001600160a01b038216820361010b5756fe6080604052600436101561001a575b3615610018575f80fd5b005b5f3560e01c8063027a13c31461044057806321d0ee70146103a6578063481c6a7514610362578063684931ed1461033b5780639ec5a894146102f7578063ad09123014610287578063b47b2fb114610209578063b6a5d7de1461016a578063c45a0155146101265763dc98354e0361000e57346101225760e0366003190112610122576100a561060a565b60a03660231901126101225760c4356001600160a01b0381160361012257610110906100fb337f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316146106d5565b5f546001600160a01b0391821691161461064e565b604051636e4c1aa760e11b8152602090f35b5f80fd5b34610122575f366003190112610122576040517f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03168152602090f35b346101225760203660031901126101225761018361060a565b337f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031614806101f7575b806101e5575b6101c49061064e565b5f80546001600160a01b0319166001600160a01b0392909216919091179055005b506001600160a01b03811615156101bb565b505f546001600160a01b0316156101b5565b34610122576101603660031901126101225761022361060a565b5060a03660231901126101225760603660c3190112610122576101443567ffffffffffffffff81116101225761025d903690600401610620565b5050604061026d61012435610744565b82516001600160e01b03199092168252600f0b6020820152f35b34610122576020366003190112610122576004355f52600160205260a060405f2060ff600180841b03825416916002600180861b03600183015416910154906040519384526020840152600180851b038116604084015261ffff81851c16606084015260b01c1615156080820152f35b34610122575f366003190112610122576040517f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03168152602090f35b34610122575f366003190112610122575f546040516001600160a01b039091168152602090f35b34610122575f366003190112610122576040517f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03168152602090f35b3461012257610160366003190112610122576103c061060a565b5060a03660231901126101225760803660c3190112610122576101443567ffffffffffffffff8111610122576103fa903690600401610620565b506104319050337f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316146106d5565b6303cb96db60e21b5f5260045ffd5b346101225760803660031901126101225761045961060a565b6024356001600160a01b038116808203610122576044356001600160a01b0381169190829003610122576064359261ffff8416809403610122576104a760018060a01b035f5416331461064e565b6001600160a01b038516948286101561060557905b604080516001600160a01b03938416602082019081529390921690820152610bb86060820152603c60808201523060a080830191909152815261050060c0826106b3565b51902092835f52600160205260ff600260405f20015460b01c166105d35760026020956040519061053082610683565b81528681019384526040808201958652606082019384526001608083018181525f898152828b52839020935184546001600160a01b03199081166001600160a01b0392831617865597519285018054909816928116929092179096559551929091018054935194516001600160b81b0319909416929095169190911760a09390931b61ffff60a01b169290921790151560b01b60ff60b01b161790915551908152f35b60405162461bcd60e51b815260206004820152600a6024820152691c9959da5cdd195c995960b21b6044820152606490fd5b6104bc565b600435906001600160a01b038216820361012257565b9181601f840112156101225782359167ffffffffffffffff8311610122576020838186019501011161012257565b1561065557565b60405162461bcd60e51b815260206004820152600660248201526539b2b2b232b960d11b6044820152606490fd5b60a0810190811067ffffffffffffffff82111761069f57604052565b634e487b7160e01b5f52604160045260245ffd5b90601f8019910116810190811067ffffffffffffffff82111761069f57604052565b156106dc57565b60405162461bcd60e51b815260206004820152600760248201526636b0b730b3b2b960c91b6044820152606490fd5b9190820180921161071857565b634e487b7160e01b5f52601160045260245ffd5b90816020910312610122575180151581036101225790565b907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031661077a3382146106d5565b6024356001600160a01b03811691828203610122576044356001600160a01b03811693848203610122575f9460643562ffffff8116809103610122576084358060020b8091036101225760a4356001600160a01b03811692908381036101225750604051936020850195865260408501526060840152608083015260a082015260a0815261080960c0826106b3565b5190205f52600160205260405f2060026040519161082683610683565b60018060a01b03815416835260018060a01b036001820154166020840152015493604082019260018060a01b038616845260ff606084019661ffff8160a01c16885260b01c161580156080850152610ccd5760c435801515809103610122575f60e4351214988915610cc257600f0b5b80600f0b5f8112610ca0575b5080600f0b15610c89576001600160801b0316606481028115908281046064148217156107185761271061ffff9104985116808302928304141715610718576127109004916108f1838861070b565b998a15610c715715610c695750935b803b1561012257604051630b0d9c0960e01b81526001600160a01b0386166004820152306024820152604481018a9052905f908290606490829084905af18015610c5e57610c49575b50610bb88502858104610bb81486151715610c3557612710900494858103908111610c3557906109789161070b565b604051634673a21360e11b815290946020826004817f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03165afa8015610c2a578790610be0575b6109d1925085610d15565b81516001600160a01b031615610a0f5750516109f793506001600160a01b031690610d15565b63b47b2fb160e01b916001600160801b0316600f0b90565b91905082610a21575b505050506109f7565b6001600160a01b03811680610acf575050516001600160a01b037f000000000000000000000000000000000000000000000000000000000000000081169116813b15610acb579060648492604051948593849263586125fb60e11b845260048401528560248401528160448401525af18015610ac057610aa8575b50505b5f808080610a18565b610ab38280926106b3565b610abd5780610a9c565b80fd5b6040513d84823e3d90fd5b8380fd5b60405163095ea7b360e01b81527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03811660048301526024820186905291602090829060449082908a905af18015610bd557610ba8575b5091516001600160a01b039283169216823b15610ba45760405163586125fb60e11b81526001600160a01b03918216600482015291166024820152604481019290925282908290606490829084905af18015610ac057610b8f575b5050610a9f565b610b9a8280926106b3565b610abd5780610b88565b8480fd5b610bc99060203d602011610bce575b610bc181836106b3565b81019061072c565b610b2d565b503d610bb7565b6040513d88823e3d90fd5b50906020813d602011610c22575b81610bfb602093836106b3565b81010312610c1e57516001600160a01b0381168103610c1e57906109d1916109c6565b8680fd5b3d9150610bee565b6040513d89823e3d90fd5b634e487b7160e01b87526011600452602487fd5b610c569196505f906106b3565b5f945f610949565b6040513d5f823e3d90fd5b905093610900565b5063b47b2fb160e01b99505f98975050505050505050565b5063b47b2fb160e01b98505f979650505050505050565b90506f7fffffffffffffffffffffffffffffff198114610718575f035f6108a2565b60801d600f0b610896565b5063b47b2fb160e01b97505f9695505050505050565b15610cea57565b60405162461bcd60e51b815260206004820152600360248201526270617960e81b6044820152606490fd5b82158015610df4575b610def576001600160a01b031680610d8457505f80809381935af13d15610d7b573d9067ffffffffffffffff821161069f57604051610d7992610d6b601f8201601f1916602001836106b3565b81525f60203d92013e610ce3565b565b610d7990610ce3565b60405163a9059cbb60e01b81526001600160a01b03929092166004830152602482019290925290602090829060449082905f905af18015610c5e57610d79915f91610dd0575b50610ce3565b610de9915060203d602011610bce57610bc181836106b3565b5f610dca565b505050565b506001600160a01b03821615610d1e56fea2646970667358221220765872aa722082c6b9fb2f68b006c33111ea39b92db1b8acab49cd62c1da414964736f6c63430008250033";
var poolAbi = [
	{
		"inputs": [{
			"internalType": "address",
			"name": "manager_",
			"type": "address"
		}, {
			"internalType": "address",
			"name": "hook_",
			"type": "address"
		}],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [{
			"indexed": true,
			"internalType": "address",
			"name": "curve",
			"type": "address"
		}, {
			"indexed": true,
			"internalType": "bytes32",
			"name": "poolId",
			"type": "bytes32"
		}],
		"name": "Seeded",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "token",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "quote",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "creator",
				"type": "address"
			},
			{
				"internalType": "uint16",
				"name": "taxBps",
				"type": "uint16"
			},
			{
				"internalType": "uint256",
				"name": "tokenAmt",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "quoteAmt",
				"type": "uint256"
			}
		],
		"name": "deposit",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "factory",
		"outputs": [{
			"internalType": "address",
			"name": "",
			"type": "address"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [{
			"internalType": "address",
			"name": "",
			"type": "address"
		}],
		"name": "held",
		"outputs": [
			{
				"internalType": "address",
				"name": "token",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "quote",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "creator",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenAmt",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "quoteAmt",
				"type": "uint256"
			},
			{
				"internalType": "uint16",
				"name": "taxBps",
				"type": "uint16"
			},
			{
				"internalType": "bool",
				"name": "ready",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "hook",
		"outputs": [{
			"internalType": "address",
			"name": "",
			"type": "address"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [{
			"internalType": "address",
			"name": "token",
			"type": "address"
		}, {
			"internalType": "address",
			"name": "quote",
			"type": "address"
		}],
		"name": "key",
		"outputs": [
			{
				"internalType": "address",
				"name": "currency0",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "currency1",
				"type": "address"
			},
			{
				"internalType": "uint24",
				"name": "fee",
				"type": "uint24"
			},
			{
				"internalType": "int24",
				"name": "tickSpacing",
				"type": "int24"
			},
			{
				"internalType": "address",
				"name": "hooks",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "manager",
		"outputs": [{
			"internalType": "address",
			"name": "",
			"type": "address"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [{
			"internalType": "address",
			"name": "token",
			"type": "address"
		}, {
			"internalType": "address",
			"name": "quote",
			"type": "address"
		}],
		"name": "poolId",
		"outputs": [{
			"internalType": "bytes32",
			"name": "",
			"type": "bytes32"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [{
			"internalType": "address",
			"name": "curve",
			"type": "address"
		}],
		"name": "seedHeld",
		"outputs": [{
			"internalType": "bytes32",
			"name": "id",
			"type": "bytes32"
		}],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "token",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "quote",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "buyingToken",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "amountIn",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "minOut",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			}
		],
		"name": "trade",
		"outputs": [{
			"internalType": "uint256",
			"name": "amountOut",
			"type": "uint256"
		}],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [{
			"internalType": "bytes",
			"name": "data",
			"type": "bytes"
		}],
		"name": "unlockCallback",
		"outputs": [{
			"internalType": "bytes",
			"name": "",
			"type": "bytes"
		}],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
];
var rewardsAbi = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "token",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Claimed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "token",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "supply",
				"type": "uint256"
			}
		],
		"name": "Funded",
		"type": "event"
	},
	{
		"inputs": [{
			"internalType": "address",
			"name": "token",
			"type": "address"
		}],
		"name": "acc",
		"outputs": [{
			"internalType": "uint256",
			"name": "",
			"type": "uint256"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "afterTransfer",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [{
			"internalType": "address",
			"name": "token",
			"type": "address"
		}],
		"name": "claim",
		"outputs": [{
			"internalType": "uint256",
			"name": "pay",
			"type": "uint256"
		}],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "factory",
		"outputs": [{
			"internalType": "address",
			"name": "",
			"type": "address"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "hook",
		"outputs": [{
			"internalType": "address",
			"name": "",
			"type": "address"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "token",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "quote",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "onFee",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [{
			"internalType": "address",
			"name": "token",
			"type": "address"
		}, {
			"internalType": "address",
			"name": "user",
			"type": "address"
		}],
		"name": "owed",
		"outputs": [{
			"internalType": "uint256",
			"name": "",
			"type": "uint256"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [{
			"internalType": "address",
			"name": "token",
			"type": "address"
		}, {
			"internalType": "address",
			"name": "user",
			"type": "address"
		}],
		"name": "pending",
		"outputs": [{
			"internalType": "uint256",
			"name": "",
			"type": "uint256"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [{
			"internalType": "address",
			"name": "token",
			"type": "address"
		}],
		"name": "quoteOf",
		"outputs": [{
			"internalType": "address",
			"name": "",
			"type": "address"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [{
			"internalType": "address",
			"name": "token",
			"type": "address"
		}, {
			"internalType": "address",
			"name": "user",
			"type": "address"
		}],
		"name": "rewardDebt",
		"outputs": [{
			"internalType": "uint256",
			"name": "",
			"type": "uint256"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [{
			"internalType": "address",
			"name": "hook_",
			"type": "address"
		}],
		"name": "setHook",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];
var factoryAbi = [
	{
		"inputs": [{
			"internalType": "address",
			"name": "protocol_",
			"type": "address"
		}, {
			"internalType": "bytes32",
			"name": "hookSalt",
			"type": "bytes32"
		}],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "token",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "curve",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "creator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "symbol",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "metadataUri",
				"type": "string"
			}
		],
		"name": "Launched",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [{
			"indexed": true,
			"internalType": "address",
			"name": "next",
			"type": "address"
		}],
		"name": "ProtocolUpdated",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "curveImplementation",
		"outputs": [{
			"internalType": "address",
			"name": "",
			"type": "address"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "hook",
		"outputs": [{
			"internalType": "address",
			"name": "",
			"type": "address"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [{
			"components": [
				{
					"internalType": "string",
					"name": "name",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "symbol",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "logo",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "description",
					"type": "string"
				},
				{
					"components": [
						{
							"internalType": "string",
							"name": "twitter",
							"type": "string"
						},
						{
							"internalType": "string",
							"name": "telegram",
							"type": "string"
						},
						{
							"internalType": "string",
							"name": "discord",
							"type": "string"
						},
						{
							"internalType": "string",
							"name": "website",
							"type": "string"
						},
						{
							"internalType": "string",
							"name": "farcaster",
							"type": "string"
						}
					],
					"internalType": "struct SkyFactory.Socials",
					"name": "socials",
					"type": "tuple"
				},
				{
					"internalType": "address",
					"name": "quote",
					"type": "address"
				},
				{
					"internalType": "uint256",
					"name": "buyAmount",
					"type": "uint256"
				},
				{
					"internalType": "uint16",
					"name": "taxBps",
					"type": "uint16"
				},
				{
					"internalType": "address",
					"name": "feeWallet",
					"type": "address"
				},
				{
					"internalType": "address[]",
					"name": "team",
					"type": "address[]"
				},
				{
					"internalType": "uint256",
					"name": "minTokens",
					"type": "uint256"
				}
			],
			"internalType": "struct SkyFactory.LaunchArgs",
			"name": "a",
			"type": "tuple"
		}],
		"name": "launch",
		"outputs": [{
			"internalType": "address",
			"name": "tokenAddr",
			"type": "address"
		}, {
			"internalType": "address",
			"name": "curveAddr",
			"type": "address"
		}],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "launchCount",
		"outputs": [{
			"internalType": "uint256",
			"name": "",
			"type": "uint256"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "locker",
		"outputs": [{
			"internalType": "address",
			"name": "",
			"type": "address"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [{
			"internalType": "uint256",
			"name": "limit",
			"type": "uint256"
		}],
		"name": "newest",
		"outputs": [{
			"components": [
				{
					"internalType": "address",
					"name": "token",
					"type": "address"
				},
				{
					"internalType": "address",
					"name": "curve",
					"type": "address"
				},
				{
					"internalType": "address",
					"name": "creator",
					"type": "address"
				},
				{
					"internalType": "string",
					"name": "name",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "symbol",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "metadataUri",
					"type": "string"
				},
				{
					"internalType": "uint64",
					"name": "launchedAt",
					"type": "uint64"
				},
				{
					"internalType": "uint256",
					"name": "virtualEth",
					"type": "uint256"
				},
				{
					"internalType": "uint256",
					"name": "virtualToken",
					"type": "uint256"
				},
				{
					"internalType": "uint256",
					"name": "realEth",
					"type": "uint256"
				},
				{
					"internalType": "uint256",
					"name": "marketCap",
					"type": "uint256"
				},
				{
					"internalType": "uint256",
					"name": "progressBps",
					"type": "uint256"
				},
				{
					"internalType": "bool",
					"name": "graduated",
					"type": "bool"
				},
				{
					"internalType": "uint256",
					"name": "spotPrice",
					"type": "uint256"
				}
			],
			"internalType": "struct SkyFactory.CurveView[]",
			"name": "out",
			"type": "tuple[]"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "parameters",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "launchFee",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "graduationEth",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "virtualEth",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalSupply",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "feeBps",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "creatorShareBps",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "minTradeEth",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "maxCreatorTaxBps",
				"type": "uint256"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "pool",
		"outputs": [{
			"internalType": "address",
			"name": "",
			"type": "address"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "protocol",
		"outputs": [{
			"internalType": "address",
			"name": "",
			"type": "address"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [{
			"internalType": "uint256",
			"name": "value",
			"type": "uint256"
		}, {
			"internalType": "uint16",
			"name": "taxBps",
			"type": "uint16"
		}],
		"name": "quoteInitialBuy",
		"outputs": [{
			"internalType": "uint256",
			"name": "tokensOut",
			"type": "uint256"
		}],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "rewards",
		"outputs": [{
			"internalType": "address",
			"name": "",
			"type": "address"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [{
			"internalType": "address",
			"name": "next",
			"type": "address"
		}],
		"name": "setProtocol",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "tokenImplementation",
		"outputs": [{
			"internalType": "address",
			"name": "",
			"type": "address"
		}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "version",
		"outputs": [{
			"internalType": "string",
			"name": "",
			"type": "string"
		}],
		"stateMutability": "pure",
		"type": "function"
	}
];
var factoryBytecode = "0x610140806040523461032a575f9060408161b09b8038038091610022828561039d565b83398101031261032a5780516001600160a01b038116919082900361032a576020015190801561036d575f80546001600160a01b0319169190911790556040516120728082016001600160401b0381118382101761032e578291612052833903905ff0801561031f576001600160a01b0316608052604051612eab8082016001600160401b0381118382101761032e5782916140c4833903905ff0801561031f576001600160a01b031660a05260405160c58082016001600160401b0381118382101761032e578291616f6f833903905ff0801561031f576001600160a01b0316610120526040516114798082016001600160401b0381118382101761032e578291617034833903905ff0801561031f576001600160a01b031661010081905260405190610f738083016001600160401b0381118482101761032e5760409284926184ad8439738366a39cc670b4001a1121b8f6a443a643e40951825260208201520301905ff5801561031f576001600160a01b03811660c052613fff1661224319016103425760c051604051906001600160a01b0316611c7b8083016001600160401b0381118482101761032e5760409284926194208439738366a39cc670b4001a1121b8f6a443a643e40951825260208201520301905ff0801561031f576001600160a01b0390811660e081905260c05190911690813b1561032a575f91602483926040519485938492635b52ebef60e11b845260048401525af1801561031f5761030c575b506101005160c05182916001600160a01b039182169116803b1561030857602483926040519485938492633dfd387360e01b845260048401525af180156102fd576102e5575b604051611c9190816103c182396080518181816103040152610fed015260a0518181816104f50152611168015260c051816104b1015260e051816101eb015261010051816107e60152610120518161082a0152f35b6102f082809261039d565b6102fa5780610290565b80fd5b6040513d84823e3d90fd5b5050fd5b61031891505f9061039d565b5f5f61024a565b6040513d5f823e3d90fd5b5f80fd5b634e487b7160e01b5f52604160045260245ffd5b606460405162461bcd60e51b8152602060048201526004602482015263686f6f6b60e01b6044820152fd5b60405162461bcd60e51b81526020600482015260086024820152671c1c9bdd1bd8dbdb60c21b6044820152606490fd5b601f909101601f19168101906001600160401b0382119082101761032e5760405256fe60806040526004361015610011575f80fd5b5f3560e01c80630a9d793d146100f457806316f0115b146100ef5780631f82194f146100ea57806327cca59f146100e55780632f3a3d5d146100e05780633d4e2994146100db57806354fd4d50146100d65780637f5a7c7b146100d157806383bc0bf1146100cc57806389035730146100c75780638ce74426146100c25780639ccfbccf146100bd5780639ec5a894146100b85763d7b96d4e146100b3575f80fd5b610815565b6107d1565b6106fd565b610597565b610524565b6104e0565b61049c565b61044c565b61033f565b6102ef565b6102d2565b61021a565b6101d6565b61010e565b6001600160a01b0381160361010a57565b5f80fd5b3461010a57602036600319011261010a5760043561012b816100f9565b5f546001600160a01b0316330361019c576001600160a01b0381169061017690610156831515610859565b60018060a01b03166bffffffffffffffffffffffff60a01b5f5416175f55565b7f90ed2f900bebee953d2681b0d058f80fd7ddec64c41a29669b22dbe3618687965f80a2005b60405162461bcd60e51b81526020600482015260086024820152671c1c9bdd1bd8dbdb60c21b6044820152606490fd5b5f91031261010a57565b3461010a575f36600319011261010a576040517f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03168152602090f35b602036600319011261010a576004356001600160401b03811161010a57610160600319823603011261010a575f549060ff8260a01c166102a05760ff60a01b19909116600160a01b175f5561027190600401610f7c565b5f805460ff60a01b19169055604080516001600160a01b039384168152929091166020830152819081015b0390f35b60405162461bcd60e51b815260206004820152600a6024820152697265656e7472616e637960b01b6044820152606490fd5b3461010a575f36600319011261010a576020600154604051908152f35b3461010a575f36600319011261010a576040517f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03168152602090f35b61ffff81160361010a57565b3461010a57604036600319011261010a5760043561271061038f61ffff60243561036881610333565b61037a6509184e72a00086101561093b565b1661038961012c821115610898565b8361153b565b04606482029180830460641481151715610423576103d36103ce6103ec926103c9610408956103c361029c98612710900490565b9261159e565b61159e565b6115ab565b72434327d0ca15db54731cf010b3f0000000000061154e565b6104036b033b2e3c9fd0803ce800000082106115c7565b61156c565b6104138115156115fd565b6040519081529081906020820190565b611527565b805180835260209291819084018484015e5f828201840152601f01601f1916010190565b3461010a575f36600319011261010a5761029c60405161046d604082610a0c565b600e81526d736b796c61756e63687061642d3760901b6020820152604051918291602083526020830190610428565b3461010a575f36600319011261010a576040517f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03168152602090f35b3461010a575f36600319011261010a576040517f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03168152602090f35b3461010a575f36600319011261010a576101006040516601c6bf526340008152673a4965bf58a4000060208201526714d1120d7b16000060408201526b033b2e3c9fd0803ce8000000606082015260646080820152611b5860a08201526509184e72a00060c082015261012c60e0820152f35b3461010a575f36600319011261010a575f546040516001600160a01b039091168152602090f35b602081016020825282518091526040820191602060408360051b8301019401925f915b8383106105f057505050505090565b9091929394602080600192603f1985820301865288519061061981835160018060a01b03169052565b818301516001600160a01b0316818401526040828101516001600160a01b0316908201526101a08061068661067461066260608701516101c060608801526101c0870190610428565b60808701518682036080880152610428565b60a086015185820360a0870152610428565b60c0808601516001600160401b0316908501529360e081015160e08501526101008101516101008501526101208101516101208501526101408101516101408501526101608101516101608501526106e961018082015161018086019015159052565b0151910152970193019301919392906105e1565b3461010a57602036600319011261010a57600154600435602881116107c9575b8181116107c2575b61072e8161162f565b9161073c6040519384610a0c565b818352601f1961074b8361162f565b015f5b8181106107ab5750505f5b82811061076e576040518061029c86826105be565b8061078f6107896107846001946103c987611590565b610c5e565b50611ad1565b61079982876116ae565b526107a481866116ae565b5001610759565b6020906107b6611646565b8282880101520161074e565b5080610725565b50602861071d565b3461010a575f36600319011261010a576040517f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03168152602090f35b3461010a575f36600319011261010a576040517f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03168152602090f35b1561086057565b606460405162461bcd60e51b81526020600482015260046024820152637a65726f60e01b6044820152fd5b3561089581610333565b90565b1561089f57565b60405162461bcd60e51b81526020600482015260036024820152620e8c2f60eb1b6044820152606490fd5b903590601e198136030182121561010a57018035906001600160401b03821161010a57602001918160051b3603831361010a57565b1561090657565b606460405162461bcd60e51b81526020600482015260046024820152637465616d60e01b6044820152fd5b35610895816100f9565b1561094257565b60405162461bcd60e51b815260206004820152600360248201526236b4b760e91b6044820152606490fd5b1561097457565b60405162461bcd60e51b81526020600482015260096024820152686d696e546f6b656e7360b81b6044820152606490fd5b903590601e198136030182121561010a57018035906001600160401b03821161010a5760200191813603831361010a57565b634e487b7160e01b5f52604160045260245ffd5b6101c081019081106001600160401b03821117610a0757604052565b6109d7565b90601f801991011681019081106001600160401b03821117610a0757604052565b908060209392818452848401375f828201840152601f01601f1916010190565b93610a6a60409492610a7894989798606088526060880191610a2d565b918583036020870152610a2d565b6001600160a01b03909416910152565b6040513d5f823e3d90fd5b903590609e198136030182121561010a570190565b809d9b99966108959f9d999396610aea610b149a96610b0698610b229f9a610af897610adc9160e0895260e0890191610a2d565b918683036020880152610a2d565b926040818503910152610a2d565b8c810360608e015291610a2d565b9189830360808b0152610a2d565b9186830360a0880152610a2d565b9260c0818503910152610a2d565b6001600160a01b0391821681529181166020808401919091529216604082015261010060608201819052979998979096949193919261ffff92610b7592890191610a2d565b9116608086015284810360a08601528281520191905f5b818110610bc0575050506001600160a01b0390941660c0820152610bbe919060e0906001600160a01b03909216910152565b565b9091926020806001928635610bd4816100f9565b848060a01b031681520194019101919091610b8c565b60405190610bbe60e083610a0c565b6001600160401b038111610a0757601f01601f191660200190565b929192610c2082610bf9565b91610c2e6040519384610a0c565b82948184528183011161010a578281602093845f960137010152565b634e487b7160e01b5f52603260045260245ffd5b600154811015610c7a5760015f52600760205f20910201905f90565b610c4a565b8054821015610c7a575f52600760205f20910201905f90565b90600182811c92168015610cc6575b6020831014610cb257565b634e487b7160e01b5f52602260045260245ffd5b91607f1691610ca7565b919091601f8311610ce1575b505050565b818311610ced57505050565b5f5260205f206020601f830160051c9210610d26575b81601f9101920160051c03905f5b82811015610cdc575f82820155600101610d11565b5f9150610d03565b91909182516001600160401b038111610a0757610d5581610d4f8454610c98565b84610cd0565b6020601f8211600114610d94578190610d859394955f92610d89575b50508160011b915f199060031b1c19161790565b9055565b015190505f80610d71565b601f19821690610da7845f5260205f2090565b915f5b818110610de157509583600195969710610dc9575b505050811b019055565b01515f1960f88460031b161c191690555f8080610dbf565b9192602060018192868b015181550194019201610daa565b60015468010000000000000000811015610a0757806001610e1f92016001556001610c7f565b610ed757815181546001600160a01b03199081166001600160a01b03928316178355602084015160018401805483169184169190911790556040840151600284018054919093169116179055610bbe91600690610eba9060c090610e8a606082015160038701610d2e565b610e9b608082015160048701610d2e565b610eac60a082015160058701610d2e565b01516001600160401b031690565b9101906001600160401b03166001600160401b0319825416179055565b634e487b7160e01b5f525f60045260245ffd5b9081602091031261010a575190565b3d15610f23573d90610f0a82610bf9565b91610f186040519384610a0c565b82523d5f602084013e565b606090565b15610f2f57565b60405162461bcd60e51b81526020600482015260076024820152666665652070617960c81b6044820152606490fd5b94929093610adc6108959795610aea94606089526060890191610a2d565b90610f9a61012c61ffff610f9260e0860161088b565b161115610898565b610120820190610fb86008610faf84866108ca565b905011156108ff565b610fc460a08401610931565b610fd360c085013580926116f4565b928361151057610fe86101408601351561096d565b6110117f0000000000000000000000000000000000000000000000000000000000000000611771565b9461101c81806109a5565b60208301929161102c84846109a5565b926001600160a01b038b163b1561010a5761105f5f9360405195869485946303bf912560e11b8652309360048701610a4d565b0381836001600160a01b038d165af18015611463576114fc575b5061108760408201826109a5565b61109460608401846109a5565b8a60808695939501866110b06110aa8383610a93565b806109a5565b906110c86110be8585610a93565b60208101906109a5565b906110e06110d68787610a93565b60408101906109a5565b9490936111126111086111006110f68b8b610a93565b60608101906109a5565b9a9099610a93565b60808101906109a5565b9a90996001600160a01b03163b1561010a576040519d8e9d8e63d9f1463160e01b81526004019d6111429e610aa8565b6001600160a01b038a1691839103815a5f948591f18015611463576114e8575b5061118c7f0000000000000000000000000000000000000000000000000000000000000000611771565b5f5490966001600160a01b03808916959192166111ac60608501856109a5565b9190926111c56111be60e0880161088b565b91876108ca565b6111d460a08996939601610931565b6111e16101008a01610931565b918b3b1561010a578f94965f9761120f956040519a8b998a996309a8164d60e21b8b52339060048c01610b30565b038183895af18015611463576114d4575b506001600160a01b0388163b1561010a5760405163b0dbfa8b60e01b81526001600160a01b0388166004820152945f8680602481010381836001600160a01b038e165af19586156114635789966114ba575b50611317866112fe8a6112d96112f2886112ac6112e68c61129f61129685806109a5565b919092866109a5565b94909560608101906109a5565b9790986112c96112ba610bea565b6001600160a01b03909d168d52565b6001600160a01b031660208c0152565b3360408b01523691610c14565b60608801523691610c14565b60808501523691610c14565b60a0820152426001600160401b031660c0820152610df9565b6001600160a01b0361132b60a08501610931565b166114685750806113d0575b507fd9f66ed4b10e1813b91ce2e8fce88ef9e3263a3d1fdc3c2ef92346ccd2bd69f8905b61138a5f8080806601c6bf5263400061137a825460018060a01b031690565b5af1611384610ef9565b50610f28565b6113a66113cb6113b361139d84806109a5565b939096856109a5565b91909460608101906109a5565b91604051958695339b60018060a01b03169987610f5e565b0390a4565b60405163cce7ec1360e01b81523360048201526101408301356024820152945060209085906044908290875af19081156114635787947fd9f66ed4b10e1813b91ce2e8fce88ef9e3263a3d1fdc3c2ef92346ccd2bd69f892611434575b5090611337565b6114559060203d60201161145c575b61144d8183610a0c565b810190610eea565b505f61142d565b503d611443565b610a88565b7fd9f66ed4b10e1813b91ce2e8fce88ef9e3263a3d1fdc3c2ef92346ccd2bd69f89291611496575b5061135b565b6114b4906114a660a08401610931565b908961014085013592611848565b5f611490565b806114c85f6114ce93610a0c565b806101cc565b5f611272565b806114c85f6114e293610a0c565b5f611220565b806114c85f6114f693610a0c565b5f611162565b806114c85f61150a93610a0c565b5f611079565b6115226509184e72a00085101561093b565b610fe8565b634e487b7160e01b5f52601160045260245ffd5b8181029291811591840414171561042357565b8115611558570490565b634e487b7160e01b5f52601260045260245ffd5b6b033b2e3c9fd0803ce800000003906b033b2e3c9fd0803ce8000000821161042357565b5f1981019190821161042357565b9190820391821161042357565b6714d1120d7b1600000190816714d1120d7b1600001161042357565b156115ce57565b60405162461bcd60e51b81526020600482015260076024820152667265736572766560c81b6044820152606490fd5b1561160457565b606460405162461bcd60e51b8152602060048201526004602482015263191d5cdd60e21b6044820152fd5b6001600160401b038111610a075760051b60200190565b60405190611653826109eb565b5f6101a08382815282602082015282604082015260608082015260606080820152606060a08201528260c08201528260e082015282610100820152826101208201528261014082015282610160820152826101808201520152565b8051821015610c7a5760209160051b010190565b156116c957565b60405162461bcd60e51b815260206004820152600360248201526266656560e81b6044820152606490fd5b6001600160a01b031615611714576108956601c6bf5263400034146116c2565b6117276601c6bf526340003410156116c2565b611740576601c6bf52633fff1934013481116104235790565b60405162461bcd60e51b8152602060048201526009602482015268189d5e505b5bdd5b9d60ba1b6044820152606490fd5b604051733d602d80600a3d3981f3363d3d373d3d3d363d7360601b815260609190911b60148201526e5af43d82803e903d91602b57fd5bf360881b60288201526037905ff0906001600160a01b038216156117c857565b60405162461bcd60e51b8152602060048201526005602482015264636c6f6e6560d81b6044820152606490fd5b5190811515820361010a57565b9081602091031261010a57610895906117f5565b1561181d57565b606460405162461bcd60e51b81526020600482015260046024820152631c1d5b1b60e21b6044820152fd5b6040516370a0823160e01b81526001600160a01b0383811660048301529094911692909190602085602481875afa948515611463575f956119d3575b506040516323b872dd60e01b81523360048201526001600160a01b0383166024820152604481019190915260208180606481015b03815f885af18015611463576118d5915f916119a4575b50611816565b6040516370a0823160e01b81526001600160a01b038216600482015292602090849060249082905afa928315611463576119529460209461191d925f91611987575b5061159e565b6040516369dd567f60e01b815233600482015260248101919091526044810192909252909283919082905f9082906064820190565b03926001600160a01b03165af180156114635761196c5750565b6119849060203d60201161145c5761144d8183610a0c565b50565b61199e9150863d881161145c5761144d8183610a0c565b5f611917565b6119c6915060203d6020116119cc575b6119be8183610a0c565b810190611802565b5f6118cf565b503d6119b4565b6118b89195506119f1602091823d841161145c5761144d8183610a0c565b959150611884565b908160e091031261010a5780519160208201519160408101519160608201519160808101519160c0611a2d60a084016117f5565b92015190565b9060405191825f825492611a4684610c98565b8084529360018116908115611aaf5750600114611a6b575b50610bbe92500383610a0c565b90505f9291925260205f20905f915b818310611a93575050906020610bbe928201015f611a5e565b6020919350806001915483858901015201910190918492611a7a565b905060209250610bbe94915060ff191682840152151560051b8201015f611a5e565b90611ada611646565b600183015460405163801f396160e01b815291936001600160a01b039091169160e081600481865afa918215611463575f5f5f905f925f948a5f975f99611bfc575b50600682611b79611bbd93611b62611bf49d9e611b52611b45611bcd995460018060a01b031690565b6001600160a01b03168452565b6001600160a01b03166020830152565b60028301546001600160a01b031660409190910152565b8d6060611b8860038401611a33565b9101528d6080611b9a60048401611a33565b9101528d60a0611bac60058401611a33565b91015201546001600160401b031690565b6001600160401b031660c08c0152565b60e08a01526101008901526101208801526101408701526101608601521515610180850152565b6101a0830152565b611bf49950611bbd985060069750611b629650611c3d919550611b799450611bcd92935060e03d60e011611c54575b611c358183610a0c565b8101906119f9565b9d509b509990985090969195509193925090611b1c565b503d611c2b56fea26469706673582212208a1b87009cf547e3d3f06a82ee3bd8d8e3930d5b088ce09dc547694aa455b19c64736f6c63430008250033608080604052346028576004805460ff60a01b1916600160a01b179055612045908161002d8239f35b5f80fdfe60806040526004361015610011575f80fd5b5f3560e01c806306fdde0314611ba4578063077f224a146116cb578063095ea7b31461165257806318160ddd1461163557806323b872dd14611558578063313ce5671461153d57806353cd512a1461111e57806370a08231146110e65780637165485d146110be5780637284e4161461101957806395d89b4114610f74578063a9059cbb14610f43578063b0dbfa8b14610e47578063c45a015514610e1f578063d9f146311461020a578063dd62ed3e146101ba5763fb7f21eb146100d4575f80fd5b346101b6575f3660031901126101b6576040515f6005546100f481611c46565b80845290600181169081156101925750600114610134575b6101308361011c81850382611c99565b604051918291602083526020830190611cba565b0390f35b60055f9081527f036b6384b5eca791c62761152d0c79bb0604c104a5fb6f4eb0703f3154bb3db0939250905b8082106101785750909150810160200161011c61010c565b919260018160209254838588010152019101909291610160565b60ff191660208086019190915291151560051b8401909101915061011c905061010c565b5f80fd5b346101b65760403660031901126101b6576101d3611d0b565b6101db611d21565b6001600160a01b039182165f908152600d60209081526040808320949093168252928352819020549051908152f35b346101b65760e03660031901126101b6576004356001600160401b0381116101b65761023a903690600401611cde565b6024356001600160401b0381116101b657610259903690600401611cde565b926044356001600160401b0381116101b657610279903690600401611cde565b6064939193356001600160401b0381116101b65761029b903690600401611cde565b6084356001600160401b0381116101b6576102ba903690600401611cde565b96909360a4356001600160401b0381116101b6576102dc903690600401611cde565b9a909660c4356001600160401b0381116101b6576102fe903690600401611cde565b9b909961031660018060a01b03600354163314611d37565b60045460ff8160a81c16610df45760a08311610dc957608c8511610d9e5760308611610d745760308811610d4a5760308d11610d205760308f11610cf55760308e11610ccb5760ff60a81b1916600160a81b176004556001600160401b03821161071657610385600554611c46565b601f8111610c5c575b505f90601f8311600114610bd9576103bd92915f9183610bce575b50508160011b915f199060031b1c19161790565b6005555b6001600160401b038211610716576103da600654611c46565b601f8111610b60575b505f90601f8311600114610ac357946104416104599561043a9c9b999561042c8661044a976104689c976104779f9c5f92610ab85750508160011b915f199060031b1c19161790565b6006555b6040519d8e611c7e565b3691611d6d565b8b523691611d6d565b96602089019788523691611d6d565b97604087019889523691611d6d565b94606085019586523691611d6d565b9160808101928352518051906001600160401b0382116107165761049c600754611c46565b601f8111610a4a575b50602090601f83116001146109c7576104d492915f91836109bc5750508160011b915f199060031b1c19161790565b6007555b519283516001600160401b038111610716576104f5600854611c46565b601f811161094e575b50602094601f82116001146108eb576105309293949582915f926108e05750508160011b915f199060031b1c19161790565b6008555b519182516001600160401b03811161071657610551600954611c46565b601f8111610872575b506020601f821160011461080f57819061058a9394955f926108045750508160011b915f199060031b1c19161790565b6009555b519081516001600160401b038111610716576105ab600a54611c46565b601f8111610796575b50602092601f8211600114610735576105e4929382915f9261072a5750508160011b915f199060031b1c19161790565b600a555b5180516001600160401b03811161071657610604600b54611c46565b601f81116106a8575b50602091601f821160011461064b5761063b925f91836106405750508160011b915f199060031b1c19161790565b600b55005b0151905083806103a9565b601f19821692600b5f52805f20915f5b85811061069057508360019510610678575b505050811b01600b55005b01515f1960f88460031b161c1916905582808061066d565b9192602060018192868501518155019401920161065b565b8181111561060d57600b5f52601f820160051c7f0175b7a638427703f0dbe7bb9bbf987a2551717b34e79f33b5b1008d1fa01db96020841061070e575b81601f9101920160051c03905f5b82811061070157505061060d565b5f828201556001016106f3565b5f91506106e5565b634e487b7160e01b5f52604160045260245ffd5b0151905084806103a9565b601f19821693600a5f52805f20915f5b86811061077e5750836001959610610766575b505050811b01600a556105e8565b01515f1960f88460031b161c19169055838080610758565b91926020600181928685015181550194019201610745565b818111156105b457600a5f52601f820160051c7fc65a7bb8d6351c1cf70c95a316cc6a92839c986682d98bc35f958f4883f9d2a8602084106107fc575b81601f9101920160051c03905f5b8281106107ef5750506105b4565b5f828201556001016107e1565b5f91506107d3565b0151905085806103a9565b601f1982169060095f52805f20915f5b81811061085a57509583600195969710610842575b505050811b0160095561058e565b01515f1960f88460031b161c19169055848080610834565b9192602060018192868b01518155019401920161081f565b8181111561055a5760095f52601f820160051c7f6e1540171b6c0c960b71a7020d9f60077f6af931a8bbf590da0223dacf75c7af602084106108d8575b81601f9101920160051c03905f5b8281106108cb57505061055a565b5f828201556001016108bd565b5f91506108af565b0151905086806103a9565b601f1982169560085f52805f20915f5b8881106109365750836001959697981061091e575b505050811b01600855610534565b01515f1960f88460031b161c19169055858080610910565b919260206001819286850151815501940192016108fb565b818111156104fe5760085f52601f820160051c7ff3f7a9fe364faab93b216da50a3214154f22a0a2b415b23a84c8169e8b636ee3602084106109b4575b81601f9101920160051c03905f5b8281106109a75750506104fe565b5f82820155600101610999565b5f915061098b565b0151905087806103a9565b90601f1983169160075f527fa66cc928b5edb82af9bd49922954155ab7b0942694bea4ce44661d9a8736c688925f5b818110610a325750908460019594939210610a1a575b505050811b016007556104d8565b01515f1960f88460031b161c19169055868080610a0c565b929360206001819287860151815501950193016109f6565b828111156104a55760075f52601f830160051c7fa66cc928b5edb82af9bd49922954155ab7b0942694bea4ce44661d9a8736c68860208510610ab0575b81601f9101920160051c03905f5b828110610aa35750506104a5565b5f82820155600101610a95565b5f9150610a87565b013590505f806103a9565b601f1983169160065f527ff652222313e28459528d920b65115c16c04f3efc82aaedc97be59f3f377c0d3f925f5b818110610b4857509561043a9c9b99956001866104689b966104779e9b966104419661044a9a6104599d10610b2f575b505050811b01600655610430565b01355f19600384901b60f8161c191690555f8080610b21565b91936020600181928787013581550195019201610af1565b828111156103e35760065f52601f830160051c7ff652222313e28459528d920b65115c16c04f3efc82aaedc97be59f3f377c0d3f60208510610bc6575b81601f9101920160051c03905f5b828110610bb95750506103e3565b5f82820155600101610bab565b5f9150610b9d565b013590508f806103a9565b601f1983169160055f527f036b6384b5eca791c62761152d0c79bb0604c104a5fb6f4eb0703f3154bb3db0925f5b818110610c445750908460019594939210610c2b575b505050811b016005556103c1565b01355f19600384901b60f8161c191690558e8080610c1d565b91936020600181928787013581550195019201610c07565b8281111561038e5760055f819052601f8401901c7f036b6384b5eca791c62761152d0c79bb0604c104a5fb6f4eb0703f3154bb3db060208510610cc3575b81601f9101920160051c03905f5b828110610cb657505061038e565b5f82820155600101610ca8565b5f9150610c9a565b60405162461bcd60e51b8152602060048201526002602482015261666360f01b6044820152606490fd5b60405162461bcd60e51b81526020600482015260036024820152623bb2b160e91b6044820152606490fd5b60405162461bcd60e51b8152602060048201526002602482015261646360f01b6044820152606490fd5b60405162461bcd60e51b8152602060048201526002602482015261746760f01b6044820152606490fd5b60405162461bcd60e51b8152602060048201526002602482015261747760f01b6044820152606490fd5b606460405162461bcd60e51b81526020600482015260046024820152636465736360e01b6044820152fd5b606460405162461bcd60e51b81526020600482015260046024820152636c6f676f60e01b6044820152fd5b606460405162461bcd60e51b81526020600482015260046024820152636d65746160e01b6044820152fd5b346101b6575f3660031901126101b6576003546040516001600160a01b039091168152602090f35b346101b65760203660031901126101b657610e60611d0b565b610e7560018060a01b03600354163314611d37565b600454906001600160a01b038216610f16576001600160a01b0316908190610e9e821515611e3e565b6bffffffffffffffffffffffff60a01b16176004556b033b2e3c9fd0803ce8000000600255805f52600c6020526b033b2e3c9fd0803ce800000060405f20555f7fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60206040516b033b2e3c9fd0803ce80000008152a3005b60405162461bcd60e51b8152602060048201526005602482015264189bdd5b9960da1b6044820152606490fd5b346101b65760403660031901126101b657610f69610f5f611d0b565b6024359033611e70565b602060405160018152f35b346101b6575f3660031901126101b6576040515f600154610f9481611c46565b80845290600181169081156101925750600114610fbb576101308361011c81850382611c99565b60015f9081527fb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf6939250905b808210610fff5750909150810160200161011c61010c565b919260018160209254838588010152019101909291610fe7565b346101b6575f3660031901126101b6576040515f60065461103981611c46565b80845290600181169081156101925750600114611060576101308361011c81850382611c99565b60065f9081527ff652222313e28459528d920b65115c16c04f3efc82aaedc97be59f3f377c0d3f939250905b8082106110a45750909150810160200161011c61010c565b91926001816020925483858801015201910190929161108c565b346101b6575f3660031901126101b6576004546040516001600160a01b039091168152602090f35b346101b65760203660031901126101b6576001600160a01b03611107611d0b565b165f52600c602052602060405f2054604051908152f35b346101b6575f3660031901126101b65760405161113a81611c7e565b604051600754815f61114b83611c46565b808352926001811690811561151e57506001146114bf575b61116f92500382611c99565b8152604051600854815f61118283611c46565b80835292600181169081156114a05750600114611441575b6111a692500382611c99565b60208201908152604051600954815f6111be83611c46565b808352926001811690811561142257506001146113c3575b6111e292500382611c99565b604083810191825251600a54815f6111f983611c46565b80835292600181169081156113a45750600114611345575b61121d92500382611c99565b60608401908152604051935f600b5461123581611c46565b808852906001811690811561132157506001146112c7575b50926112ab869361129d6112b99461126d61128f9a610130990388611c99565b8660808201525197519351915193604051998a9960a08b5260a08b0190611cba565b9089820360208b0152611cba565b908782036040890152611cba565b908582036060870152611cba565b908382036080850152611cba565b600b5f90815291507f0175b7a638427703f0dbe7bb9bbf987a2551717b34e79f33b5b1008d1fa01db95b81831061130757505085016020016112ab61124d565b6001816020929493945483858c01015201910191906112f1565b60ff19166020808a019190915291151560051b880190910191506112ab905061124d565b50600a5f90815290917fc65a7bb8d6351c1cf70c95a316cc6a92839c986682d98bc35f958f4883f9d2a85b81831061138857505090602061121d92820101611211565b6020919350806001915483858801015201910190918392611370565b6020925061121d94915060ff191682840152151560051b820101611211565b5060095f90815290917f6e1540171b6c0c960b71a7020d9f60077f6af931a8bbf590da0223dacf75c7af5b8183106114065750509060206111e2928201016111d6565b60209193508060019154838588010152019101909183926113ee565b602092506111e294915060ff191682840152151560051b8201016111d6565b5060085f90815290917ff3f7a9fe364faab93b216da50a3214154f22a0a2b415b23a84c8169e8b636ee35b8183106114845750509060206111a69282010161119a565b602091935080600191548385880101520191019091839261146c565b602092506111a694915060ff191682840152151560051b82010161119a565b5060075f90815290917fa66cc928b5edb82af9bd49922954155ab7b0942694bea4ce44661d9a8736c6885b81831061150257505090602061116f92820101611163565b60209193508060019154838588010152019101909183926114ea565b6020925061116f94915060ff191682840152151560051b820101611163565b346101b6575f3660031901126101b657602060405160128152f35b346101b65760603660031901126101b657611571611d0b565b611579611d21565b6001600160a01b0382165f818152600d6020908152604080832033845290915290205490926044359291600181016115b7575b50610f699350611e70565b838110611604578381039081116115f057610f69945f52600d60205260405f2060018060a01b0333165f5260205260405f2055846115ac565b634e487b7160e01b5f52601160045260245ffd5b60405162461bcd60e51b8152602060048201526009602482015268616c6c6f77616e636560b81b6044820152606490fd5b346101b6575f3660031901126101b6576020600254604051908152f35b346101b65760403660031901126101b65761166b611d0b565b335f818152600d602090815260408083206001600160a01b03909516808452948252918290206024359081905591519182527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591a3602060405160018152f35b346101b65760603660031901126101b6576004356001600160401b0381116101b6576116fb903690600401611cde565b6024356001600160401b0381116101b65761171a903690600401611cde565b906044359360018060a01b0385168095036101b6576004549160ff8360a01c16611b7957611749861515611d37565b611754368684611d6d565b95611760368684611d6d565b94611778885160018110159081611b6d575b50611db2565b61178f865160018110159081611b61575b50611de4565b5f5b88518110156117f557600190600160fd1b6001600160f81b03196117b5838d611e19565b51161015806117ce575b6117c890611db2565b01611791565b506117c8603f60f91b6001600160f81b03196117ea848e611e19565b5116111590506117bf565b50865f5b875181101561189e5760019061183f6001600160f81b031961181b838c611e19565b5116600360fc1b811015908161188f575b811561186b575b81156118455750611de4565b016117f9565b606160f81b81101591508161185c575b508b611789565b603d60f91b101590508b611855565b9050604160f81b81101580611881575b90611833565b50602d60f91b81111561187b565b603960f81b811115915061182c565b5060ff60a01b198616600160a01b176004556001600160401b038111610716576118c85f54611c46565b601f8111611af4575b505f601f8211600114611a74578190611901939495965f92611a695750508160011b915f199060031b1c19161790565b5f555b6001600160401b0381116107165761191d600154611c46565b601f81116119fb575b505f601f821160011461197f57819061195493945f926119745750508160011b915f199060031b1c19161790565b6001555b6bffffffffffffffffffffffff60a01b60035416176003555f80f35b0135905084806103a9565b601f198216937fb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf6915f5b8681106119e357508360019596106119ca575b505050811b01600155611958565b01355f19600384901b60f8161c191690558380806119bc565b909260206001819286860135815501940191016119a9565b818111156119265760015f52601f820160051c7fb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf660208410611a61575b81601f9101920160051c03905f5b828110611a54575050611926565b5f82820155600101611a46565b5f9150611a38565b0135905086806103a9565b601f198216955f80527f290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563915f5b888110611adc57508360019596979810611ac3575b505050811b015f55611904565b01355f19600384901b60f8161c19169055858080611ab6565b90926020600181928686013581550194019101611aa1565b818111156118d1575f8052601f820160051c7f290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e56360208410611b59575b81601f9101920160051c03905f5b828110611b4c5750506118d1565b5f82820155600101611b3e565b5f9150611b30565b6008915011158a611789565b6020915011158a611772565b606460405162461bcd60e51b81526020600482015260046024820152631a5b9a5d60e21b6044820152fd5b346101b6575f3660031901126101b6576040515f5f54611bc381611c46565b80845290600181169081156101925750600114611bea576101308361011c81850382611c99565b5f8080527f290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563939250905b808210611c2c5750909150810160200161011c61010c565b919260018160209254838588010152019101909291611c14565b90600182811c92168015611c74575b6020831014611c6057565b634e487b7160e01b5f52602260045260245ffd5b91607f1691611c55565b60a081019081106001600160401b0382111761071657604052565b90601f801991011681019081106001600160401b0382111761071657604052565b805180835260209291819084018484015e5f828201840152601f01601f1916010190565b9181601f840112156101b6578235916001600160401b0383116101b657602083818601950101116101b657565b600435906001600160a01b03821682036101b657565b602435906001600160a01b03821682036101b657565b15611d3e57565b60405162461bcd60e51b8152602060048201526007602482015266666163746f727960c81b6044820152606490fd5b9291926001600160401b0382116107165760405191611d96601f8201601f191660200184611c99565b8294818452818301116101b6578281602093845f960137010152565b15611db957565b606460405162461bcd60e51b81526020600482015260046024820152636e616d6560e01b6044820152fd5b15611deb57565b60405162461bcd60e51b81526020600482015260066024820152651cde5b589bdb60d21b6044820152606490fd5b908151811015611e2a570160200190565b634e487b7160e01b5f52603260045260245ffd5b15611e4557565b606460405162461bcd60e51b81526020600482015260046024820152637a65726f60e01b6044820152fd5b6001600160a01b0390911690611e87821515611e3e565b6001600160a01b03165f818152600c6020526040902054909190838110611fe0578390835f52600c6020520360405f2055805f52600c60205260405f2083815401905580827fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef6020604051878152a36003546040516327b16a2560e21b815290602090829060049082906001600160a01b03165afa908115611f93575f91611f9e575b506001600160a01b031680611f40575b50505050565b803b156101b6575f92836064926040519687958694637a48316560e11b86526004860152602485015260448401525af18015611f9357611f83575b808080611f3a565b5f611f8d91611c99565b5f611f7b565b6040513d5f823e3d90fd5b90506020813d602011611fd8575b81611fb960209383611c99565b810103126101b657516001600160a01b03811681036101b6575f611f2a565b3d9150611fac565b60405162461bcd60e51b815260206004820152600760248201526662616c616e636560c81b6044820152606490fdfea264697066735822122062cef7b8c0894710f2977c9c897505d269f2102a271ded35bc23b4a38f418dbc64736f6c63430008250033608080604052346036576a01000000000000000000006aff00000000000000000000196014541617601455612e70908161003b8239f35b5f80fdfe6080806040526004361015610012575f80fd5b5f905f3560e01c90816302d05d3f14611e3f575080630a9d793d14611d975780630d7a94f614611cae578063197ebd5314611c785780631f514c5214611c5b5780632485191414611c2e57806326a059341461179d5780632c135b9314611783578063398482d8146117695780633e0dc34e1461174c57806346904840146117205780634bd387e1146117035780636781df67146116e357806369dd567f146116495780636c1eba151461162f57806377a4d5591461153e5780637a2a2a2b146115215780637ff3260b146114fe578063801f39611461149a57806383c023a4146112ca5780638caa0083146112aa5780638ce744261461128257806398daac83146110e5578063999b93af146110bd578063a64190c414610fe9578063a759184914610df8578063abc874a814610dd5578063b9ac17d814610daa578063bf56b37114610d81578063c1bb890114610d60578063c45a015514610d38578063ca85959d14610d18578063cce7ec1314610ca6578063d48fd46e14610753578063d79875eb14610318578063e7c2b772146102f5578063eb5797a41461021a578063eef49ee3146101f45763fc0c546a146101cb575f80fd5b346101f157806003193601126101f157546040516001600160a01b039091168152602090f35b80fd5b50346101f157806003193601126101f157602060ff60145460081c166040519015158152f35b50346101f157806003193601126101f15760145461023e60ff8260581c161561213c565b60ff60581b198116600160581b17601481905560501c60ff1690816102ea575b50806102e0575b156102b557610272612ce4565b6005541561028a576014805460ff60581b1916905580f35b606460405162461bcd60e51b81526020600482015260046024820152631c1bdbdb60e21b6044820152fd5b606460405162461bcd60e51b815260206004820152600460248201526337b832b760e11b6044820152fd5b5060055415610265565b60ff9150165f61025e565b50346101f157806003193601126101f157602060ff601454166040519015158152f35b50346101f15760403660031901126101f1576004359061036a60ff601454610345828260581c161561213c565b61036382600160581b8160581b198416178060145560501c1661208d565b1615612360565b610375821515612233565b61038182601254611fb8565b906d0434327d0ca15db54731cf010b3f602c1b821561073f57829004926103c9846011546103b0818310611fc5565b6103c46714d1120d7b160000831015612268565b611fab565b93601354948581111580610736575b6103e19061229e565b6127106103f461ffff6007541683611f8e565b04956064820282810460641483151715610722579061271061044293920493610421856103c48b86611fab565b9760243589101580610719575b61043790612398565b601255601155611fab565b60135561044d612406565b6001600160801b0384111561070a576001600160801b035b6001600160801b038311156106fb576001600160801b035b6040519061048a82611eda565b6001600160401b03421682526001600160801b0360208301931683526001600160801b03604083019116815260608201868152608083019233845260ff60e25460081c1660308110156106e75790600360549594939202956001600160401b0387605201925116600160401b600160c01b038354925160401b16916001600160401b0360c01b16171790556001600160801b036053860192511682549160ff60801b9051151560801b16916001600160881b0319161717905560018060a01b0390511691019060018060a01b03166001600160601b0360a01b82541617905560e25460ff8160081c16600181018091116106d357603061ff00910660081b168061ff001983161760e25560ff8216603081106106b4575b505083546040516323b872dd60e01b81523360048201523060248201526044810185905291506020908290606490829088906001600160a01b03165af19081156106a957916105fe6020979261060394879161067c575b506123cf565b6128b1565b61060d8333612ba5565b610615612c7d565b6013546106206120d1565b9160405193845284868501526040840152606083015260808201524260a08201527f30410272d9c4bb7e60f94addbee83d821dcd41431f1654d9e3e7d382c718ae8760c03392a26014805460ff60581b19169055604051908152f35b61069c9150893d8b116106a2575b6106948183611f09565b810190612348565b5f6105f8565b503d61068a565b6040513d86823e3d90fd5b6106bf60ff916120bf565b169161ffff1916171760e2555f80806105a1565b634e487b7160e01b85526011600452602485fd5b634e487b7160e01b89526032600452602489fd5b6001600160801b03831661047d565b6001600160801b038416610465565b5088151561042e565b634e487b7160e01b86526011600452602486fd5b508015156103d8565b634e487b7160e01b5f52601260045260245ffd5b5034610a1f575f366003190112610a1f57303303610c7b5760145460ff81169081610c6c575b5015610c3f576003546040516316f0115b60e01b81526001600160a01b039091169190602081600481865afa908115610a14575f91610c20575b506013545f546040516370a0823160e01b815230600482015291946001600160a01b0390911690602083602481855afa928315610a14575f93610bec575b5085151580610be3575b15610bb65761080a8684611f8e565b6714d1120d7b160000870190818811610ba2576108379161082a91611fa1565b80946103c4821515612233565b80610aa3575b50505f805460405163095ea7b360e01b81526001600160a01b038681166004830152602482018690529093506020928492604492849291165af18015610a1457610a86575b506004546001600160a01b0316801592908315610a7f5785935b15610a23575b505f546004546001546007546001600160a01b0394851698918516969285169461ffff90911693169190883b15610a1f575f9560c4946040519889978896639142063160e01b88526004880152602487015260448601526064850152608484015260a4830152875af18015610a1457610a01575b50809181602060018060a01b0382541660446040518094819363095ea7b360e01b83528760048401528160248401525af180156109f6576109d9575b506004546001600160a01b031680610978575b8261010061ff0019601454161760145580f35b6044602092604051948593849263095ea7b360e01b845260048401528160248401525af180156109ce576109af575b808291610965565b6109c79060203d6020116106a2576106948183611f09565b505f6109a7565b6040513d84823e3d90fd5b6109f19060203d6020116106a2576106948183611f09565b610952565b6040513d85823e3d90fd5b610a0d91505f90611f09565b5f5f610916565b6040513d5f823e3d90fd5b5f80fd5b60405163095ea7b360e01b81526001600160a01b03831660048201526024810187905290602090829060449082905f905af18015610a1457156108a257610a789060203d6020116106a2576106948183611f09565b505f6108a2565b5f9361089c565b610a9e9060203d6020116106a2576106948183611f09565b610882565b602060049260405193848092636bdcb6a760e11b82525afa928315610a1457610b08936020935f91610b75575b5060405163a9059cbb60e01b81526001600160a01b0390911660048201526024810192909252909283919082905f9082906044820190565b03925af1908115610a14575f91610b56575b5015610b28575f808061083d565b60405162461bcd60e51b81526020600482015260066024820152653637b1b5b2b960d11b6044820152606490fd5b610b6f915060203d6020116106a2576106948183611f09565b5f610b1a565b610b959150843d8611610b9b575b610b8d8183611f09565b810190612329565b5f610ad0565b503d610b83565b634e487b7160e01b5f52601160045260245ffd5b60405162461bcd60e51b8152602060048201526005602482015264656d70747960d81b6044820152606490fd5b508215156107fb565b9092506020813d602011610c18575b81610c0860209383611f09565b81010312610a1f5751915f6107f1565b3d9150610bfb565b610c39915060203d602011610b9b57610b8d8183611f09565b5f6107b3565b60405162461bcd60e51b8152602060048201526005602482015264737461676560d81b6044820152606490fd5b60ff915060081c16155f610779565b606460405162461bcd60e51b815260206004820152600460248201526339b2b63360e11b6044820152fd5b6040366003190112610a1f576020610d03610cbf611e62565b601454610cd260ff8260581c161561213c565b60ff60581b1916600160581b17601455600454610cf8906001600160a01b031615612175565b6024359034906124a5565b6014805460ff60581b19169055604051908152f35b34610a1f575f366003190112610a1f57602060ff60515416604051908152f35b34610a1f575f366003190112610a1f576003546040516001600160a01b039091168152602090f35b34610a1f575f366003190112610a1f57602061ffff60075416604051908152f35b34610a1f575f366003190112610a1f5760206001600160401b0360145460101c16604051908152f35b34610a1f576020366003190112610a1f576020610dcd610dc8611e62565b6122d0565b604051908152f35b34610a1f575f366003190112610a1f57602060ff60515460081c16604051908152f35b34610a1f57610e0636611e78565b9190601454610e1b60ff8260581c161561213c565b60ff60581b1916600160581b176014556004546001600160a01b0316610e42811515612175565b6040516370a0823160e01b815230600482015290602082602481845afa918215610a14575f92610fb3575b506040516323b872dd60e01b815233600482015230602482015260448101939093529091906020908290815f81606481015b03925af1908115610a14575f91610f94575b5015610f6957602490602060018060a01b0360045416604051938480926370a0823160e01b82523060048301525afa8015610a14575f90610f35575b610ef79250611fab565b918215610f0a57602092610d03926124a5565b60405162461bcd60e51b815260206004820152600360248201526219dbdd60ea1b6044820152606490fd5b506020823d602011610f61575b81610f4f60209383611f09565b81010312610a1f57610ef79151610eed565b3d9150610f42565b606460405162461bcd60e51b81526020600482015260046024820152631c1d5b1b60e21b6044820152fd5b610fad915060203d6020116106a2576106948183611f09565b84610eb1565b91506020823d602011610fe1575b81610fce60209383611f09565b81010312610a1f57905190610e9f610e6d565b3d9150610fc1565b34610a1f576020366003190112610a1f5761101360043561100b811515612233565b601254611fb8565b6d0434327d0ca15db54731cf010b3f602c1b90801561073f5761103f91046011546103b0818310611fc5565b601354811115806110b4575b6110549061229e565b61271061106761ffff6007541683611f8e565b04606482029180830460641481151715610ba2576127106080930491611091836103c48385611fab565b9261109d841515611ffb565b604051938452602084015260408301526060820152f35b5080151561104b565b34610a1f575f366003190112610a1f576004546040516001600160a01b039091168152602090f35b34610a1f575f366003190112610a1f5760515460ff811690611106826121ed565b916111146040519384611f09565b808352611120816121ed565b602084019190601f1901368337611136816121ed565b906111446040519283611f09565b808252611150816121ed565b602083019490601f19013686376030821015611270575060ff5f95949392955b165f5b8281106111ff57505050604051938493604085019060408652518091526060850192905f5b8181106111e6575050506020908483038286015251918281520191905f5b8181106111c4575050500390f35b82516001600160401b03168452859450602093840193909201916001016111b6565b8251855287965060209485019490920191600101611198565b603061121082849996979899611fb8565b0690603082101561125c576001600160401b0361123e8360019460150154611238858d612204565b52612218565b90549060031b1c166112508287612204565b52019594939295611173565b634e487b7160e01b5f52603260045260245ffd5b60ff809160081c169594939295611170565b34610a1f575f366003190112610a1f576002546040516001600160a01b039091168152602090f35b34610a1f575f366003190112610a1f57602060ff60105416604051908152f35b34610a1f575f366003190112610a1f5760e25460ff81166112ea816121ed565b916112f86040519384611f09565b818352601f19611307836121ed565b015f5b8181106114655750506030821015611458575060ff5f5b165f5b8281106113bf57836040518091602082016020835281518091526020604084019201905f5b818110611357575050500390f35b91935091602060a060019286516001600160401b0381511682526001600160801b038482015116848301526001600160801b03604082015116604083015260608101511515606083015260808580851b03910151166080820152019401910191849392611349565b60306113cb8284611fb8565b0690603082101561125c576040516001926003026113e882611eda565b6001600160801b0381605201546001600160401b038116845260401c16602083015260ff60538201546001600160801b038116604085015260801c16151560608301526054848060a01b039101541660808201526114468287612204565b526114518186612204565b5001611324565b60ff809160081c16611321565b60209060405161147481611eda565b5f81525f838201525f60408201525f60608201525f60808201528282880101520161130a565b34610a1f575f366003190112610a1f5760e06011546012546013546114bd6120d1565b6114c56121a9565b9060ff60145416926114d561210c565b946040519687526020870152604086015260608501526080840152151560a083015260c0820152f35b34610a1f575f366003190112610a1f57602060ff60e25460081c16604051908152f35b34610a1f575f366003190112610a1f576020601354604051908152f35b34610a1f575f366003190112610a1f57604051600654905f61155f83611ea2565b80835260208301936001811690811561161457506001146115b6575b509061158b816040930382611f09565b8151928391602083525180918160208501528484015e5f828201840152601f01601f19168101030190f35b91905060065f527ff652222313e28459528d920b65115c16c04f3efc82aaedc97be59f3f377c0d3f915f905b8082106115fa5750909150810160200161158b61157b565b9192600181602092548385880101520191019092916115e2565b60ff1916855250151560051b8201602001905061158b61157b565b34610a1f575f366003190112610a1f576020610dcd6121a9565b34610a1f5761165736611e78565b60149291925461166d60ff8260581c161561213c565b60ff60581b1916600160581b176014556003546001600160a01b031633036116b457600454602093610d039390916116af906001600160a01b03161515612175565b6124a5565b60405162461bcd60e51b8152602060048201526007602482015266666163746f727960c81b6044820152606490fd5b34610a1f575f366003190112610a1f57602060ff60e25416604051908152f35b34610a1f575f366003190112610a1f576020601154604051908152f35b34610a1f575f366003190112610a1f5760075460405160109190911c6001600160a01b03168152602090f35b34610a1f575f366003190112610a1f576020600554604051908152f35b34610a1f575f366003190112610a1f576020610dcd61210c565b34610a1f575f366003190112610a1f576020610dcd6120d1565b34610a1f57610100366003190112610a1f576117b7611e62565b6024356001600160a01b0381169190829003610a1f576044356001600160a01b0381169190829003610a1f57606435906001600160401b038211610a1f5736602383011215610a1f5781600401356001600160401b038111610a1f573660248285010111610a1f576084359161ffff8316809303610a1f5760a435936001600160401b038511610a1f5736602386011215610a1f578460040135956001600160401b038711610a1f573660248860051b88010111610a1f5760c4356001600160a01b03811690819003610a1f5760e435916001600160a01b0383168303610a1f57601454946118ac60ff8760501c161561208d565b6001600160a01b031680151580611c25575b80611c1c575b6118cd90611f2a565b6101e08711611bf15761012c8811611bc65760088a11611b9b5760ff60501b19909516600160501b176014555f80546001600160a01b03199081169690961790556001805486168b1790556002805486169190911790556003805485163317905560048054909416179092556007805462010000600160b01b03191660109390931b62010000600160b01b03169290921790915560065482919061197090611ea2565b601f8111611b24575b505f90601f8311600114611a98575f92611a8a575b50508160011b915f199060031b1c1916176006555b61ffff1960075416176007556714d1120d7b1600006011556b033b2e3c9fd0803ce800000060125560145469ffffffffffffffff00004260101b169069ffffffffffffffff00001916176014555f5b82811015611a80576024600582901b830101356001600160a01b0381169190829003610a1f5781158015611a77575b611a6e5760ff6010541691600883101561125c57600192600801906001600160601b0360a01b82541617905560105460ff611a5d8183166120bf565b169060ff1916176010555b016119f2565b60019150611a68565b50848214611a21565b611a88612406565b005b60249250010135868061198e565b909150601f1983169160065f527ff652222313e28459528d920b65115c16c04f3efc82aaedc97be59f3f377c0d3f925f5b818110611b095750908460019594939210611aed575b505050811b016006556119a3565b01602401355f19600384901b60f8161c19169055868080611adf565b91936020600181926024888801013581550195019201611ac9565b828111156119795790915060065f52601f830160051c9060208410611b93575b9080601f8594930160051c03905f5b828110611b61575050611979565b5f8183017ff652222313e28459528d920b65115c16c04f3efc82aaedc97be59f3f377c0d3f0155859450600101611b53565b5f9150611b44565b606460405162461bcd60e51b81526020600482015260046024820152637465616d60e01b6044820152fd5b60405162461bcd60e51b81526020600482015260036024820152620e8c2f60eb1b6044820152606490fd5b606460405162461bcd60e51b81526020600482015260046024820152636d65746160e01b6044820152fd5b508115156118c4565b508a15156118be565b34610a1f576020366003190112610a1f576020611c51611c4c611e62565b61202d565b6040519015158152f35b34610a1f575f366003190112610a1f576020601254604051908152f35b34610a1f576020366003190112610a1f576004356008811015610a1f57600801546040516001600160a01b039091168152602090f35b34610a1f576040366003190112610a1f57611cc7611e62565b611cf7612710611cef611ce960243594610dc86509184e72a000871015611f5c565b84611f8e565b048092611fab565b612710611d0a61ffff6007541683611f8e565b04916064820282810460641483151715610ba25783926103c4612710611d339304948592611fab565b90611d4082601154611fb8565b936d0434327d0ca15db54731cf010b3f602c1b851561073f5760a095611d6f91046012546103c4818310611fc5565b93611d7b851515611ffb565b6040519485526020850152604084015260608301526080820152f35b34610a1f576020366003190112610a1f57611db0611e62565b600254906001600160a01b0382163303611e0f576001600160a01b0316908190611ddb821515611f2a565b6001600160a01b031916176002557f90ed2f900bebee953d2681b0d058f80fd7ddec64c41a29669b22dbe3618687965f80a2005b60405162461bcd60e51b81526020600482015260086024820152671c1c9bdd1bd8dbdb60c21b6044820152606490fd5b34610a1f575f366003190112610a1f576001546001600160a01b03168152602090f35b600435906001600160a01b0382168203610a1f57565b6060906003190112610a1f576004356001600160a01b0381168103610a1f57906024359060443590565b90600182811c92168015611ed0575b6020831014611ebc57565b634e487b7160e01b5f52602260045260245ffd5b91607f1691611eb1565b60a081019081106001600160401b03821117611ef557604052565b634e487b7160e01b5f52604160045260245ffd5b90601f801991011681019081106001600160401b03821117611ef557604052565b15611f3157565b606460405162461bcd60e51b81526020600482015260046024820152637a65726f60e01b6044820152fd5b15611f6357565b60405162461bcd60e51b815260206004820152600360248201526236b4b760e91b6044820152606490fd5b81810292918115918404141715610ba257565b811561073f570490565b91908203918211610ba257565b91908201809211610ba257565b15611fcc57565b60405162461bcd60e51b81526020600482015260076024820152667265736572766560c81b6044820152606490fd5b1561200257565b606460405162461bcd60e51b8152602060048201526004602482015263191d5cdd60e21b6044820152fd5b6001546001600160a01b03918216911681146120875760105460ff16905f5b82811061205a575050505f90565b600881101561125c5760088101546001600160a01b0316821461207f5760010161204c565b505050600190565b50600190565b1561209457565b606460405162461bcd60e51b81526020600482015260046024820152631a5b9a5d60e21b6044820152fd5b60ff60019116019060ff8211610ba257565b6011546b033b2e3c9fd0803ce80000008102908082046b033b2e3c9fd0803ce80000001490151715610ba25760125461210991611fa1565b90565b601154670de0b6b3a7640000810290808204670de0b6b3a76400001490151715610ba25760125461210991611fa1565b1561214357565b60405162461bcd60e51b815260206004820152600a6024820152697265656e7472616e637960b01b6044820152606490fd5b1561217c57565b60405162461bcd60e51b815260206004820152600560248201526471756f746560d81b6044820152606490fd5b60ff601454166121e7576013546127108102908082046127101490151715610ba257673a4965bf58a400009004612710811115612109575061271090565b61271090565b6001600160401b038111611ef55760051b60200190565b805182101561125c5760209160051b010190565b90603082101561125c5760188260021c6045019260031b1690565b1561223a57565b60405162461bcd60e51b8152602060048201526006602482015265746f6b656e7360d01b6044820152606490fd5b1561226f57565b60405162461bcd60e51b81526020600482015260076024820152661d9a5c9d1d585b60ca1b6044820152606490fd5b156122a557565b606460405162461bcd60e51b81526020600482015260046024820152631c99585b60e21b6044820152fd5b6122d99061202d565b612325576122f56001600160401b0360145460101c1642611fab565b60058110156123205760050360058111610ba257806126ac02906126ac820403610ba2576005900490565b505f90565b5f90565b90816020910312610a1f57516001600160a01b0381168103610a1f5790565b90816020910312610a1f57518015158103610a1f5790565b1561236757565b60405162461bcd60e51b815260206004820152600960248201526819dc98591d585d195960ba1b6044820152606490fd5b1561239f57565b60405162461bcd60e51b8152602060048201526008602482015267736c69707061676560c01b6044820152606490fd5b156123d657565b60405162461bcd60e51b81526020600482015260086024820152673a3930b739b332b960c11b6044820152606490fd5b61240e6120d1565b60ff60515460081c16603081101561125c576015015561243560ff60515460081c16612218565b81549060031b906001600160401b03804216831b921b191617905560515460ff8160081c1660018101809111610ba257603061ff00910660081b168061ff001983161760515560ff82166030811061248c57505050565b61249760ff916120bf565b169161ffff19161717605155565b929192601454906124bb60ff8360501c1661208d565b60ff821615916124ca83612360565b6001600160a01b038216938415612880576124ed6509184e72a000821015611f5c565b6124ff612710611cef611ce9866122d0565b9061271061251361ffff6007541684611f8e565b04946064830283810460641484151715610ba25786936103c461271061253c9304988992611fab565b9361254985601154611fb8565b6d0434327d0ca15db54731cf010b3f602c1b811561073f5781900490612577826012546103c4818310611fc5565b9b8c101580612877575b61258a90612398565b60115560125561259c85601354611fb8565b918260135580612865575b612827575b50506125b6612406565b6001600160801b03831115612818576001600160801b035b6001600160801b03891115612809576001600160801b035b604051906125f382611eda565b6001600160401b03421682526001600160801b0360208301931683526001600160801b03604083019116815260608201906001825260808301918a835260ff60e25460081c1693603085101561125c57600360549502956001600160401b0387605201925116600160401b600160c01b038354925160401b16916001600160401b0360c01b16171790556001600160801b036053860192511682549160ff60801b9051151560801b16916001600160881b0319161717905560018060a01b0390511691019060018060a01b03166001600160601b0360a01b82541617905560e25460ff8160081c1660018101809111610ba25761274f9560209261ff0060308d940660081b168061ff001983161760e25560ff8216603081106127ea575b50505f805460405163a9059cbb60e01b81526001600160a01b0394851660048201526024810195909552939889949093169284925082906044820190565b03925af1918215610a14577f30410272d9c4bb7e60f94addbee83d821dcd41431f1654d9e3e7d382c718ae87956127926127979460c0975f916127d157506123cf565b612b29565b61279f612c7d565b6013546127aa6120d1565b9060405192600184526020840152876040840152606083015260808201524260a0820152a2565b61069c915060203d6020116106a2576106948183611f09565b6127f560ff916120bf565b169161ffff1916171760e2555f8080612711565b6001600160801b0389166125e6565b6001600160801b0383166125ce565b60019060ff1916176014556040519081527f3a11b9c0ca38b86101cb9e6e1dd2f752c31467c6eaa353f931b801a338406de660203092a25f806125ac565b50673a4965bf58a400008210156125a7565b508b1515612581565b60405162461bcd60e51b81526020600482015260096024820152681c9958da5c1a595b9d60ba1b6044820152606490fd5b90610bb8820290828204610bb81483151715610ba2576128d96127106128de93048094611fab565b611fb8565b6002545f926128f5916001600160a01b0316612ba5565b80156129b05760075460101c6001600160a01b031680612b1d57506003546040516327b16a2560e21b815290602090829060049082906001600160a01b03165afa908115610a14575f91612afe575b506004546001600160a01b0316806129ca575082546001600160a01b039182169116813b156129c65760405163586125fb60e11b81526001600160a01b039190911660048201525f60248201526044810183905291839183916064918391905af180156109ce576129b4575b5050565b6129bf828092611f09565b6101f15750565b8380fd5b60405163095ea7b360e01b81526001600160a01b03831660048201526024810184905290602090829060449082905f905af18015610a1457612ae1575b505f546004546001600160a01b0392831693929182169116833b15610a1f5760405163586125fb60e11b81526001600160a01b0392831660048201529116602482015260448101919091525f8160648183865af18015610a1457612acc575b5060208291604460018060a01b036004541691604051958693849263095ea7b360e01b845260048401528160248401525af1908115612ac05750612aa8575b50565b612aa59060203d6020116106a2576106948183611f09565b604051903d90823e3d90fd5b602092505f612ada91611f09565b5f91612a66565b612af99060203d6020116106a2576106948183611f09565b612a07565b612b17915060203d602011610b9b57610b8d8183611f09565b5f612944565b612b279250612ba5565b565b91905f92610bb8810291818304610bb81482151715610ba257612b5b612b6d916128d96127106128f596048095611fab565b9360018060a01b036002541692611fb8565b90612ba5565b15612b7a57565b60405162461bcd60e51b815260206004820152600360248201526270617960e81b6044820152606490fd5b81156129b0576004546001600160a01b031615612c2d576004805460405163a9059cbb60e01b81526001600160a01b0393841692810192909252602482019390935291602091839160449183915f91165af18015610a1457612b27915f91612c0e575b50612b73565b612c27915060203d6020116106a2576106948183611f09565b5f612c08565b5f80809381935af13d15612c74573d906001600160401b038211611ef557604051612b2792612c66601f8201601f191660200183611f09565b81525f60203d92013e612b73565b612b2790612b73565b60145460ff81168015612cd1575b612aa55760019060ff1916176014556013546040519081527f3a11b9c0ca38b86101cb9e6e1dd2f752c31467c6eaa353f931b801a338406de660203092a2612b27612ce4565b50673a4965bf58a4000060135410612c8b565b6005545f90612aa5576003546040516316f0115b60e01b815290602090829060049082906001600160a01b03165afa8015610a145782915f91612e1b575b5060ff60145460081c1615612dd0575b604051630c9e56fb60e11b81523060048201529260209184916024918391906001600160a01b03165af180928293612d98575b50612d6e575050565b7fd68c766dc26285c80153653e39af123d4faeeaa0e5d93a4af2fb187e87ab2578908260055580a2565b9092506020813d602011612dc8575b81612db460209383611f09565b81010312612dc45751915f612d65565b5080fd5b3d9150612da7565b9050303b15610a1f57604051636a47ea3760e11b81525f8160048183305af19081612e06575b50612dff575050565b8190612d32565b612e139193505f90611f09565b5f915f612df6565b612e34915060203d602011610b9b57610b8d8183611f09565b5f612d2256fea2646970667358221220b8e3eae4065670f2b9284acf7639fd2a29bf52a56ff349a44e0410ebd7436fdb64736f6c634300082500336080806040523460135760ad908160188239f35b5f80fdfe60808060405260043610156011575f80fd5b5f3560e01c6376b6d4db146023575f80fd5b3460735760403660031901126073576004356001600160a01b038116919082900360735760207f9f1ec8c880f76798e7b793325d625e9b60e4082a553c98f42b6cda368dd60008916024358152a2005b5f80fdfea2646970667358221220c25618775f6a0b1b06de0c9e6c815ca0311454913225a5ca450002507531d3f964736f6c6343000825003360a08060405234603d57336080526114379081610042823960805181818160cb015281816102b1015281816103bd015281816109b901526110970152f35b5f80fdfe60806040526004361015610011575f80fd5b5f3560e01c806319bc9ae8146106985780631e83409a146104b757806328079e4a146104675780633dfd3873146103a15780637b4717a4146103515780637d37df64146103195780637f5a7c7b146102f2578063b0c24bf6146102e0578063c45a01551461029c578063cab1ef671461025c5763f49062ca14610092575f80fd5b3461019a576100a0366106f8565b9160405163c45a015560e01b8152602081600481335afa80156101a6576100fd915f9161022d575b507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b039081169116146108fb565b6001600160a01b03811690816101b1575b50506001600160a01b038116918261012257005b604051926370a0823160e01b84526004840152602083602481335afa9283156101a6575f9361016c575b5061015d6101649161016a9461078f565b823361114d565b33611319565b005b92506020833d60201161019e575b8161018760209383610732565b8101031261019a5791519161015d61014c565b5f80fd5b3d915061017a565b6040513d5f823e3d90fd5b604051916370a0823160e01b83526004830152602082602481335afa80156101a65784925f916101f4575b5061015d6101ed936101649261079c565b5f8061010e565b9250506020823d602011610225575b8161021060209383610732565b8101031261019a57905183919061015d6101dc565b3d9150610203565b61024f915060203d602011610255575b6102478183610732565b8101906108dc565b5f6100c8565b503d61023d565b3461019a57602036600319011261019a576001600160a01b0361027d6106cc565b165f526002602052602060018060a01b0360405f205416604051908152f35b3461019a575f36600319011261019a576040517f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03168152602090f35b61016a6102ec366106f8565b9161097b565b3461019a575f36600319011261019a575f546040516001600160a01b039091168152602090f35b3461019a57602036600319011261019a576001600160a01b0361033a6106cc565b165f526001602052602060405f2054604051908152f35b3461019a57604036600319011261019a5761036a6106cc565b6103726106e2565b6001600160a01b039182165f908152600360209081526040808320949093168252928352819020549051908152f35b3461019a57602036600319011261019a576103ba6106cc565b337f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03161480610455575b80610443575b15610418575f80546001600160a01b0319166001600160a01b0392909216919091179055005b606460405162461bcd60e51b8152602060048201526004602482015263686f6f6b60e01b6044820152fd5b506001600160a01b03811615156103f2565b505f546001600160a01b0316156103ec565b3461019a57604036600319011261019a576104806106cc565b6104886106e2565b6001600160a01b039182165f908152600460209081526040808320949093168252928352819020549051908152f35b3461019a57602036600319011261019a576104d06106cc565b6104da338261102f565b610668576040516370a0823160e01b81523360048201526001600160a01b0382169190602081602481865afa9081156101a6575f9161062e575b508061052e61054192670de0b6b3a764000094339061114d565b835f52600160205260405f205490610768565b5f8381526003602090815260408083203380855290835281842095909404909455848252600481528382209282529190915220548015610601575f828152600460209081526040808320338452825280832083905584835260028252909120549092906001600160a01b031682600182036105f8576105c491505f5b3390611238565b604051908282527ff7a40077ff7a04c7e61f6f26fb13774259ddf1b6bce9ecf26a8276cdd3992683843393a3604051908152f35b6105c4916105bd565b60405162461bcd60e51b8152602060048201526005602482015264656d70747960d81b6044820152606490fd5b90506020813d602011610660575b8161064960209383610732565b8101031261019a5751670de0b6b3a7640000610514565b3d915061063c565b60405162461bcd60e51b8152602060048201526008602482015267195e18db1d59195960c21b6044820152606490fd5b3461019a57604036600319011261019a5760206106c46106b66106cc565b6106be6106e2565b906107a9565b604051908152f35b600435906001600160a01b038216820361019a57565b602435906001600160a01b038216820361019a57565b606090600319011261019a576004356001600160a01b038116810361019a57906024356001600160a01b038116810361019a579060443590565b90601f8019910116810190811067ffffffffffffffff82111761075457604052565b634e487b7160e01b5f52604160045260245ffd5b8181029291811591840414171561077b57565b634e487b7160e01b5f52601160045260245ffd5b9190820391821161077b57565b9190820180921161077b57565b6107b3828261102f565b6108b3576040516370a0823160e01b81526001600160a01b0383811660048301529092911690602083602481855afa9283156101a6575f93610877575b50670de0b6b3a764000061081461086b94845f52600160205260405f205490610768565b04825f52600360205260405f2060018060a01b0383165f5260205260405f20548082115f1461086e576108469161078f565b915b5f52600460205260405f209060018060a01b03165f5260205260405f205461079c565b90565b50505f91610848565b92506020833d6020116108ab575b8161089260209383610732565b8101031261019a57915191670de0b6b3a76400006107f0565b3d9150610885565b60018060a01b03165f52600460205260405f209060018060a01b03165f5260205260405f205490565b9081602091031261019a57516001600160a01b038116810361019a5790565b1561090257565b60405162461bcd60e51b81526020600482015260056024820152643a37b5b2b760d91b6044820152606490fd5b1561093657565b60405162461bcd60e51b815260206004820152600560248201526476616c756560d81b6044820152606490fd5b9081602091031261019a5751801515810361019a5790565b60405163c45a015560e01b81526001600160a01b0391909116929091602083600481875afa9283156101a6575f9361100e575b506001600160a01b037f00000000000000000000000000000000000000000000000000000000000000008116936109e7911684146108fb565b604051637165485d60e01b8152602081600481885afa9081156101a6575f91610fef575b506001600160a01b0316923384148015610fdc575b15610fae578215610f80576001600160a01b0382168015908115610e095750610a4a84341461092f565b5f868152600260205260409020546001600160a01b031680610dbf575015610db95760015b5f86815260026020526040902080546001600160a01b0319166001600160a01b039092169190911790555b6040516318160ddd60e01b815290602082600481895afa9182156101a6575f92610d85575b50604051637165485d60e01b8152916020836004818a5afa9283156101a6575f93610d64575b506040516370a0823160e01b81526001600160a01b0390931660048401526020836024818a5afa9283156101a6575f93610d2e575b50610b2960049360209261078f565b9160405193848092636bdcb6a760e11b82525afa9182156101a6575f92610d0d575b506040516370a0823160e01b81526001600160a01b039092166004830152602082602481895afa9081156101a6575f91610cd7575b610b8a925061078f565b6040516370a0823160e01b8152738366a39cc670b4001a1121b8f6a443a643e40951600482015290602082602481895afa9081156101a6575f91610ca1575b610bd3925061078f565b928315610c49575050670de0b6b3a7640000810290808204670de0b6b3a7640000148115171561077b57827fcd909ec339185c4598a4096e174308fbdf136d117f230960f873a2f2e81f63af9360409304855f526001602052610c3a845f2091825461079c565b905582519182526020820152a2565b60049450602091929350604051948580926302d05d3f60e01b82525afa9081156101a657610c7e935f92610c80575b50611238565b565b610c9a91925060203d602011610255576102478183610732565b905f610c78565b90506020823d602011610ccf575b81610cbc60209383610732565b8101031261019a57610bd3915190610bc9565b3d9150610caf565b90506020823d602011610d05575b81610cf260209383610732565b8101031261019a57610b8a915190610b80565b3d9150610ce5565b610d2791925060203d602011610255576102478183610732565b905f610b4b565b92506020833d602011610d5c575b81610d4960209383610732565b8101031261019a57915191610b29610b1a565b3d9150610d3c565b610d7e91935060203d602011610255576102478183610732565b915f610ae5565b9091506020813d602011610db1575b81610da160209383610732565b8101031261019a5751905f610abf565b3d9150610d94565b81610a6f565b9015610e035760015b6001600160a01b031614610a9a5760405162461bcd60e51b815260206004820152600560248201526471756f746560d81b6044820152606490fd5b82610dc8565b9093610e15341561092f565b6040516370a0823160e01b815230600482015290602082602481865afa9182156101a6575f92610f4c575b50604051906323b872dd60e01b825233600483015230602483015260448201526020816064815f875af19081156101a6575f91610f1d575b5015610eed576020602492604051938480926370a0823160e01b82523060048301525afa80156101a6575f90610eb9575b610eb3925061078f565b92610a4a565b506020823d602011610ee5575b81610ed360209383610732565b8101031261019a57610eb39151610ea9565b3d9150610ec6565b60405162461bcd60e51b81526020600482015260086024820152673a3930b739b332b960c11b6044820152606490fd5b610f3f915060203d602011610f45575b610f378183610732565b810190610963565b5f610e78565b503d610f2d565b9091506020813d602011610f78575b81610f6860209383610732565b8101031261019a5751905f610e40565b3d9150610f5b565b60405162461bcd60e51b8152602060048201526006602482015265185b5bdd5b9d60d21b6044820152606490fd5b60405162461bcd60e51b815260206004820152600660248201526531b0b63632b960d11b6044820152606490fd5b505f546001600160a01b03163314610a20565b611008915060203d602011610255576102478183610732565b5f610a0b565b61102891935060203d602011610255576102478183610732565b915f6109ae565b6001600160a01b0390911690811561114657604051637165485d60e01b815290602090829060049082906001600160a01b03165afa9081156101a6575f91611127575b506001600160a01b0316811461110257604051636bdcb6a760e11b81526020816004817f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03165afa9081156101a6575f91611108575b506001600160a01b0316811461110257738366a39cc670b4001a1121b8f6a443a643e40951146110fd575f90565b600190565b50600190565b611121915060203d602011610255576102478183610732565b5f6110cf565b611140915060203d602011610255576102478183610732565b5f611072565b5050600190565b611157828261102f565b80156111fe575b6111f9576001600160a01b03165f818152600160205260409020549092670de0b6b3a76400009161118e91610768565b04825f52600360205260405f2060018060a01b0383165f5260205260405f20548082116111bc575b50505050565b6111c59161078f565b915f52600460205260405f209060018060a01b03165f526020526111ee60405f2091825461079c565b90555f8080806111b6565b505050565b50821561115e565b1561120d57565b606460405162461bcd60e51b81526020600482015260046024820152631cd95b9960e21b6044820152fd5b82158015611308575b6111f9576001600160a01b0316806112a557505f80809381935af13d1561129c573d9067ffffffffffffffff821161075457604051610c7e9261128e601f8201601f191660200183610732565b81525f60203d92013e611206565b610c7e90611206565b9160446020925f604051958694859363a9059cbb60e01b855260018060a01b0316600485015260248401525af180156101a657610c7e915f916112e9575b50611206565b611302915060203d602011610f4557610f378183610732565b5f6112e3565b506001600160a01b03821615611241565b611323828261102f565b6113d8576040516370a0823160e01b81526001600160a01b038381166004830152919091169190602081602481865afa9081156101a6575f916113a4575b50611382670de0b6b3a764000091845f52600160205260405f205490610768565b04915f52600360205260405f209060018060a01b03165f5260205260405f2055565b90506020813d6020116113d0575b816113bf60209383610732565b8101031261019a5751611382611361565b3d91506113b2565b60018060a01b03165f52600360205260405f209060018060a01b03165f526020525f604081205556fea2646970667358221220b8e7beab1a17eea3579e9f68d12ad25f0ca46e8c906dfa02f8d0ad0d310b591f64736f6c6343000825003360e03461010b57601f610f7338819003918201601f19168301916001600160401b0383118484101761010f57808492604094855283398101031261010b57610052602061004b83610123565b9201610123565b906001600160a01b0381161515806100f9575b156100ce5760805260a0523360c052604051610e3b9081610138823960805181818160cd01528181610377015281816104030152610747015260a05181818161030c01528181610a3d0152610ade015260c05181818161013b01528181610186015261098f0152f35b606460405162461bcd60e51b81526020600482015260046024820152637a65726f60e01b6044820152fd5b506001600160a01b0382161515610065565b5f80fd5b634e487b7160e01b5f52604160045260245ffd5b51906001600160a01b038216820361010b5756fe6080604052600436101561001a575b3615610018575f80fd5b005b5f3560e01c8063027a13c31461044057806321d0ee70146103a6578063481c6a7514610362578063684931ed1461033b5780639ec5a894146102f7578063ad09123014610287578063b47b2fb114610209578063b6a5d7de1461016a578063c45a0155146101265763dc98354e0361000e57346101225760e0366003190112610122576100a561060a565b60a03660231901126101225760c4356001600160a01b0381160361012257610110906100fb337f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316146106d5565b5f546001600160a01b0391821691161461064e565b604051636e4c1aa760e11b8152602090f35b5f80fd5b34610122575f366003190112610122576040517f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03168152602090f35b346101225760203660031901126101225761018361060a565b337f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031614806101f7575b806101e5575b6101c49061064e565b5f80546001600160a01b0319166001600160a01b0392909216919091179055005b506001600160a01b03811615156101bb565b505f546001600160a01b0316156101b5565b34610122576101603660031901126101225761022361060a565b5060a03660231901126101225760603660c3190112610122576101443567ffffffffffffffff81116101225761025d903690600401610620565b5050604061026d61012435610744565b82516001600160e01b03199092168252600f0b6020820152f35b34610122576020366003190112610122576004355f52600160205260a060405f2060ff600180841b03825416916002600180861b03600183015416910154906040519384526020840152600180851b038116604084015261ffff81851c16606084015260b01c1615156080820152f35b34610122575f366003190112610122576040517f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03168152602090f35b34610122575f366003190112610122575f546040516001600160a01b039091168152602090f35b34610122575f366003190112610122576040517f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03168152602090f35b3461012257610160366003190112610122576103c061060a565b5060a03660231901126101225760803660c3190112610122576101443567ffffffffffffffff8111610122576103fa903690600401610620565b506104319050337f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316146106d5565b6303cb96db60e21b5f5260045ffd5b346101225760803660031901126101225761045961060a565b6024356001600160a01b038116808203610122576044356001600160a01b0381169190829003610122576064359261ffff8416809403610122576104a760018060a01b035f5416331461064e565b6001600160a01b038516948286101561060557905b604080516001600160a01b03938416602082019081529390921690820152610bb86060820152603c60808201523060a080830191909152815261050060c0826106b3565b51902092835f52600160205260ff600260405f20015460b01c166105d35760026020956040519061053082610683565b81528681019384526040808201958652606082019384526001608083018181525f898152828b52839020935184546001600160a01b03199081166001600160a01b0392831617865597519285018054909816928116929092179096559551929091018054935194516001600160b81b0319909416929095169190911760a09390931b61ffff60a01b169290921790151560b01b60ff60b01b161790915551908152f35b60405162461bcd60e51b815260206004820152600a6024820152691c9959da5cdd195c995960b21b6044820152606490fd5b6104bc565b600435906001600160a01b038216820361012257565b9181601f840112156101225782359167ffffffffffffffff8311610122576020838186019501011161012257565b1561065557565b60405162461bcd60e51b815260206004820152600660248201526539b2b2b232b960d11b6044820152606490fd5b60a0810190811067ffffffffffffffff82111761069f57604052565b634e487b7160e01b5f52604160045260245ffd5b90601f8019910116810190811067ffffffffffffffff82111761069f57604052565b156106dc57565b60405162461bcd60e51b815260206004820152600760248201526636b0b730b3b2b960c91b6044820152606490fd5b9190820180921161071857565b634e487b7160e01b5f52601160045260245ffd5b90816020910312610122575180151581036101225790565b907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031661077a3382146106d5565b6024356001600160a01b03811691828203610122576044356001600160a01b03811693848203610122575f9460643562ffffff8116809103610122576084358060020b8091036101225760a4356001600160a01b03811692908381036101225750604051936020850195865260408501526060840152608083015260a082015260a0815261080960c0826106b3565b5190205f52600160205260405f2060026040519161082683610683565b60018060a01b03815416835260018060a01b036001820154166020840152015493604082019260018060a01b038616845260ff606084019661ffff8160a01c16885260b01c161580156080850152610ccd5760c435801515809103610122575f60e4351214988915610cc257600f0b5b80600f0b5f8112610ca0575b5080600f0b15610c89576001600160801b0316606481028115908281046064148217156107185761271061ffff9104985116808302928304141715610718576127109004916108f1838861070b565b998a15610c715715610c695750935b803b1561012257604051630b0d9c0960e01b81526001600160a01b0386166004820152306024820152604481018a9052905f908290606490829084905af18015610c5e57610c49575b50610bb88502858104610bb81486151715610c3557612710900494858103908111610c3557906109789161070b565b604051634673a21360e11b815290946020826004817f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03165afa8015610c2a578790610be0575b6109d1925085610d15565b81516001600160a01b031615610a0f5750516109f793506001600160a01b031690610d15565b63b47b2fb160e01b916001600160801b0316600f0b90565b91905082610a21575b505050506109f7565b6001600160a01b03811680610acf575050516001600160a01b037f000000000000000000000000000000000000000000000000000000000000000081169116813b15610acb579060648492604051948593849263586125fb60e11b845260048401528560248401528160448401525af18015610ac057610aa8575b50505b5f808080610a18565b610ab38280926106b3565b610abd5780610a9c565b80fd5b6040513d84823e3d90fd5b8380fd5b60405163095ea7b360e01b81527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03811660048301526024820186905291602090829060449082908a905af18015610bd557610ba8575b5091516001600160a01b039283169216823b15610ba45760405163586125fb60e11b81526001600160a01b03918216600482015291166024820152604481019290925282908290606490829084905af18015610ac057610b8f575b5050610a9f565b610b9a8280926106b3565b610abd5780610b88565b8480fd5b610bc99060203d602011610bce575b610bc181836106b3565b81019061072c565b610b2d565b503d610bb7565b6040513d88823e3d90fd5b50906020813d602011610c22575b81610bfb602093836106b3565b81010312610c1e57516001600160a01b0381168103610c1e57906109d1916109c6565b8680fd5b3d9150610bee565b6040513d89823e3d90fd5b634e487b7160e01b87526011600452602487fd5b610c569196505f906106b3565b5f945f610949565b6040513d5f823e3d90fd5b905093610900565b5063b47b2fb160e01b99505f98975050505050505050565b5063b47b2fb160e01b98505f979650505050505050565b90506f7fffffffffffffffffffffffffffffff198114610718575f035f6108a2565b60801d600f0b610896565b5063b47b2fb160e01b97505f9695505050505050565b15610cea57565b60405162461bcd60e51b815260206004820152600360248201526270617960e81b6044820152606490fd5b82158015610df4575b610def576001600160a01b031680610d8457505f80809381935af13d15610d7b573d9067ffffffffffffffff821161069f57604051610d7992610d6b601f8201601f1916602001836106b3565b81525f60203d92013e610ce3565b565b610d7990610ce3565b60405163a9059cbb60e01b81526001600160a01b03929092166004830152602482019290925290602090829060449082905f905af18015610c5e57610d79915f91610dd0575b50610ce3565b610de9915060203d602011610bce57610bc181836106b3565b5f610dca565b505050565b506001600160a01b03821615610d1e56fea2646970667358221220765872aa722082c6b9fb2f68b006c33111ea39b92db1b8acab49cd62c1da414964736f6c6343000825003360e03461011957601f611c7b38819003918201601f19168301916001600160401b0383118484101761011d57808492604094855283398101031261011957610052602061004b83610131565b9201610131565b906001600160a01b038116151580610107575b156100dc5760805260a0523360c052604051611b35908161014682396080518181816101db0152818161085b01528181610b2201528181610ef301528181611860015281816118d20152611a2c015260a05181818161081701528181610a9f01528181610e4d0152611036015260c0518160ab0152f35b606460405162461bcd60e51b81526020600482015260046024820152637a65726f60e01b6044820152fd5b506001600160a01b0382161515610065565b5f80fd5b634e487b7160e01b5f52604160045260245ffd5b51906001600160a01b03821682036101195756fe608080604052600436101561001c575b50361561001a575f80fd5b005b5f3560e01c9081631338aa1d14610c3857508063193cadf61461095c57806332f750ff146108c75780634457d1d81461088a578063481c6a75146108465780637f5a7c7b14610802578063914206311461039757806391dd734614610328578063b0a89d4b146100de5763c45a015514610096575f61000f565b346100da575f3660031901126100da576040517f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03168152602090f35b5f80fd5b60c03660031901126100da576100f2610c88565b6100fa610c9e565b906044359081151582036100da576064359260a4356001600160a01b03811693908490036100da578315158061031f575b8061030f575b156102e2576101d693826101465f9486610e2a565b50505095909385146102cd57506001600160a01b038381169116145b8084146102c75782945b6101768887611556565b604051936002602086015260018060a01b0316604085015260018060a01b03166060840152151560808301528560a083015260c082015260c081526101bc60e082610d48565b604051809481926348c8949160e01b835260048301610cee565b0381837f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03165af19182156102bc575f92610298575b506040828051810103126100da57604060208301519201519060843583106102685783602094831061024b575b505050604051908152f35b6102609261025891610e8d565b903390611704565b828080610240565b60405162461bcd60e51b8152602060048201526008602482015267736c69707061676560c01b6044820152606490fd5b6102b59192503d805f833e6102ad8183610d48565b810190610dc7565b9083610213565b6040513d5f823e3d90fd5b8461016c565b6001600160a01b038481169116149050610162565b60405162461bcd60e51b8152602060048201526005602482015264747261646560d81b6044820152606490fd5b506001600160801b038510610131565b5084151561012b565b346100da5760203660031901126100da5760043567ffffffffffffffff81116100da57366023820112156100da5780600401359067ffffffffffffffff82116100da5736602483830101116100da576103939160246103879201610ef0565b60405191829182610cee565b0390f35b60c03660031901126100da576103ab610c88565b6103b3610c9e565b6044356001600160a01b0381169291908390036100da576064359261ffff84168094036100da5760843560a43592331515806107e1575b6103f390610d6a565b6001600160a01b0390811694169081851415806107d8575b806107cf575b806107c6575b1561079b576040516370a0823160e01b815230600482015290602082602481865afa9182156102bc575f92610766575b506040516323b872dd60e01b815233600482015230602482015260448101919091526020816064815f875af180156102bc57610749575b506040516370a0823160e01b815230600482015290602082602481865afa80156102bc575f90610715575b6104b39250610e8d565b92846105d9576104c4903414610eae565b345b831515806105d0575b156105a35761ffff93600593604051936104e885610d18565b845260208085019788526040808601928352606086019384526080860194855260a08601998a52600160c08701818152335f9081529384905291909220955186546001600160a01b039182166001600160a01b031991821617885599519287018054938216938b1693909317909255915160028601805491909216981697909717909655516003830155516004820155935193018054925162ff000090151560101b1662ffffff199093169190931662ff0000191617179055005b60405162461bcd60e51b8152602060048201526005602482015264656d70747960d81b6044820152606490fd5b508015156104cf565b6105e33415610eae565b6040516370a0823160e01b815230600482015290602082602481895afa9182156102bc575f926106e0575b506040516323b872dd60e01b815233600482015230602482015260448101919091526020816064815f8a5af180156102bc576106b3575b506040516370a0823160e01b815230600482015290602082602481895afa80156102bc575f9061067f575b61067a9250610e8d565b6104c6565b506020823d6020116106ab575b8161069960209383610d48565b810103126100da5761067a9151610670565b3d915061068c565b6106d49060203d6020116106d9575b6106cc8183610d48565b810190610e75565b610645565b503d6106c2565b9091506020813d60201161070d575b816106fc60209383610d48565b810103126100da575190602061060e565b3d91506106ef565b506020823d602011610741575b8161072f60209383610d48565b810103126100da576104b391516104a9565b3d9150610722565b6107619060203d6020116106d9576106cc8183610d48565b61047e565b9091506020813d602011610793575b8161078260209383610d48565b810103126100da5751906020610447565b3d9150610775565b606460405162461bcd60e51b81526020600482015260046024820152633830b4b960e11b6044820152fd5b50831515610417565b50801515610411565b5081151561040b565b50335f525f6020526103f360ff600560405f20015460101c161590506103ea565b346100da575f3660031901126100da576040517f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03168152602090f35b346100da575f3660031901126100da576040517f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03168152602090f35b346100da5760403660031901126100da576103936108b76108a9610c88565b6108b1610c9e565b90610e2a565b9160409593955195869586610cb4565b346100da5760203660031901126100da576001600160a01b036108e8610c88565b165f90815260208181526040918290208054600182015460028301546003840154600485015460059095015487516001600160a01b039586168152938516968401969096529216948101949094526060840152608083015261ffff811660a083015260101c60ff16151560c082015260e090f35b346100da5760203660031901126100da576001600160a01b0361097d610c88565b16805f525f60205260405f20906040519161099783610d18565b80546001600160a01b03908116845260018201548116602085019081526002830154909116604085015260038201546060850190815260048301546080860190815260059093015461ffff811660a0870190815260109190911c60ff16151560c0870181905292939192610a0a90610d6a565b5f8581526020818152604091829020600501805462ff00001916905587518651925163011a412160e61b81526001600160a01b0391821694919093169291826004818b5afa9182156102bc575f92610bf2575b5061ffff905116916040519363027a13c360e01b85526004850152602484015260018060a01b0316604483015260648201526020816084815f60018060a01b037f0000000000000000000000000000000000000000000000000000000000000000165af180156102bc57610bbc575b50905f9291610b1d9560018060a01b039051169260018060a01b039051169151905191604051936001602086015260408501526060840152608083015260a082015260a081526101bc60c082610d48565b0381837f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03165af19182156102bc575f92610ba0575b50602082519281808201948592010103126100da576020915180604051927f22601c5b051c988ec0d097cb9dc0d2e703a3636660e69b6dc5aad9227800fae85f80a38152f35b610bb59192503d805f833e6102ad8183610d48565b9082610b5a565b9291906020843d602011610bea575b81610bd860209383610d48565b810103126100da57919250905f610acc565b3d9150610bcb565b9091506020813d602011610c30575b81610c0e60209383610d48565b810103126100da57516001600160a01b03811681036100da579061ffff610a5d565b3d9150610c01565b346100da5760403660031901126100da57610c6f81610c7d602093610c5e6108a9610c88565b928986999599939293019889610cb4565b03601f198101835282610d48565b519020604051908152f35b600435906001600160a01b03821682036100da57565b602435906001600160a01b03821682036100da57565b6001600160a01b039182168152918116602083015262ffffff909216604082015260029290920b6060830152909116608082015260a00190565b602060409281835280519182918282860152018484015e5f828201840152601f01601f1916010190565b60e0810190811067ffffffffffffffff821117610d3457604052565b634e487b7160e01b5f52604160045260245ffd5b90601f8019910116810190811067ffffffffffffffff821117610d3457604052565b15610d7157565b606460405162461bcd60e51b81526020600482015260046024820152631a195b1960e21b6044820152fd5b908160209103126100da575190565b67ffffffffffffffff8111610d3457601f01601f191660200190565b6020818303126100da5780519067ffffffffffffffff82116100da570181601f820112156100da57805190610dfb82610dab565b92610e096040519485610d48565b828452602083830101116100da57815f9260208093018386015e8301015290565b9091906001600160a01b038084169082161015610e6f575b9190610bb890603c907f000000000000000000000000000000000000000000000000000000000000000090565b91610e42565b908160209103126100da575180151581036100da5790565b91908203918211610e9a57565b634e487b7160e01b5f52601160045260245ffd5b15610eb557565b60405162461bcd60e51b815260206004820152600560248201526476616c756560d81b6044820152606490fd5b359060ff821682036100da57565b907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690606090338390036114d557839081010390602082126100da5760ff610f4085610ee2565b1690600182146111a95750600214610f805760405162461bcd60e51b815260206004820152600660248201526530b1ba34b7b760d11b6044820152606490fd5b60c0136100da57610f9082610ee2565b50610f9d60208301611504565b91610faa60408201611504565b926060820135908115158083036100da57610fcc60a060808601359501611504565b6001600160a01b039283169690831694921691831561118e576401000276a4955b600160ff1b8214610e9a576020925f61014492604051998a95869463314b031f60e01b86528d6004870152896024870152610bb86044870152603c606487015260018060a01b037f000000000000000000000000000000000000000000000000000000000000000016608487015260a4860152830360c485015260018060a01b031660e4840152610120610104840152816101248401525af19384156102bc575f9461115a575b508360801d600f0b93600f0b92825f146111535783955b5f87600f0b1315611128576110cb926110c683888894611811565b611811565b1561112157505b5f81600f0b125f1461111a576110ef6001600160801b0391611536565b165b6001600160801b0360405192166020830152604082015260408152611117606082610d48565b90565b505f6110f1565b90506110d2565b60405162461bcd60e51b81526020600482015260036024820152621bdd5d60ea1b6044820152606490fd5b84956110ab565b9093506020813d602011611186575b8161117660209383610d48565b810103126100da5751925f611094565b3d9150611169565b73fffd8963efd1fc6a506488495d951d5263988d2595610fed565b92939160a09150126100da576111be81610ee2565b506111cb60208201611504565b916111d860408301611504565b60808301359392820135926001600160a01b0390811692916111fb911683610e2a565b939891979096929593949391926001600160a01b038a16908184036114cf5780925b6001600160a01b0389169485036114c75750915b61125861123d82611ab7565b61124685611ab7565b6112518215156117dd565b881b611518565b640100ad139c8111806114aa575b61126f906117dd565b604051630e84bf8f60e11b8152600481018490526024810186905262ffffff8c166044820181905260028c900b606483018190526001600160a01b038b811660848501819052941660a48401819052919993969094909280808b5a925f60c492602095f180156102bc57611471575b5081810290808204831490151715610e9a578290841c931b91808304600160601b1490151715610e9a5761131191611518565b808210156114695750945b85151580611458575b1561142757604095610164945f938851998a98899763292e32af60e21b895260048901526024880152604487015260648601526084850152620d89b31960a4850152620d89b460c485015260e484015281610104840152610140610124840152816101448401525af19081156102bc575f916113f1575b50906113d6936113c5610c6f936113ba308260801d600f0b8b611811565b3090600f0b86611811565b604051958694602086019889610cb4565b51902060405190602082015260208152611117604082610d48565b9190506040823d60401161141f575b8161140d60409383610d48565b810103126100da5790516113d661139c565b3d9150611400565b60405162461bcd60e51b81526020600482015260096024820152686c697175696469747960b81b6044820152606490fd5b506001600160801b03861115611325565b90509461131c565b6020813d6020116114a2575b8161148a60209383610d48565b810103126100da57518060020b8103156112de575f80fd5b3d915061147d565b5073ff53611968f1e5ca45cfca7918447e7f5776f6d48110611266565b905091611231565b8261121d565b60405162461bcd60e51b815260206004820152600760248201526636b0b730b3b2b960c91b6044820152606490fd5b35906001600160a01b03821682036100da57565b8115611522570490565b634e487b7160e01b5f52601260045260245ffd5b600f0b6f7fffffffffffffffffffffffffffffff198114610e9a575f0390565b6001600160a01b031680156116c15761156f3415610eae565b6040516370a0823160e01b8152306004820152602081602481855afa9081156102bc575f9161168f575b506040516323b872dd60e01b815233600482015230602482015260448101849052916020836064815f855af19081156102bc57602493602092611674575b506040516370a0823160e01b815230600482015293849182905afa80156102bc575f90611640575b6116099250610e8d565b0361161057565b60405162461bcd60e51b81526020600482015260086024820152671c9958d95a5d995960c21b6044820152606490fd5b506020823d60201161166c575b8161165a60209383610d48565b810103126100da5761160991516115ff565b3d915061164d565b61168a90833d85116106d9576106cc8183610d48565b6115d7565b90506020813d6020116116b9575b816116aa60209383610d48565b810103126100da57515f611599565b3d915061169d565b506116cd903414610eae565b565b156116d657565b60405162461bcd60e51b81526020600482015260066024820152651c99599d5b9960d21b6044820152606490fd5b821580156117cc575b6117c7576001600160a01b03168061175c57505f80806116cd9481945af13d15611757573d61173b81610dab565b906117496040519283610d48565b81525f60203d92013e6116cf565b6116cf565b60405163a9059cbb60e01b81526001600160a01b03929092166004830152602482019290925290602090829060449082905f905af180156102bc576116cd915f916117a8575b506116cf565b6117c1915060203d6020116106d9576106cc8183610d48565b5f6117a2565b505050565b506001600160a01b0382161561170d565b156117e457565b60405162461bcd60e51b8152602060048201526005602482015264707269636560d81b6044820152606490fd5b905f9281600f0b5f81125f14611a1a5750506118346001600160801b0391611536565b16906001600160a01b0316806118d05750604051630476982d60e21b81529190602090839060049082907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03165af19081156118c457506118995750565b6118ba9060203d6020116118bd575b6118b28183610d48565b810190610d9c565b50565b503d6118a8565b604051903d90823e3d90fd5b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b038116929190833b15611a0b57604051632961046560e21b815260048101839052858160248183895af18015611a0f579086916119f6575b5060405163a9059cbb60e01b81526001600160a01b0392909216600483015260248201939093529160209183916044918391905af19081156119eb5783916119cc575b50156119a15760208291600460405180958193630476982d60e21b83525af19081156118c457506118995750565b606460405162461bcd60e51b815260206004820152600460248201526373796e6360e01b6044820152fd5b6119e5915060203d6020116106d9576106cc8183610d48565b5f611973565b6040513d85823e3d90fd5b81611a0091610d48565b611a0b57845f611930565b8480fd5b6040513d88823e3d90fd5b5f919293945013611a2a57505050565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316803b156100da57604051630b0d9c0960e01b81526001600160a01b0394851660048201529190931660248201526001600160801b03919091166044820152905f908290606490829084905af180156102bc57611aad5750565b5f6116cd91610d48565b908115611afa5760018201808311610e9a5760011c825b838210611ad9575050565b90925082611ae78183611518565b908101809111610e9a5760011c90611ace565b5f915056fea2646970667358221220ed27d92654d1c0298e56be2cfcc20299a74bc83be734daea98c8b1468dcf66b064736f6c63430008250033";
function cloneTarget(code) {
	const c = code.toLowerCase();
	if (!c.startsWith("0x363d3d373d3d3d363d73") || !c.endsWith("5af43d82803e903d91602b57fd5bf3")) return null;
	if (c.length !== 92) return null;
	return `0x${c.slice(22, 62)}`;
}
function sameCode(a, b) {
	return a.toLowerCase() === b.toLowerCase();
}
/** Factory runtime embeds immutable implementation addresses where the artifact still has zeros. */
function sameFactoryCode(live, expected) {
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
function unwrap(items) {
	return items.map((item, index) => {
		if (!item || item.error) {
			const message = item?.error?.message || `Robinhood RPC call ${index + 1} failed.`;
			throw new Error(message.replace("execution reverted: ", "").replace("execution reverted", "The contract rejected the call."));
		}
		return item.result;
	});
}
function pick(value, index, name) {
	if (Array.isArray(value)) return value[index];
	if (value && typeof value === "object") {
		const record = value;
		if (name && name in record) return record[name];
		if (String(index) in record) return record[index];
	}
	throw new Error("Robinhood Chain returned an unexpected value.");
}
function asHex(value, label) {
	if (typeof value !== "string" || !value.startsWith("0x")) throw new Error(`Missing ${label} from Robinhood Chain.`);
	return value;
}
async function batch(relay, calls) {
	return relay(calls);
}
async function readChain(relay) {
	const [chainId, block, gas] = await batch(relay, [
		{
			method: "eth_chainId",
			params: []
		},
		{
			method: "eth_blockNumber",
			params: []
		},
		{
			method: "eth_gasPrice",
			params: []
		}
	]);
	const id = Number(chainId);
	if (id !== 4663) throw new Error(`Connected RPC is chain ${id || "unknown"}, not Robinhood mainnet (${CHAIN_ID}).`);
	return {
		chainId: id,
		block: BigInt(String(block)),
		gas: BigInt(String(gas))
	};
}
function call(to, data) {
	return {
		method: "eth_call",
		params: [{
			to,
			data
		}, "latest"]
	};
}
async function readFactory(relay, factory) {
	const [code, chainId] = await batch(relay, [{
		method: "eth_getCode",
		params: [factory, "latest"]
	}, {
		method: "eth_chainId",
		params: []
	}]);
	if (Number(chainId) !== 4663) throw new Error("RPC is not Robinhood Chain mainnet.");
	if (!sameFactoryCode(String(code), "0x60806040526004361015610011575f80fd5b5f3560e01c80630a9d793d146100f457806316f0115b146100ef5780631f82194f146100ea57806327cca59f146100e55780632f3a3d5d146100e05780633d4e2994146100db57806354fd4d50146100d65780637f5a7c7b146100d157806383bc0bf1146100cc57806389035730146100c75780638ce74426146100c25780639ccfbccf146100bd5780639ec5a894146100b85763d7b96d4e146100b3575f80fd5b610815565b6107d1565b6106fd565b610597565b610524565b6104e0565b61049c565b61044c565b61033f565b6102ef565b6102d2565b61021a565b6101d6565b61010e565b6001600160a01b0381160361010a57565b5f80fd5b3461010a57602036600319011261010a5760043561012b816100f9565b5f546001600160a01b0316330361019c576001600160a01b0381169061017690610156831515610859565b60018060a01b03166bffffffffffffffffffffffff60a01b5f5416175f55565b7f90ed2f900bebee953d2681b0d058f80fd7ddec64c41a29669b22dbe3618687965f80a2005b60405162461bcd60e51b81526020600482015260086024820152671c1c9bdd1bd8dbdb60c21b6044820152606490fd5b5f91031261010a57565b3461010a575f36600319011261010a576040517f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03168152602090f35b602036600319011261010a576004356001600160401b03811161010a57610160600319823603011261010a575f549060ff8260a01c166102a05760ff60a01b19909116600160a01b175f5561027190600401610f7c565b5f805460ff60a01b19169055604080516001600160a01b039384168152929091166020830152819081015b0390f35b60405162461bcd60e51b815260206004820152600a6024820152697265656e7472616e637960b01b6044820152606490fd5b3461010a575f36600319011261010a576020600154604051908152f35b3461010a575f36600319011261010a576040517f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03168152602090f35b61ffff81160361010a57565b3461010a57604036600319011261010a5760043561271061038f61ffff60243561036881610333565b61037a6509184e72a00086101561093b565b1661038961012c821115610898565b8361153b565b04606482029180830460641481151715610423576103d36103ce6103ec926103c9610408956103c361029c98612710900490565b9261159e565b61159e565b6115ab565b72434327d0ca15db54731cf010b3f0000000000061154e565b6104036b033b2e3c9fd0803ce800000082106115c7565b61156c565b6104138115156115fd565b6040519081529081906020820190565b611527565b805180835260209291819084018484015e5f828201840152601f01601f1916010190565b3461010a575f36600319011261010a5761029c60405161046d604082610a0c565b600e81526d736b796c61756e63687061642d3760901b6020820152604051918291602083526020830190610428565b3461010a575f36600319011261010a576040517f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03168152602090f35b3461010a575f36600319011261010a576040517f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03168152602090f35b3461010a575f36600319011261010a576101006040516601c6bf526340008152673a4965bf58a4000060208201526714d1120d7b16000060408201526b033b2e3c9fd0803ce8000000606082015260646080820152611b5860a08201526509184e72a00060c082015261012c60e0820152f35b3461010a575f36600319011261010a575f546040516001600160a01b039091168152602090f35b602081016020825282518091526040820191602060408360051b8301019401925f915b8383106105f057505050505090565b9091929394602080600192603f1985820301865288519061061981835160018060a01b03169052565b818301516001600160a01b0316818401526040828101516001600160a01b0316908201526101a08061068661067461066260608701516101c060608801526101c0870190610428565b60808701518682036080880152610428565b60a086015185820360a0870152610428565b60c0808601516001600160401b0316908501529360e081015160e08501526101008101516101008501526101208101516101208501526101408101516101408501526101608101516101608501526106e961018082015161018086019015159052565b0151910152970193019301919392906105e1565b3461010a57602036600319011261010a57600154600435602881116107c9575b8181116107c2575b61072e8161162f565b9161073c6040519384610a0c565b818352601f1961074b8361162f565b015f5b8181106107ab5750505f5b82811061076e576040518061029c86826105be565b8061078f6107896107846001946103c987611590565b610c5e565b50611ad1565b61079982876116ae565b526107a481866116ae565b5001610759565b6020906107b6611646565b8282880101520161074e565b5080610725565b50602861071d565b3461010a575f36600319011261010a576040517f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03168152602090f35b3461010a575f36600319011261010a576040517f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03168152602090f35b1561086057565b606460405162461bcd60e51b81526020600482015260046024820152637a65726f60e01b6044820152fd5b3561089581610333565b90565b1561089f57565b60405162461bcd60e51b81526020600482015260036024820152620e8c2f60eb1b6044820152606490fd5b903590601e198136030182121561010a57018035906001600160401b03821161010a57602001918160051b3603831361010a57565b1561090657565b606460405162461bcd60e51b81526020600482015260046024820152637465616d60e01b6044820152fd5b35610895816100f9565b1561094257565b60405162461bcd60e51b815260206004820152600360248201526236b4b760e91b6044820152606490fd5b1561097457565b60405162461bcd60e51b81526020600482015260096024820152686d696e546f6b656e7360b81b6044820152606490fd5b903590601e198136030182121561010a57018035906001600160401b03821161010a5760200191813603831361010a57565b634e487b7160e01b5f52604160045260245ffd5b6101c081019081106001600160401b03821117610a0757604052565b6109d7565b90601f801991011681019081106001600160401b03821117610a0757604052565b908060209392818452848401375f828201840152601f01601f1916010190565b93610a6a60409492610a7894989798606088526060880191610a2d565b918583036020870152610a2d565b6001600160a01b03909416910152565b6040513d5f823e3d90fd5b903590609e198136030182121561010a570190565b809d9b99966108959f9d999396610aea610b149a96610b0698610b229f9a610af897610adc9160e0895260e0890191610a2d565b918683036020880152610a2d565b926040818503910152610a2d565b8c810360608e015291610a2d565b9189830360808b0152610a2d565b9186830360a0880152610a2d565b9260c0818503910152610a2d565b6001600160a01b0391821681529181166020808401919091529216604082015261010060608201819052979998979096949193919261ffff92610b7592890191610a2d565b9116608086015284810360a08601528281520191905f5b818110610bc0575050506001600160a01b0390941660c0820152610bbe919060e0906001600160a01b03909216910152565b565b9091926020806001928635610bd4816100f9565b848060a01b031681520194019101919091610b8c565b60405190610bbe60e083610a0c565b6001600160401b038111610a0757601f01601f191660200190565b929192610c2082610bf9565b91610c2e6040519384610a0c565b82948184528183011161010a578281602093845f960137010152565b634e487b7160e01b5f52603260045260245ffd5b600154811015610c7a5760015f52600760205f20910201905f90565b610c4a565b8054821015610c7a575f52600760205f20910201905f90565b90600182811c92168015610cc6575b6020831014610cb257565b634e487b7160e01b5f52602260045260245ffd5b91607f1691610ca7565b919091601f8311610ce1575b505050565b818311610ced57505050565b5f5260205f206020601f830160051c9210610d26575b81601f9101920160051c03905f5b82811015610cdc575f82820155600101610d11565b5f9150610d03565b91909182516001600160401b038111610a0757610d5581610d4f8454610c98565b84610cd0565b6020601f8211600114610d94578190610d859394955f92610d89575b50508160011b915f199060031b1c19161790565b9055565b015190505f80610d71565b601f19821690610da7845f5260205f2090565b915f5b818110610de157509583600195969710610dc9575b505050811b019055565b01515f1960f88460031b161c191690555f8080610dbf565b9192602060018192868b015181550194019201610daa565b60015468010000000000000000811015610a0757806001610e1f92016001556001610c7f565b610ed757815181546001600160a01b03199081166001600160a01b03928316178355602084015160018401805483169184169190911790556040840151600284018054919093169116179055610bbe91600690610eba9060c090610e8a606082015160038701610d2e565b610e9b608082015160048701610d2e565b610eac60a082015160058701610d2e565b01516001600160401b031690565b9101906001600160401b03166001600160401b0319825416179055565b634e487b7160e01b5f525f60045260245ffd5b9081602091031261010a575190565b3d15610f23573d90610f0a82610bf9565b91610f186040519384610a0c565b82523d5f602084013e565b606090565b15610f2f57565b60405162461bcd60e51b81526020600482015260076024820152666665652070617960c81b6044820152606490fd5b94929093610adc6108959795610aea94606089526060890191610a2d565b90610f9a61012c61ffff610f9260e0860161088b565b161115610898565b610120820190610fb86008610faf84866108ca565b905011156108ff565b610fc460a08401610931565b610fd360c085013580926116f4565b928361151057610fe86101408601351561096d565b6110117f0000000000000000000000000000000000000000000000000000000000000000611771565b9461101c81806109a5565b60208301929161102c84846109a5565b926001600160a01b038b163b1561010a5761105f5f9360405195869485946303bf912560e11b8652309360048701610a4d565b0381836001600160a01b038d165af18015611463576114fc575b5061108760408201826109a5565b61109460608401846109a5565b8a60808695939501866110b06110aa8383610a93565b806109a5565b906110c86110be8585610a93565b60208101906109a5565b906110e06110d68787610a93565b60408101906109a5565b9490936111126111086111006110f68b8b610a93565b60608101906109a5565b9a9099610a93565b60808101906109a5565b9a90996001600160a01b03163b1561010a576040519d8e9d8e63d9f1463160e01b81526004019d6111429e610aa8565b6001600160a01b038a1691839103815a5f948591f18015611463576114e8575b5061118c7f0000000000000000000000000000000000000000000000000000000000000000611771565b5f5490966001600160a01b03808916959192166111ac60608501856109a5565b9190926111c56111be60e0880161088b565b91876108ca565b6111d460a08996939601610931565b6111e16101008a01610931565b918b3b1561010a578f94965f9761120f956040519a8b998a996309a8164d60e21b8b52339060048c01610b30565b038183895af18015611463576114d4575b506001600160a01b0388163b1561010a5760405163b0dbfa8b60e01b81526001600160a01b0388166004820152945f8680602481010381836001600160a01b038e165af19586156114635789966114ba575b50611317866112fe8a6112d96112f2886112ac6112e68c61129f61129685806109a5565b919092866109a5565b94909560608101906109a5565b9790986112c96112ba610bea565b6001600160a01b03909d168d52565b6001600160a01b031660208c0152565b3360408b01523691610c14565b60608801523691610c14565b60808501523691610c14565b60a0820152426001600160401b031660c0820152610df9565b6001600160a01b0361132b60a08501610931565b166114685750806113d0575b507fd9f66ed4b10e1813b91ce2e8fce88ef9e3263a3d1fdc3c2ef92346ccd2bd69f8905b61138a5f8080806601c6bf5263400061137a825460018060a01b031690565b5af1611384610ef9565b50610f28565b6113a66113cb6113b361139d84806109a5565b939096856109a5565b91909460608101906109a5565b91604051958695339b60018060a01b03169987610f5e565b0390a4565b60405163cce7ec1360e01b81523360048201526101408301356024820152945060209085906044908290875af19081156114635787947fd9f66ed4b10e1813b91ce2e8fce88ef9e3263a3d1fdc3c2ef92346ccd2bd69f892611434575b5090611337565b6114559060203d60201161145c575b61144d8183610a0c565b810190610eea565b505f61142d565b503d611443565b610a88565b7fd9f66ed4b10e1813b91ce2e8fce88ef9e3263a3d1fdc3c2ef92346ccd2bd69f89291611496575b5061135b565b6114b4906114a660a08401610931565b908961014085013592611848565b5f611490565b806114c85f6114ce93610a0c565b806101cc565b5f611272565b806114c85f6114e293610a0c565b5f611220565b806114c85f6114f693610a0c565b5f611162565b806114c85f61150a93610a0c565b5f611079565b6115226509184e72a00085101561093b565b610fe8565b634e487b7160e01b5f52601160045260245ffd5b8181029291811591840414171561042357565b8115611558570490565b634e487b7160e01b5f52601260045260245ffd5b6b033b2e3c9fd0803ce800000003906b033b2e3c9fd0803ce8000000821161042357565b5f1981019190821161042357565b9190820391821161042357565b6714d1120d7b1600000190816714d1120d7b1600001161042357565b156115ce57565b60405162461bcd60e51b81526020600482015260076024820152667265736572766560c81b6044820152606490fd5b1561160457565b606460405162461bcd60e51b8152602060048201526004602482015263191d5cdd60e21b6044820152fd5b6001600160401b038111610a075760051b60200190565b60405190611653826109eb565b5f6101a08382815282602082015282604082015260608082015260606080820152606060a08201528260c08201528260e082015282610100820152826101208201528261014082015282610160820152826101808201520152565b8051821015610c7a5760209160051b010190565b156116c957565b60405162461bcd60e51b815260206004820152600360248201526266656560e81b6044820152606490fd5b6001600160a01b031615611714576108956601c6bf5263400034146116c2565b6117276601c6bf526340003410156116c2565b611740576601c6bf52633fff1934013481116104235790565b60405162461bcd60e51b8152602060048201526009602482015268189d5e505b5bdd5b9d60ba1b6044820152606490fd5b604051733d602d80600a3d3981f3363d3d373d3d3d363d7360601b815260609190911b60148201526e5af43d82803e903d91602b57fd5bf360881b60288201526037905ff0906001600160a01b038216156117c857565b60405162461bcd60e51b8152602060048201526005602482015264636c6f6e6560d81b6044820152606490fd5b5190811515820361010a57565b9081602091031261010a57610895906117f5565b1561181d57565b606460405162461bcd60e51b81526020600482015260046024820152631c1d5b1b60e21b6044820152fd5b6040516370a0823160e01b81526001600160a01b0383811660048301529094911692909190602085602481875afa948515611463575f956119d3575b506040516323b872dd60e01b81523360048201526001600160a01b0383166024820152604481019190915260208180606481015b03815f885af18015611463576118d5915f916119a4575b50611816565b6040516370a0823160e01b81526001600160a01b038216600482015292602090849060249082905afa928315611463576119529460209461191d925f91611987575b5061159e565b6040516369dd567f60e01b815233600482015260248101919091526044810192909252909283919082905f9082906064820190565b03926001600160a01b03165af180156114635761196c5750565b6119849060203d60201161145c5761144d8183610a0c565b50565b61199e9150863d881161145c5761144d8183610a0c565b5f611917565b6119c6915060203d6020116119cc575b6119be8183610a0c565b810190611802565b5f6118cf565b503d6119b4565b6118b89195506119f1602091823d841161145c5761144d8183610a0c565b959150611884565b908160e091031261010a5780519160208201519160408101519160608201519160808101519160c0611a2d60a084016117f5565b92015190565b9060405191825f825492611a4684610c98565b8084529360018116908115611aaf5750600114611a6b575b50610bbe92500383610a0c565b90505f9291925260205f20905f915b818310611a93575050906020610bbe928201015f611a5e565b6020919350806001915483858901015201910190918492611a7a565b905060209250610bbe94915060ff191682840152151560051b8201015f611a5e565b90611ada611646565b600183015460405163801f396160e01b815291936001600160a01b039091169160e081600481865afa918215611463575f5f5f905f925f948a5f975f99611bfc575b50600682611b79611bbd93611b62611bf49d9e611b52611b45611bcd995460018060a01b031690565b6001600160a01b03168452565b6001600160a01b03166020830152565b60028301546001600160a01b031660409190910152565b8d6060611b8860038401611a33565b9101528d6080611b9a60048401611a33565b9101528d60a0611bac60058401611a33565b91015201546001600160401b031690565b6001600160401b031660c08c0152565b60e08a01526101008901526101208801526101408701526101608601521515610180850152565b6101a0830152565b611bf49950611bbd985060069750611b629650611c3d919550611b799450611bcd92935060e03d60e011611c54575b611c358183610a0c565b8101906119f9565b9d509b509990985090969195509193925090611b1c565b503d611c2b56fea26469706673582212208a1b87009cf547e3d3f06a82ee3bd8d8e3930d5b088ce09dc547694aa455b19c64736f6c63430008250033")) throw new Error("That address is not the SkyLaunchpad V4 factory from this build. Deploy the new factory. The old one cannot be upgraded.");
	const versionData = encodeFunctionData({
		abi: factoryAbi,
		functionName: "version",
		args: []
	});
	const paramData = encodeFunctionData({
		abi: factoryAbi,
		functionName: "parameters",
		args: []
	});
	const tokenImplData = encodeFunctionData({
		abi: factoryAbi,
		functionName: "tokenImplementation",
		args: []
	});
	const curveImplData = encodeFunctionData({
		abi: factoryAbi,
		functionName: "curveImplementation",
		args: []
	});
	const protocolData = encodeFunctionData({
		abi: factoryAbi,
		functionName: "protocol",
		args: []
	});
	const hookData = encodeFunctionData({
		abi: factoryAbi,
		functionName: "hook",
		args: []
	});
	const poolData = encodeFunctionData({
		abi: factoryAbi,
		functionName: "pool",
		args: []
	});
	const rewardsData = encodeFunctionData({
		abi: factoryAbi,
		functionName: "rewards",
		args: []
	});
	const lockerData = encodeFunctionData({
		abi: factoryAbi,
		functionName: "locker",
		args: []
	});
	const countData = encodeFunctionData({
		abi: factoryAbi,
		functionName: "launchCount",
		args: []
	});
	const newestData = encodeFunctionData({
		abi: factoryAbi,
		functionName: "newest",
		args: [40n]
	});
	const [versionR, paramsR, tokenImplR, curveImplR, protocolR, hookR, poolR, rewardsR, lockerR, countR, newestR] = await batch(relay, [
		call(factory, versionData),
		call(factory, paramData),
		call(factory, tokenImplData),
		call(factory, curveImplData),
		call(factory, protocolData),
		call(factory, hookData),
		call(factory, poolData),
		call(factory, rewardsData),
		call(factory, lockerData),
		call(factory, countData),
		call(factory, newestData)
	]);
	const version = decodeFunctionResult({
		abi: factoryAbi,
		functionName: "version",
		data: asHex(versionR, "version")
	});
	if (version !== "skylaunchpad-7") throw new Error(`Factory version is ${version}, this app expects ${VERSION}.`);
	const params = decodeFunctionResult({
		abi: factoryAbi,
		functionName: "parameters",
		data: asHex(paramsR, "parameters")
	});
	if ([
		0,
		1,
		2,
		3,
		4,
		5,
		6
	].map((index) => pick(params, index)).some((value, i) => value !== EXPECTED_PARAMS[i])) throw new Error("Factory economics don't match this app. Refusing to list markets.");
	const tokenImplementation = decodeFunctionResult({
		abi: factoryAbi,
		functionName: "tokenImplementation",
		data: asHex(tokenImplR, "token implementation")
	});
	const curveImplementation = decodeFunctionResult({
		abi: factoryAbi,
		functionName: "curveImplementation",
		data: asHex(curveImplR, "curve implementation")
	});
	const [tokenCode, curveCode] = await batch(relay, [{
		method: "eth_getCode",
		params: [tokenImplementation, "latest"]
	}, {
		method: "eth_getCode",
		params: [curveImplementation, "latest"]
	}]);
	if (!sameCode(String(tokenCode), "0x60806040526004361015610011575f80fd5b5f3560e01c806306fdde0314611ba4578063077f224a146116cb578063095ea7b31461165257806318160ddd1461163557806323b872dd14611558578063313ce5671461153d57806353cd512a1461111e57806370a08231146110e65780637165485d146110be5780637284e4161461101957806395d89b4114610f74578063a9059cbb14610f43578063b0dbfa8b14610e47578063c45a015514610e1f578063d9f146311461020a578063dd62ed3e146101ba5763fb7f21eb146100d4575f80fd5b346101b6575f3660031901126101b6576040515f6005546100f481611c46565b80845290600181169081156101925750600114610134575b6101308361011c81850382611c99565b604051918291602083526020830190611cba565b0390f35b60055f9081527f036b6384b5eca791c62761152d0c79bb0604c104a5fb6f4eb0703f3154bb3db0939250905b8082106101785750909150810160200161011c61010c565b919260018160209254838588010152019101909291610160565b60ff191660208086019190915291151560051b8401909101915061011c905061010c565b5f80fd5b346101b65760403660031901126101b6576101d3611d0b565b6101db611d21565b6001600160a01b039182165f908152600d60209081526040808320949093168252928352819020549051908152f35b346101b65760e03660031901126101b6576004356001600160401b0381116101b65761023a903690600401611cde565b6024356001600160401b0381116101b657610259903690600401611cde565b926044356001600160401b0381116101b657610279903690600401611cde565b6064939193356001600160401b0381116101b65761029b903690600401611cde565b6084356001600160401b0381116101b6576102ba903690600401611cde565b96909360a4356001600160401b0381116101b6576102dc903690600401611cde565b9a909660c4356001600160401b0381116101b6576102fe903690600401611cde565b9b909961031660018060a01b03600354163314611d37565b60045460ff8160a81c16610df45760a08311610dc957608c8511610d9e5760308611610d745760308811610d4a5760308d11610d205760308f11610cf55760308e11610ccb5760ff60a81b1916600160a81b176004556001600160401b03821161071657610385600554611c46565b601f8111610c5c575b505f90601f8311600114610bd9576103bd92915f9183610bce575b50508160011b915f199060031b1c19161790565b6005555b6001600160401b038211610716576103da600654611c46565b601f8111610b60575b505f90601f8311600114610ac357946104416104599561043a9c9b999561042c8661044a976104689c976104779f9c5f92610ab85750508160011b915f199060031b1c19161790565b6006555b6040519d8e611c7e565b3691611d6d565b8b523691611d6d565b96602089019788523691611d6d565b97604087019889523691611d6d565b94606085019586523691611d6d565b9160808101928352518051906001600160401b0382116107165761049c600754611c46565b601f8111610a4a575b50602090601f83116001146109c7576104d492915f91836109bc5750508160011b915f199060031b1c19161790565b6007555b519283516001600160401b038111610716576104f5600854611c46565b601f811161094e575b50602094601f82116001146108eb576105309293949582915f926108e05750508160011b915f199060031b1c19161790565b6008555b519182516001600160401b03811161071657610551600954611c46565b601f8111610872575b506020601f821160011461080f57819061058a9394955f926108045750508160011b915f199060031b1c19161790565b6009555b519081516001600160401b038111610716576105ab600a54611c46565b601f8111610796575b50602092601f8211600114610735576105e4929382915f9261072a5750508160011b915f199060031b1c19161790565b600a555b5180516001600160401b03811161071657610604600b54611c46565b601f81116106a8575b50602091601f821160011461064b5761063b925f91836106405750508160011b915f199060031b1c19161790565b600b55005b0151905083806103a9565b601f19821692600b5f52805f20915f5b85811061069057508360019510610678575b505050811b01600b55005b01515f1960f88460031b161c1916905582808061066d565b9192602060018192868501518155019401920161065b565b8181111561060d57600b5f52601f820160051c7f0175b7a638427703f0dbe7bb9bbf987a2551717b34e79f33b5b1008d1fa01db96020841061070e575b81601f9101920160051c03905f5b82811061070157505061060d565b5f828201556001016106f3565b5f91506106e5565b634e487b7160e01b5f52604160045260245ffd5b0151905084806103a9565b601f19821693600a5f52805f20915f5b86811061077e5750836001959610610766575b505050811b01600a556105e8565b01515f1960f88460031b161c19169055838080610758565b91926020600181928685015181550194019201610745565b818111156105b457600a5f52601f820160051c7fc65a7bb8d6351c1cf70c95a316cc6a92839c986682d98bc35f958f4883f9d2a8602084106107fc575b81601f9101920160051c03905f5b8281106107ef5750506105b4565b5f828201556001016107e1565b5f91506107d3565b0151905085806103a9565b601f1982169060095f52805f20915f5b81811061085a57509583600195969710610842575b505050811b0160095561058e565b01515f1960f88460031b161c19169055848080610834565b9192602060018192868b01518155019401920161081f565b8181111561055a5760095f52601f820160051c7f6e1540171b6c0c960b71a7020d9f60077f6af931a8bbf590da0223dacf75c7af602084106108d8575b81601f9101920160051c03905f5b8281106108cb57505061055a565b5f828201556001016108bd565b5f91506108af565b0151905086806103a9565b601f1982169560085f52805f20915f5b8881106109365750836001959697981061091e575b505050811b01600855610534565b01515f1960f88460031b161c19169055858080610910565b919260206001819286850151815501940192016108fb565b818111156104fe5760085f52601f820160051c7ff3f7a9fe364faab93b216da50a3214154f22a0a2b415b23a84c8169e8b636ee3602084106109b4575b81601f9101920160051c03905f5b8281106109a75750506104fe565b5f82820155600101610999565b5f915061098b565b0151905087806103a9565b90601f1983169160075f527fa66cc928b5edb82af9bd49922954155ab7b0942694bea4ce44661d9a8736c688925f5b818110610a325750908460019594939210610a1a575b505050811b016007556104d8565b01515f1960f88460031b161c19169055868080610a0c565b929360206001819287860151815501950193016109f6565b828111156104a55760075f52601f830160051c7fa66cc928b5edb82af9bd49922954155ab7b0942694bea4ce44661d9a8736c68860208510610ab0575b81601f9101920160051c03905f5b828110610aa35750506104a5565b5f82820155600101610a95565b5f9150610a87565b013590505f806103a9565b601f1983169160065f527ff652222313e28459528d920b65115c16c04f3efc82aaedc97be59f3f377c0d3f925f5b818110610b4857509561043a9c9b99956001866104689b966104779e9b966104419661044a9a6104599d10610b2f575b505050811b01600655610430565b01355f19600384901b60f8161c191690555f8080610b21565b91936020600181928787013581550195019201610af1565b828111156103e35760065f52601f830160051c7ff652222313e28459528d920b65115c16c04f3efc82aaedc97be59f3f377c0d3f60208510610bc6575b81601f9101920160051c03905f5b828110610bb95750506103e3565b5f82820155600101610bab565b5f9150610b9d565b013590508f806103a9565b601f1983169160055f527f036b6384b5eca791c62761152d0c79bb0604c104a5fb6f4eb0703f3154bb3db0925f5b818110610c445750908460019594939210610c2b575b505050811b016005556103c1565b01355f19600384901b60f8161c191690558e8080610c1d565b91936020600181928787013581550195019201610c07565b8281111561038e5760055f819052601f8401901c7f036b6384b5eca791c62761152d0c79bb0604c104a5fb6f4eb0703f3154bb3db060208510610cc3575b81601f9101920160051c03905f5b828110610cb657505061038e565b5f82820155600101610ca8565b5f9150610c9a565b60405162461bcd60e51b8152602060048201526002602482015261666360f01b6044820152606490fd5b60405162461bcd60e51b81526020600482015260036024820152623bb2b160e91b6044820152606490fd5b60405162461bcd60e51b8152602060048201526002602482015261646360f01b6044820152606490fd5b60405162461bcd60e51b8152602060048201526002602482015261746760f01b6044820152606490fd5b60405162461bcd60e51b8152602060048201526002602482015261747760f01b6044820152606490fd5b606460405162461bcd60e51b81526020600482015260046024820152636465736360e01b6044820152fd5b606460405162461bcd60e51b81526020600482015260046024820152636c6f676f60e01b6044820152fd5b606460405162461bcd60e51b81526020600482015260046024820152636d65746160e01b6044820152fd5b346101b6575f3660031901126101b6576003546040516001600160a01b039091168152602090f35b346101b65760203660031901126101b657610e60611d0b565b610e7560018060a01b03600354163314611d37565b600454906001600160a01b038216610f16576001600160a01b0316908190610e9e821515611e3e565b6bffffffffffffffffffffffff60a01b16176004556b033b2e3c9fd0803ce8000000600255805f52600c6020526b033b2e3c9fd0803ce800000060405f20555f7fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60206040516b033b2e3c9fd0803ce80000008152a3005b60405162461bcd60e51b8152602060048201526005602482015264189bdd5b9960da1b6044820152606490fd5b346101b65760403660031901126101b657610f69610f5f611d0b565b6024359033611e70565b602060405160018152f35b346101b6575f3660031901126101b6576040515f600154610f9481611c46565b80845290600181169081156101925750600114610fbb576101308361011c81850382611c99565b60015f9081527fb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf6939250905b808210610fff5750909150810160200161011c61010c565b919260018160209254838588010152019101909291610fe7565b346101b6575f3660031901126101b6576040515f60065461103981611c46565b80845290600181169081156101925750600114611060576101308361011c81850382611c99565b60065f9081527ff652222313e28459528d920b65115c16c04f3efc82aaedc97be59f3f377c0d3f939250905b8082106110a45750909150810160200161011c61010c565b91926001816020925483858801015201910190929161108c565b346101b6575f3660031901126101b6576004546040516001600160a01b039091168152602090f35b346101b65760203660031901126101b6576001600160a01b03611107611d0b565b165f52600c602052602060405f2054604051908152f35b346101b6575f3660031901126101b65760405161113a81611c7e565b604051600754815f61114b83611c46565b808352926001811690811561151e57506001146114bf575b61116f92500382611c99565b8152604051600854815f61118283611c46565b80835292600181169081156114a05750600114611441575b6111a692500382611c99565b60208201908152604051600954815f6111be83611c46565b808352926001811690811561142257506001146113c3575b6111e292500382611c99565b604083810191825251600a54815f6111f983611c46565b80835292600181169081156113a45750600114611345575b61121d92500382611c99565b60608401908152604051935f600b5461123581611c46565b808852906001811690811561132157506001146112c7575b50926112ab869361129d6112b99461126d61128f9a610130990388611c99565b8660808201525197519351915193604051998a9960a08b5260a08b0190611cba565b9089820360208b0152611cba565b908782036040890152611cba565b908582036060870152611cba565b908382036080850152611cba565b600b5f90815291507f0175b7a638427703f0dbe7bb9bbf987a2551717b34e79f33b5b1008d1fa01db95b81831061130757505085016020016112ab61124d565b6001816020929493945483858c01015201910191906112f1565b60ff19166020808a019190915291151560051b880190910191506112ab905061124d565b50600a5f90815290917fc65a7bb8d6351c1cf70c95a316cc6a92839c986682d98bc35f958f4883f9d2a85b81831061138857505090602061121d92820101611211565b6020919350806001915483858801015201910190918392611370565b6020925061121d94915060ff191682840152151560051b820101611211565b5060095f90815290917f6e1540171b6c0c960b71a7020d9f60077f6af931a8bbf590da0223dacf75c7af5b8183106114065750509060206111e2928201016111d6565b60209193508060019154838588010152019101909183926113ee565b602092506111e294915060ff191682840152151560051b8201016111d6565b5060085f90815290917ff3f7a9fe364faab93b216da50a3214154f22a0a2b415b23a84c8169e8b636ee35b8183106114845750509060206111a69282010161119a565b602091935080600191548385880101520191019091839261146c565b602092506111a694915060ff191682840152151560051b82010161119a565b5060075f90815290917fa66cc928b5edb82af9bd49922954155ab7b0942694bea4ce44661d9a8736c6885b81831061150257505090602061116f92820101611163565b60209193508060019154838588010152019101909183926114ea565b6020925061116f94915060ff191682840152151560051b820101611163565b346101b6575f3660031901126101b657602060405160128152f35b346101b65760603660031901126101b657611571611d0b565b611579611d21565b6001600160a01b0382165f818152600d6020908152604080832033845290915290205490926044359291600181016115b7575b50610f699350611e70565b838110611604578381039081116115f057610f69945f52600d60205260405f2060018060a01b0333165f5260205260405f2055846115ac565b634e487b7160e01b5f52601160045260245ffd5b60405162461bcd60e51b8152602060048201526009602482015268616c6c6f77616e636560b81b6044820152606490fd5b346101b6575f3660031901126101b6576020600254604051908152f35b346101b65760403660031901126101b65761166b611d0b565b335f818152600d602090815260408083206001600160a01b03909516808452948252918290206024359081905591519182527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591a3602060405160018152f35b346101b65760603660031901126101b6576004356001600160401b0381116101b6576116fb903690600401611cde565b6024356001600160401b0381116101b65761171a903690600401611cde565b906044359360018060a01b0385168095036101b6576004549160ff8360a01c16611b7957611749861515611d37565b611754368684611d6d565b95611760368684611d6d565b94611778885160018110159081611b6d575b50611db2565b61178f865160018110159081611b61575b50611de4565b5f5b88518110156117f557600190600160fd1b6001600160f81b03196117b5838d611e19565b51161015806117ce575b6117c890611db2565b01611791565b506117c8603f60f91b6001600160f81b03196117ea848e611e19565b5116111590506117bf565b50865f5b875181101561189e5760019061183f6001600160f81b031961181b838c611e19565b5116600360fc1b811015908161188f575b811561186b575b81156118455750611de4565b016117f9565b606160f81b81101591508161185c575b508b611789565b603d60f91b101590508b611855565b9050604160f81b81101580611881575b90611833565b50602d60f91b81111561187b565b603960f81b811115915061182c565b5060ff60a01b198616600160a01b176004556001600160401b038111610716576118c85f54611c46565b601f8111611af4575b505f601f8211600114611a74578190611901939495965f92611a695750508160011b915f199060031b1c19161790565b5f555b6001600160401b0381116107165761191d600154611c46565b601f81116119fb575b505f601f821160011461197f57819061195493945f926119745750508160011b915f199060031b1c19161790565b6001555b6bffffffffffffffffffffffff60a01b60035416176003555f80f35b0135905084806103a9565b601f198216937fb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf6915f5b8681106119e357508360019596106119ca575b505050811b01600155611958565b01355f19600384901b60f8161c191690558380806119bc565b909260206001819286860135815501940191016119a9565b818111156119265760015f52601f820160051c7fb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf660208410611a61575b81601f9101920160051c03905f5b828110611a54575050611926565b5f82820155600101611a46565b5f9150611a38565b0135905086806103a9565b601f198216955f80527f290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563915f5b888110611adc57508360019596979810611ac3575b505050811b015f55611904565b01355f19600384901b60f8161c19169055858080611ab6565b90926020600181928686013581550194019101611aa1565b818111156118d1575f8052601f820160051c7f290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e56360208410611b59575b81601f9101920160051c03905f5b828110611b4c5750506118d1565b5f82820155600101611b3e565b5f9150611b30565b6008915011158a611789565b6020915011158a611772565b606460405162461bcd60e51b81526020600482015260046024820152631a5b9a5d60e21b6044820152fd5b346101b6575f3660031901126101b6576040515f5f54611bc381611c46565b80845290600181169081156101925750600114611bea576101308361011c81850382611c99565b5f8080527f290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563939250905b808210611c2c5750909150810160200161011c61010c565b919260018160209254838588010152019101909291611c14565b90600182811c92168015611c74575b6020831014611c6057565b634e487b7160e01b5f52602260045260245ffd5b91607f1691611c55565b60a081019081106001600160401b0382111761071657604052565b90601f801991011681019081106001600160401b0382111761071657604052565b805180835260209291819084018484015e5f828201840152601f01601f1916010190565b9181601f840112156101b6578235916001600160401b0383116101b657602083818601950101116101b657565b600435906001600160a01b03821682036101b657565b602435906001600160a01b03821682036101b657565b15611d3e57565b60405162461bcd60e51b8152602060048201526007602482015266666163746f727960c81b6044820152606490fd5b9291926001600160401b0382116107165760405191611d96601f8201601f191660200184611c99565b8294818452818301116101b6578281602093845f960137010152565b15611db957565b606460405162461bcd60e51b81526020600482015260046024820152636e616d6560e01b6044820152fd5b15611deb57565b60405162461bcd60e51b81526020600482015260066024820152651cde5b589bdb60d21b6044820152606490fd5b908151811015611e2a570160200190565b634e487b7160e01b5f52603260045260245ffd5b15611e4557565b606460405162461bcd60e51b81526020600482015260046024820152637a65726f60e01b6044820152fd5b6001600160a01b0390911690611e87821515611e3e565b6001600160a01b03165f818152600c6020526040902054909190838110611fe0578390835f52600c6020520360405f2055805f52600c60205260405f2083815401905580827fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef6020604051878152a36003546040516327b16a2560e21b815290602090829060049082906001600160a01b03165afa908115611f93575f91611f9e575b506001600160a01b031680611f40575b50505050565b803b156101b6575f92836064926040519687958694637a48316560e11b86526004860152602485015260448401525af18015611f9357611f83575b808080611f3a565b5f611f8d91611c99565b5f611f7b565b6040513d5f823e3d90fd5b90506020813d602011611fd8575b81611fb960209383611c99565b810103126101b657516001600160a01b03811681036101b6575f611f2a565b3d9150611fac565b60405162461bcd60e51b815260206004820152600760248201526662616c616e636560c81b6044820152606490fdfea264697066735822122062cef7b8c0894710f2977c9c897505d269f2102a271ded35bc23b4a38f418dbc64736f6c63430008250033") || !sameCode(String(curveCode), "0x6080806040526004361015610012575f80fd5b5f905f3560e01c90816302d05d3f14611e3f575080630a9d793d14611d975780630d7a94f614611cae578063197ebd5314611c785780631f514c5214611c5b5780632485191414611c2e57806326a059341461179d5780632c135b9314611783578063398482d8146117695780633e0dc34e1461174c57806346904840146117205780634bd387e1146117035780636781df67146116e357806369dd567f146116495780636c1eba151461162f57806377a4d5591461153e5780637a2a2a2b146115215780637ff3260b146114fe578063801f39611461149a57806383c023a4146112ca5780638caa0083146112aa5780638ce744261461128257806398daac83146110e5578063999b93af146110bd578063a64190c414610fe9578063a759184914610df8578063abc874a814610dd5578063b9ac17d814610daa578063bf56b37114610d81578063c1bb890114610d60578063c45a015514610d38578063ca85959d14610d18578063cce7ec1314610ca6578063d48fd46e14610753578063d79875eb14610318578063e7c2b772146102f5578063eb5797a41461021a578063eef49ee3146101f45763fc0c546a146101cb575f80fd5b346101f157806003193601126101f157546040516001600160a01b039091168152602090f35b80fd5b50346101f157806003193601126101f157602060ff60145460081c166040519015158152f35b50346101f157806003193601126101f15760145461023e60ff8260581c161561213c565b60ff60581b198116600160581b17601481905560501c60ff1690816102ea575b50806102e0575b156102b557610272612ce4565b6005541561028a576014805460ff60581b1916905580f35b606460405162461bcd60e51b81526020600482015260046024820152631c1bdbdb60e21b6044820152fd5b606460405162461bcd60e51b815260206004820152600460248201526337b832b760e11b6044820152fd5b5060055415610265565b60ff9150165f61025e565b50346101f157806003193601126101f157602060ff601454166040519015158152f35b50346101f15760403660031901126101f1576004359061036a60ff601454610345828260581c161561213c565b61036382600160581b8160581b198416178060145560501c1661208d565b1615612360565b610375821515612233565b61038182601254611fb8565b906d0434327d0ca15db54731cf010b3f602c1b821561073f57829004926103c9846011546103b0818310611fc5565b6103c46714d1120d7b160000831015612268565b611fab565b93601354948581111580610736575b6103e19061229e565b6127106103f461ffff6007541683611f8e565b04956064820282810460641483151715610722579061271061044293920493610421856103c48b86611fab565b9760243589101580610719575b61043790612398565b601255601155611fab565b60135561044d612406565b6001600160801b0384111561070a576001600160801b035b6001600160801b038311156106fb576001600160801b035b6040519061048a82611eda565b6001600160401b03421682526001600160801b0360208301931683526001600160801b03604083019116815260608201868152608083019233845260ff60e25460081c1660308110156106e75790600360549594939202956001600160401b0387605201925116600160401b600160c01b038354925160401b16916001600160401b0360c01b16171790556001600160801b036053860192511682549160ff60801b9051151560801b16916001600160881b0319161717905560018060a01b0390511691019060018060a01b03166001600160601b0360a01b82541617905560e25460ff8160081c16600181018091116106d357603061ff00910660081b168061ff001983161760e25560ff8216603081106106b4575b505083546040516323b872dd60e01b81523360048201523060248201526044810185905291506020908290606490829088906001600160a01b03165af19081156106a957916105fe6020979261060394879161067c575b506123cf565b6128b1565b61060d8333612ba5565b610615612c7d565b6013546106206120d1565b9160405193845284868501526040840152606083015260808201524260a08201527f30410272d9c4bb7e60f94addbee83d821dcd41431f1654d9e3e7d382c718ae8760c03392a26014805460ff60581b19169055604051908152f35b61069c9150893d8b116106a2575b6106948183611f09565b810190612348565b5f6105f8565b503d61068a565b6040513d86823e3d90fd5b6106bf60ff916120bf565b169161ffff1916171760e2555f80806105a1565b634e487b7160e01b85526011600452602485fd5b634e487b7160e01b89526032600452602489fd5b6001600160801b03831661047d565b6001600160801b038416610465565b5088151561042e565b634e487b7160e01b86526011600452602486fd5b508015156103d8565b634e487b7160e01b5f52601260045260245ffd5b5034610a1f575f366003190112610a1f57303303610c7b5760145460ff81169081610c6c575b5015610c3f576003546040516316f0115b60e01b81526001600160a01b039091169190602081600481865afa908115610a14575f91610c20575b506013545f546040516370a0823160e01b815230600482015291946001600160a01b0390911690602083602481855afa928315610a14575f93610bec575b5085151580610be3575b15610bb65761080a8684611f8e565b6714d1120d7b160000870190818811610ba2576108379161082a91611fa1565b80946103c4821515612233565b80610aa3575b50505f805460405163095ea7b360e01b81526001600160a01b038681166004830152602482018690529093506020928492604492849291165af18015610a1457610a86575b506004546001600160a01b0316801592908315610a7f5785935b15610a23575b505f546004546001546007546001600160a01b0394851698918516969285169461ffff90911693169190883b15610a1f575f9560c4946040519889978896639142063160e01b88526004880152602487015260448601526064850152608484015260a4830152875af18015610a1457610a01575b50809181602060018060a01b0382541660446040518094819363095ea7b360e01b83528760048401528160248401525af180156109f6576109d9575b506004546001600160a01b031680610978575b8261010061ff0019601454161760145580f35b6044602092604051948593849263095ea7b360e01b845260048401528160248401525af180156109ce576109af575b808291610965565b6109c79060203d6020116106a2576106948183611f09565b505f6109a7565b6040513d84823e3d90fd5b6109f19060203d6020116106a2576106948183611f09565b610952565b6040513d85823e3d90fd5b610a0d91505f90611f09565b5f5f610916565b6040513d5f823e3d90fd5b5f80fd5b60405163095ea7b360e01b81526001600160a01b03831660048201526024810187905290602090829060449082905f905af18015610a1457156108a257610a789060203d6020116106a2576106948183611f09565b505f6108a2565b5f9361089c565b610a9e9060203d6020116106a2576106948183611f09565b610882565b602060049260405193848092636bdcb6a760e11b82525afa928315610a1457610b08936020935f91610b75575b5060405163a9059cbb60e01b81526001600160a01b0390911660048201526024810192909252909283919082905f9082906044820190565b03925af1908115610a14575f91610b56575b5015610b28575f808061083d565b60405162461bcd60e51b81526020600482015260066024820152653637b1b5b2b960d11b6044820152606490fd5b610b6f915060203d6020116106a2576106948183611f09565b5f610b1a565b610b959150843d8611610b9b575b610b8d8183611f09565b810190612329565b5f610ad0565b503d610b83565b634e487b7160e01b5f52601160045260245ffd5b60405162461bcd60e51b8152602060048201526005602482015264656d70747960d81b6044820152606490fd5b508215156107fb565b9092506020813d602011610c18575b81610c0860209383611f09565b81010312610a1f5751915f6107f1565b3d9150610bfb565b610c39915060203d602011610b9b57610b8d8183611f09565b5f6107b3565b60405162461bcd60e51b8152602060048201526005602482015264737461676560d81b6044820152606490fd5b60ff915060081c16155f610779565b606460405162461bcd60e51b815260206004820152600460248201526339b2b63360e11b6044820152fd5b6040366003190112610a1f576020610d03610cbf611e62565b601454610cd260ff8260581c161561213c565b60ff60581b1916600160581b17601455600454610cf8906001600160a01b031615612175565b6024359034906124a5565b6014805460ff60581b19169055604051908152f35b34610a1f575f366003190112610a1f57602060ff60515416604051908152f35b34610a1f575f366003190112610a1f576003546040516001600160a01b039091168152602090f35b34610a1f575f366003190112610a1f57602061ffff60075416604051908152f35b34610a1f575f366003190112610a1f5760206001600160401b0360145460101c16604051908152f35b34610a1f576020366003190112610a1f576020610dcd610dc8611e62565b6122d0565b604051908152f35b34610a1f575f366003190112610a1f57602060ff60515460081c16604051908152f35b34610a1f57610e0636611e78565b9190601454610e1b60ff8260581c161561213c565b60ff60581b1916600160581b176014556004546001600160a01b0316610e42811515612175565b6040516370a0823160e01b815230600482015290602082602481845afa918215610a14575f92610fb3575b506040516323b872dd60e01b815233600482015230602482015260448101939093529091906020908290815f81606481015b03925af1908115610a14575f91610f94575b5015610f6957602490602060018060a01b0360045416604051938480926370a0823160e01b82523060048301525afa8015610a14575f90610f35575b610ef79250611fab565b918215610f0a57602092610d03926124a5565b60405162461bcd60e51b815260206004820152600360248201526219dbdd60ea1b6044820152606490fd5b506020823d602011610f61575b81610f4f60209383611f09565b81010312610a1f57610ef79151610eed565b3d9150610f42565b606460405162461bcd60e51b81526020600482015260046024820152631c1d5b1b60e21b6044820152fd5b610fad915060203d6020116106a2576106948183611f09565b84610eb1565b91506020823d602011610fe1575b81610fce60209383611f09565b81010312610a1f57905190610e9f610e6d565b3d9150610fc1565b34610a1f576020366003190112610a1f5761101360043561100b811515612233565b601254611fb8565b6d0434327d0ca15db54731cf010b3f602c1b90801561073f5761103f91046011546103b0818310611fc5565b601354811115806110b4575b6110549061229e565b61271061106761ffff6007541683611f8e565b04606482029180830460641481151715610ba2576127106080930491611091836103c48385611fab565b9261109d841515611ffb565b604051938452602084015260408301526060820152f35b5080151561104b565b34610a1f575f366003190112610a1f576004546040516001600160a01b039091168152602090f35b34610a1f575f366003190112610a1f5760515460ff811690611106826121ed565b916111146040519384611f09565b808352611120816121ed565b602084019190601f1901368337611136816121ed565b906111446040519283611f09565b808252611150816121ed565b602083019490601f19013686376030821015611270575060ff5f95949392955b165f5b8281106111ff57505050604051938493604085019060408652518091526060850192905f5b8181106111e6575050506020908483038286015251918281520191905f5b8181106111c4575050500390f35b82516001600160401b03168452859450602093840193909201916001016111b6565b8251855287965060209485019490920191600101611198565b603061121082849996979899611fb8565b0690603082101561125c576001600160401b0361123e8360019460150154611238858d612204565b52612218565b90549060031b1c166112508287612204565b52019594939295611173565b634e487b7160e01b5f52603260045260245ffd5b60ff809160081c169594939295611170565b34610a1f575f366003190112610a1f576002546040516001600160a01b039091168152602090f35b34610a1f575f366003190112610a1f57602060ff60105416604051908152f35b34610a1f575f366003190112610a1f5760e25460ff81166112ea816121ed565b916112f86040519384611f09565b818352601f19611307836121ed565b015f5b8181106114655750506030821015611458575060ff5f5b165f5b8281106113bf57836040518091602082016020835281518091526020604084019201905f5b818110611357575050500390f35b91935091602060a060019286516001600160401b0381511682526001600160801b038482015116848301526001600160801b03604082015116604083015260608101511515606083015260808580851b03910151166080820152019401910191849392611349565b60306113cb8284611fb8565b0690603082101561125c576040516001926003026113e882611eda565b6001600160801b0381605201546001600160401b038116845260401c16602083015260ff60538201546001600160801b038116604085015260801c16151560608301526054848060a01b039101541660808201526114468287612204565b526114518186612204565b5001611324565b60ff809160081c16611321565b60209060405161147481611eda565b5f81525f838201525f60408201525f60608201525f60808201528282880101520161130a565b34610a1f575f366003190112610a1f5760e06011546012546013546114bd6120d1565b6114c56121a9565b9060ff60145416926114d561210c565b946040519687526020870152604086015260608501526080840152151560a083015260c0820152f35b34610a1f575f366003190112610a1f57602060ff60e25460081c16604051908152f35b34610a1f575f366003190112610a1f576020601354604051908152f35b34610a1f575f366003190112610a1f57604051600654905f61155f83611ea2565b80835260208301936001811690811561161457506001146115b6575b509061158b816040930382611f09565b8151928391602083525180918160208501528484015e5f828201840152601f01601f19168101030190f35b91905060065f527ff652222313e28459528d920b65115c16c04f3efc82aaedc97be59f3f377c0d3f915f905b8082106115fa5750909150810160200161158b61157b565b9192600181602092548385880101520191019092916115e2565b60ff1916855250151560051b8201602001905061158b61157b565b34610a1f575f366003190112610a1f576020610dcd6121a9565b34610a1f5761165736611e78565b60149291925461166d60ff8260581c161561213c565b60ff60581b1916600160581b176014556003546001600160a01b031633036116b457600454602093610d039390916116af906001600160a01b03161515612175565b6124a5565b60405162461bcd60e51b8152602060048201526007602482015266666163746f727960c81b6044820152606490fd5b34610a1f575f366003190112610a1f57602060ff60e25416604051908152f35b34610a1f575f366003190112610a1f576020601154604051908152f35b34610a1f575f366003190112610a1f5760075460405160109190911c6001600160a01b03168152602090f35b34610a1f575f366003190112610a1f576020600554604051908152f35b34610a1f575f366003190112610a1f576020610dcd61210c565b34610a1f575f366003190112610a1f576020610dcd6120d1565b34610a1f57610100366003190112610a1f576117b7611e62565b6024356001600160a01b0381169190829003610a1f576044356001600160a01b0381169190829003610a1f57606435906001600160401b038211610a1f5736602383011215610a1f5781600401356001600160401b038111610a1f573660248285010111610a1f576084359161ffff8316809303610a1f5760a435936001600160401b038511610a1f5736602386011215610a1f578460040135956001600160401b038711610a1f573660248860051b88010111610a1f5760c4356001600160a01b03811690819003610a1f5760e435916001600160a01b0383168303610a1f57601454946118ac60ff8760501c161561208d565b6001600160a01b031680151580611c25575b80611c1c575b6118cd90611f2a565b6101e08711611bf15761012c8811611bc65760088a11611b9b5760ff60501b19909516600160501b176014555f80546001600160a01b03199081169690961790556001805486168b1790556002805486169190911790556003805485163317905560048054909416179092556007805462010000600160b01b03191660109390931b62010000600160b01b03169290921790915560065482919061197090611ea2565b601f8111611b24575b505f90601f8311600114611a98575f92611a8a575b50508160011b915f199060031b1c1916176006555b61ffff1960075416176007556714d1120d7b1600006011556b033b2e3c9fd0803ce800000060125560145469ffffffffffffffff00004260101b169069ffffffffffffffff00001916176014555f5b82811015611a80576024600582901b830101356001600160a01b0381169190829003610a1f5781158015611a77575b611a6e5760ff6010541691600883101561125c57600192600801906001600160601b0360a01b82541617905560105460ff611a5d8183166120bf565b169060ff1916176010555b016119f2565b60019150611a68565b50848214611a21565b611a88612406565b005b60249250010135868061198e565b909150601f1983169160065f527ff652222313e28459528d920b65115c16c04f3efc82aaedc97be59f3f377c0d3f925f5b818110611b095750908460019594939210611aed575b505050811b016006556119a3565b01602401355f19600384901b60f8161c19169055868080611adf565b91936020600181926024888801013581550195019201611ac9565b828111156119795790915060065f52601f830160051c9060208410611b93575b9080601f8594930160051c03905f5b828110611b61575050611979565b5f8183017ff652222313e28459528d920b65115c16c04f3efc82aaedc97be59f3f377c0d3f0155859450600101611b53565b5f9150611b44565b606460405162461bcd60e51b81526020600482015260046024820152637465616d60e01b6044820152fd5b60405162461bcd60e51b81526020600482015260036024820152620e8c2f60eb1b6044820152606490fd5b606460405162461bcd60e51b81526020600482015260046024820152636d65746160e01b6044820152fd5b508115156118c4565b508a15156118be565b34610a1f576020366003190112610a1f576020611c51611c4c611e62565b61202d565b6040519015158152f35b34610a1f575f366003190112610a1f576020601254604051908152f35b34610a1f576020366003190112610a1f576004356008811015610a1f57600801546040516001600160a01b039091168152602090f35b34610a1f576040366003190112610a1f57611cc7611e62565b611cf7612710611cef611ce960243594610dc86509184e72a000871015611f5c565b84611f8e565b048092611fab565b612710611d0a61ffff6007541683611f8e565b04916064820282810460641483151715610ba25783926103c4612710611d339304948592611fab565b90611d4082601154611fb8565b936d0434327d0ca15db54731cf010b3f602c1b851561073f5760a095611d6f91046012546103c4818310611fc5565b93611d7b851515611ffb565b6040519485526020850152604084015260608301526080820152f35b34610a1f576020366003190112610a1f57611db0611e62565b600254906001600160a01b0382163303611e0f576001600160a01b0316908190611ddb821515611f2a565b6001600160a01b031916176002557f90ed2f900bebee953d2681b0d058f80fd7ddec64c41a29669b22dbe3618687965f80a2005b60405162461bcd60e51b81526020600482015260086024820152671c1c9bdd1bd8dbdb60c21b6044820152606490fd5b34610a1f575f366003190112610a1f576001546001600160a01b03168152602090f35b600435906001600160a01b0382168203610a1f57565b6060906003190112610a1f576004356001600160a01b0381168103610a1f57906024359060443590565b90600182811c92168015611ed0575b6020831014611ebc57565b634e487b7160e01b5f52602260045260245ffd5b91607f1691611eb1565b60a081019081106001600160401b03821117611ef557604052565b634e487b7160e01b5f52604160045260245ffd5b90601f801991011681019081106001600160401b03821117611ef557604052565b15611f3157565b606460405162461bcd60e51b81526020600482015260046024820152637a65726f60e01b6044820152fd5b15611f6357565b60405162461bcd60e51b815260206004820152600360248201526236b4b760e91b6044820152606490fd5b81810292918115918404141715610ba257565b811561073f570490565b91908203918211610ba257565b91908201809211610ba257565b15611fcc57565b60405162461bcd60e51b81526020600482015260076024820152667265736572766560c81b6044820152606490fd5b1561200257565b606460405162461bcd60e51b8152602060048201526004602482015263191d5cdd60e21b6044820152fd5b6001546001600160a01b03918216911681146120875760105460ff16905f5b82811061205a575050505f90565b600881101561125c5760088101546001600160a01b0316821461207f5760010161204c565b505050600190565b50600190565b1561209457565b606460405162461bcd60e51b81526020600482015260046024820152631a5b9a5d60e21b6044820152fd5b60ff60019116019060ff8211610ba257565b6011546b033b2e3c9fd0803ce80000008102908082046b033b2e3c9fd0803ce80000001490151715610ba25760125461210991611fa1565b90565b601154670de0b6b3a7640000810290808204670de0b6b3a76400001490151715610ba25760125461210991611fa1565b1561214357565b60405162461bcd60e51b815260206004820152600a6024820152697265656e7472616e637960b01b6044820152606490fd5b1561217c57565b60405162461bcd60e51b815260206004820152600560248201526471756f746560d81b6044820152606490fd5b60ff601454166121e7576013546127108102908082046127101490151715610ba257673a4965bf58a400009004612710811115612109575061271090565b61271090565b6001600160401b038111611ef55760051b60200190565b805182101561125c5760209160051b010190565b90603082101561125c5760188260021c6045019260031b1690565b1561223a57565b60405162461bcd60e51b8152602060048201526006602482015265746f6b656e7360d01b6044820152606490fd5b1561226f57565b60405162461bcd60e51b81526020600482015260076024820152661d9a5c9d1d585b60ca1b6044820152606490fd5b156122a557565b606460405162461bcd60e51b81526020600482015260046024820152631c99585b60e21b6044820152fd5b6122d99061202d565b612325576122f56001600160401b0360145460101c1642611fab565b60058110156123205760050360058111610ba257806126ac02906126ac820403610ba2576005900490565b505f90565b5f90565b90816020910312610a1f57516001600160a01b0381168103610a1f5790565b90816020910312610a1f57518015158103610a1f5790565b1561236757565b60405162461bcd60e51b815260206004820152600960248201526819dc98591d585d195960ba1b6044820152606490fd5b1561239f57565b60405162461bcd60e51b8152602060048201526008602482015267736c69707061676560c01b6044820152606490fd5b156123d657565b60405162461bcd60e51b81526020600482015260086024820152673a3930b739b332b960c11b6044820152606490fd5b61240e6120d1565b60ff60515460081c16603081101561125c576015015561243560ff60515460081c16612218565b81549060031b906001600160401b03804216831b921b191617905560515460ff8160081c1660018101809111610ba257603061ff00910660081b168061ff001983161760515560ff82166030811061248c57505050565b61249760ff916120bf565b169161ffff19161717605155565b929192601454906124bb60ff8360501c1661208d565b60ff821615916124ca83612360565b6001600160a01b038216938415612880576124ed6509184e72a000821015611f5c565b6124ff612710611cef611ce9866122d0565b9061271061251361ffff6007541684611f8e565b04946064830283810460641484151715610ba25786936103c461271061253c9304988992611fab565b9361254985601154611fb8565b6d0434327d0ca15db54731cf010b3f602c1b811561073f5781900490612577826012546103c4818310611fc5565b9b8c101580612877575b61258a90612398565b60115560125561259c85601354611fb8565b918260135580612865575b612827575b50506125b6612406565b6001600160801b03831115612818576001600160801b035b6001600160801b03891115612809576001600160801b035b604051906125f382611eda565b6001600160401b03421682526001600160801b0360208301931683526001600160801b03604083019116815260608201906001825260808301918a835260ff60e25460081c1693603085101561125c57600360549502956001600160401b0387605201925116600160401b600160c01b038354925160401b16916001600160401b0360c01b16171790556001600160801b036053860192511682549160ff60801b9051151560801b16916001600160881b0319161717905560018060a01b0390511691019060018060a01b03166001600160601b0360a01b82541617905560e25460ff8160081c1660018101809111610ba25761274f9560209261ff0060308d940660081b168061ff001983161760e25560ff8216603081106127ea575b50505f805460405163a9059cbb60e01b81526001600160a01b0394851660048201526024810195909552939889949093169284925082906044820190565b03925af1918215610a14577f30410272d9c4bb7e60f94addbee83d821dcd41431f1654d9e3e7d382c718ae87956127926127979460c0975f916127d157506123cf565b612b29565b61279f612c7d565b6013546127aa6120d1565b9060405192600184526020840152876040840152606083015260808201524260a0820152a2565b61069c915060203d6020116106a2576106948183611f09565b6127f560ff916120bf565b169161ffff1916171760e2555f8080612711565b6001600160801b0389166125e6565b6001600160801b0383166125ce565b60019060ff1916176014556040519081527f3a11b9c0ca38b86101cb9e6e1dd2f752c31467c6eaa353f931b801a338406de660203092a25f806125ac565b50673a4965bf58a400008210156125a7565b508b1515612581565b60405162461bcd60e51b81526020600482015260096024820152681c9958da5c1a595b9d60ba1b6044820152606490fd5b90610bb8820290828204610bb81483151715610ba2576128d96127106128de93048094611fab565b611fb8565b6002545f926128f5916001600160a01b0316612ba5565b80156129b05760075460101c6001600160a01b031680612b1d57506003546040516327b16a2560e21b815290602090829060049082906001600160a01b03165afa908115610a14575f91612afe575b506004546001600160a01b0316806129ca575082546001600160a01b039182169116813b156129c65760405163586125fb60e11b81526001600160a01b039190911660048201525f60248201526044810183905291839183916064918391905af180156109ce576129b4575b5050565b6129bf828092611f09565b6101f15750565b8380fd5b60405163095ea7b360e01b81526001600160a01b03831660048201526024810184905290602090829060449082905f905af18015610a1457612ae1575b505f546004546001600160a01b0392831693929182169116833b15610a1f5760405163586125fb60e11b81526001600160a01b0392831660048201529116602482015260448101919091525f8160648183865af18015610a1457612acc575b5060208291604460018060a01b036004541691604051958693849263095ea7b360e01b845260048401528160248401525af1908115612ac05750612aa8575b50565b612aa59060203d6020116106a2576106948183611f09565b604051903d90823e3d90fd5b602092505f612ada91611f09565b5f91612a66565b612af99060203d6020116106a2576106948183611f09565b612a07565b612b17915060203d602011610b9b57610b8d8183611f09565b5f612944565b612b279250612ba5565b565b91905f92610bb8810291818304610bb81482151715610ba257612b5b612b6d916128d96127106128f596048095611fab565b9360018060a01b036002541692611fb8565b90612ba5565b15612b7a57565b60405162461bcd60e51b815260206004820152600360248201526270617960e81b6044820152606490fd5b81156129b0576004546001600160a01b031615612c2d576004805460405163a9059cbb60e01b81526001600160a01b0393841692810192909252602482019390935291602091839160449183915f91165af18015610a1457612b27915f91612c0e575b50612b73565b612c27915060203d6020116106a2576106948183611f09565b5f612c08565b5f80809381935af13d15612c74573d906001600160401b038211611ef557604051612b2792612c66601f8201601f191660200183611f09565b81525f60203d92013e612b73565b612b2790612b73565b60145460ff81168015612cd1575b612aa55760019060ff1916176014556013546040519081527f3a11b9c0ca38b86101cb9e6e1dd2f752c31467c6eaa353f931b801a338406de660203092a2612b27612ce4565b50673a4965bf58a4000060135410612c8b565b6005545f90612aa5576003546040516316f0115b60e01b815290602090829060049082906001600160a01b03165afa8015610a145782915f91612e1b575b5060ff60145460081c1615612dd0575b604051630c9e56fb60e11b81523060048201529260209184916024918391906001600160a01b03165af180928293612d98575b50612d6e575050565b7fd68c766dc26285c80153653e39af123d4faeeaa0e5d93a4af2fb187e87ab2578908260055580a2565b9092506020813d602011612dc8575b81612db460209383611f09565b81010312612dc45751915f612d65565b5080fd5b3d9150612da7565b9050303b15610a1f57604051636a47ea3760e11b81525f8160048183305af19081612e06575b50612dff575050565b8190612d32565b612e139193505f90611f09565b5f915f612df6565b612e34915060203d602011610b9b57610b8d8183611f09565b5f612d2256fea2646970667358221220b8e3eae4065670f2b9284acf7639fd2a29bf52a56ff349a44e0410ebd7436fdb64736f6c63430008250033")) throw new Error("Factory implementations don't match this build.");
	const protocol = decodeFunctionResult({
		abi: factoryAbi,
		functionName: "protocol",
		data: asHex(protocolR, "protocol")
	});
	const hook = decodeFunctionResult({
		abi: factoryAbi,
		functionName: "hook",
		data: asHex(hookR, "hook")
	});
	const pool = decodeFunctionResult({
		abi: factoryAbi,
		functionName: "pool",
		data: asHex(poolR, "pool")
	});
	const rewards = decodeFunctionResult({
		abi: factoryAbi,
		functionName: "rewards",
		data: asHex(rewardsR, "rewards")
	});
	const locker = decodeFunctionResult({
		abi: factoryAbi,
		functionName: "locker",
		data: asHex(lockerR, "locker")
	});
	const launchCount = decodeFunctionResult({
		abi: factoryAbi,
		functionName: "launchCount",
		data: asHex(countR, "launch count")
	});
	const launches = decodeFunctionResult({
		abi: factoryAbi,
		functionName: "newest",
		data: asHex(newestR, "launches")
	}).map((row) => ({
		token: pick(row, 0, "token"),
		curve: pick(row, 1, "curve"),
		creator: pick(row, 2, "creator"),
		name: pick(row, 3, "name"),
		symbol: pick(row, 4, "symbol"),
		metadataUri: pick(row, 5, "metadataUri"),
		launchedAt: Number(pick(row, 6, "launchedAt")),
		virtualEth: pick(row, 7, "virtualEth"),
		virtualToken: pick(row, 8, "virtualToken"),
		realEth: pick(row, 9, "realEth"),
		marketCap: pick(row, 10, "marketCap"),
		progressBps: pick(row, 11, "progressBps"),
		graduated: pick(row, 12, "graduated"),
		spotPrice: pick(row, 13, "spotPrice"),
		logo: "",
		quote: zeroAddress,
		quoteSymbol: "ETH"
	}));
	if (launches.length > 0) {
		const quoteData = encodeFunctionData({
			abi: curveAbi,
			functionName: "quote",
			args: []
		});
		for (let start = 0; start < launches.length; start += 20) {
			const slice = launches.slice(start, start + 20);
			const quoteResults = await batch(relay, slice.map((row) => call(row.curve, quoteData)));
			for (let i = 0; i < slice.length; i++) {
				try {
					slice[i].quote = decodeFunctionResult({
						abi: curveAbi,
						functionName: "quote",
						data: asHex(quoteResults[i], "quote")
					});
				} catch {
					slice[i].quote = zeroAddress;
				}
				slice[i].quoteSymbol = slice[i].quote === "0x0000000000000000000000000000000000000000" ? "ETH" : slice[i].quote.slice(0, 6);
			}
			const named = slice.filter((row) => row.quote !== zeroAddress);
			if (named.length === 0) continue;
			const symbols = await batch(relay, named.map((row) => call(row.quote, encodeFunctionData({
				abi: tokenAbi,
				functionName: "symbol",
				args: []
			}))));
			named.forEach((row, index) => {
				try {
					const symbol = decodeFunctionResult({
						abi: tokenAbi,
						functionName: "symbol",
						data: asHex(symbols[index], "symbol")
					});
					if (symbol) row.quoteSymbol = symbol;
				} catch {}
			});
		}
		for (let start = 0; start < launches.length; start += 20) {
			const slice = launches.slice(start, start + 20);
			const logoResults = await batch(relay, slice.map((row) => call(row.token, encodeFunctionData({
				abi: tokenAbi,
				functionName: "logo",
				args: []
			}))));
			for (let i = 0; i < slice.length; i++) try {
				slice[i].logo = decodeFunctionResult({
					abi: tokenAbi,
					functionName: "logo",
					data: asHex(logoResults[i], "logo")
				});
			} catch {
				slice[i].logo = "";
			}
		}
	}
	return {
		info: {
			protocol,
			tokenImplementation,
			curveImplementation,
			hook,
			pool,
			rewards,
			locker,
			launchCount,
			version
		},
		launches
	};
}
async function assertCurveCode(relay, curve) {
	const [code] = await batch(relay, [{
		method: "eth_getCode",
		params: [curve, "latest"]
	}]);
	const impl = cloneTarget(String(code));
	if (!impl) throw new Error("That address is not a SkyCurve proxy.");
	const [implCode] = await batch(relay, [{
		method: "eth_getCode",
		params: [impl, "latest"]
	}]);
	if (!sameCode(String(implCode), "0x6080806040526004361015610012575f80fd5b5f905f3560e01c90816302d05d3f14611e3f575080630a9d793d14611d975780630d7a94f614611cae578063197ebd5314611c785780631f514c5214611c5b5780632485191414611c2e57806326a059341461179d5780632c135b9314611783578063398482d8146117695780633e0dc34e1461174c57806346904840146117205780634bd387e1146117035780636781df67146116e357806369dd567f146116495780636c1eba151461162f57806377a4d5591461153e5780637a2a2a2b146115215780637ff3260b146114fe578063801f39611461149a57806383c023a4146112ca5780638caa0083146112aa5780638ce744261461128257806398daac83146110e5578063999b93af146110bd578063a64190c414610fe9578063a759184914610df8578063abc874a814610dd5578063b9ac17d814610daa578063bf56b37114610d81578063c1bb890114610d60578063c45a015514610d38578063ca85959d14610d18578063cce7ec1314610ca6578063d48fd46e14610753578063d79875eb14610318578063e7c2b772146102f5578063eb5797a41461021a578063eef49ee3146101f45763fc0c546a146101cb575f80fd5b346101f157806003193601126101f157546040516001600160a01b039091168152602090f35b80fd5b50346101f157806003193601126101f157602060ff60145460081c166040519015158152f35b50346101f157806003193601126101f15760145461023e60ff8260581c161561213c565b60ff60581b198116600160581b17601481905560501c60ff1690816102ea575b50806102e0575b156102b557610272612ce4565b6005541561028a576014805460ff60581b1916905580f35b606460405162461bcd60e51b81526020600482015260046024820152631c1bdbdb60e21b6044820152fd5b606460405162461bcd60e51b815260206004820152600460248201526337b832b760e11b6044820152fd5b5060055415610265565b60ff9150165f61025e565b50346101f157806003193601126101f157602060ff601454166040519015158152f35b50346101f15760403660031901126101f1576004359061036a60ff601454610345828260581c161561213c565b61036382600160581b8160581b198416178060145560501c1661208d565b1615612360565b610375821515612233565b61038182601254611fb8565b906d0434327d0ca15db54731cf010b3f602c1b821561073f57829004926103c9846011546103b0818310611fc5565b6103c46714d1120d7b160000831015612268565b611fab565b93601354948581111580610736575b6103e19061229e565b6127106103f461ffff6007541683611f8e565b04956064820282810460641483151715610722579061271061044293920493610421856103c48b86611fab565b9760243589101580610719575b61043790612398565b601255601155611fab565b60135561044d612406565b6001600160801b0384111561070a576001600160801b035b6001600160801b038311156106fb576001600160801b035b6040519061048a82611eda565b6001600160401b03421682526001600160801b0360208301931683526001600160801b03604083019116815260608201868152608083019233845260ff60e25460081c1660308110156106e75790600360549594939202956001600160401b0387605201925116600160401b600160c01b038354925160401b16916001600160401b0360c01b16171790556001600160801b036053860192511682549160ff60801b9051151560801b16916001600160881b0319161717905560018060a01b0390511691019060018060a01b03166001600160601b0360a01b82541617905560e25460ff8160081c16600181018091116106d357603061ff00910660081b168061ff001983161760e25560ff8216603081106106b4575b505083546040516323b872dd60e01b81523360048201523060248201526044810185905291506020908290606490829088906001600160a01b03165af19081156106a957916105fe6020979261060394879161067c575b506123cf565b6128b1565b61060d8333612ba5565b610615612c7d565b6013546106206120d1565b9160405193845284868501526040840152606083015260808201524260a08201527f30410272d9c4bb7e60f94addbee83d821dcd41431f1654d9e3e7d382c718ae8760c03392a26014805460ff60581b19169055604051908152f35b61069c9150893d8b116106a2575b6106948183611f09565b810190612348565b5f6105f8565b503d61068a565b6040513d86823e3d90fd5b6106bf60ff916120bf565b169161ffff1916171760e2555f80806105a1565b634e487b7160e01b85526011600452602485fd5b634e487b7160e01b89526032600452602489fd5b6001600160801b03831661047d565b6001600160801b038416610465565b5088151561042e565b634e487b7160e01b86526011600452602486fd5b508015156103d8565b634e487b7160e01b5f52601260045260245ffd5b5034610a1f575f366003190112610a1f57303303610c7b5760145460ff81169081610c6c575b5015610c3f576003546040516316f0115b60e01b81526001600160a01b039091169190602081600481865afa908115610a14575f91610c20575b506013545f546040516370a0823160e01b815230600482015291946001600160a01b0390911690602083602481855afa928315610a14575f93610bec575b5085151580610be3575b15610bb65761080a8684611f8e565b6714d1120d7b160000870190818811610ba2576108379161082a91611fa1565b80946103c4821515612233565b80610aa3575b50505f805460405163095ea7b360e01b81526001600160a01b038681166004830152602482018690529093506020928492604492849291165af18015610a1457610a86575b506004546001600160a01b0316801592908315610a7f5785935b15610a23575b505f546004546001546007546001600160a01b0394851698918516969285169461ffff90911693169190883b15610a1f575f9560c4946040519889978896639142063160e01b88526004880152602487015260448601526064850152608484015260a4830152875af18015610a1457610a01575b50809181602060018060a01b0382541660446040518094819363095ea7b360e01b83528760048401528160248401525af180156109f6576109d9575b506004546001600160a01b031680610978575b8261010061ff0019601454161760145580f35b6044602092604051948593849263095ea7b360e01b845260048401528160248401525af180156109ce576109af575b808291610965565b6109c79060203d6020116106a2576106948183611f09565b505f6109a7565b6040513d84823e3d90fd5b6109f19060203d6020116106a2576106948183611f09565b610952565b6040513d85823e3d90fd5b610a0d91505f90611f09565b5f5f610916565b6040513d5f823e3d90fd5b5f80fd5b60405163095ea7b360e01b81526001600160a01b03831660048201526024810187905290602090829060449082905f905af18015610a1457156108a257610a789060203d6020116106a2576106948183611f09565b505f6108a2565b5f9361089c565b610a9e9060203d6020116106a2576106948183611f09565b610882565b602060049260405193848092636bdcb6a760e11b82525afa928315610a1457610b08936020935f91610b75575b5060405163a9059cbb60e01b81526001600160a01b0390911660048201526024810192909252909283919082905f9082906044820190565b03925af1908115610a14575f91610b56575b5015610b28575f808061083d565b60405162461bcd60e51b81526020600482015260066024820152653637b1b5b2b960d11b6044820152606490fd5b610b6f915060203d6020116106a2576106948183611f09565b5f610b1a565b610b959150843d8611610b9b575b610b8d8183611f09565b810190612329565b5f610ad0565b503d610b83565b634e487b7160e01b5f52601160045260245ffd5b60405162461bcd60e51b8152602060048201526005602482015264656d70747960d81b6044820152606490fd5b508215156107fb565b9092506020813d602011610c18575b81610c0860209383611f09565b81010312610a1f5751915f6107f1565b3d9150610bfb565b610c39915060203d602011610b9b57610b8d8183611f09565b5f6107b3565b60405162461bcd60e51b8152602060048201526005602482015264737461676560d81b6044820152606490fd5b60ff915060081c16155f610779565b606460405162461bcd60e51b815260206004820152600460248201526339b2b63360e11b6044820152fd5b6040366003190112610a1f576020610d03610cbf611e62565b601454610cd260ff8260581c161561213c565b60ff60581b1916600160581b17601455600454610cf8906001600160a01b031615612175565b6024359034906124a5565b6014805460ff60581b19169055604051908152f35b34610a1f575f366003190112610a1f57602060ff60515416604051908152f35b34610a1f575f366003190112610a1f576003546040516001600160a01b039091168152602090f35b34610a1f575f366003190112610a1f57602061ffff60075416604051908152f35b34610a1f575f366003190112610a1f5760206001600160401b0360145460101c16604051908152f35b34610a1f576020366003190112610a1f576020610dcd610dc8611e62565b6122d0565b604051908152f35b34610a1f575f366003190112610a1f57602060ff60515460081c16604051908152f35b34610a1f57610e0636611e78565b9190601454610e1b60ff8260581c161561213c565b60ff60581b1916600160581b176014556004546001600160a01b0316610e42811515612175565b6040516370a0823160e01b815230600482015290602082602481845afa918215610a14575f92610fb3575b506040516323b872dd60e01b815233600482015230602482015260448101939093529091906020908290815f81606481015b03925af1908115610a14575f91610f94575b5015610f6957602490602060018060a01b0360045416604051938480926370a0823160e01b82523060048301525afa8015610a14575f90610f35575b610ef79250611fab565b918215610f0a57602092610d03926124a5565b60405162461bcd60e51b815260206004820152600360248201526219dbdd60ea1b6044820152606490fd5b506020823d602011610f61575b81610f4f60209383611f09565b81010312610a1f57610ef79151610eed565b3d9150610f42565b606460405162461bcd60e51b81526020600482015260046024820152631c1d5b1b60e21b6044820152fd5b610fad915060203d6020116106a2576106948183611f09565b84610eb1565b91506020823d602011610fe1575b81610fce60209383611f09565b81010312610a1f57905190610e9f610e6d565b3d9150610fc1565b34610a1f576020366003190112610a1f5761101360043561100b811515612233565b601254611fb8565b6d0434327d0ca15db54731cf010b3f602c1b90801561073f5761103f91046011546103b0818310611fc5565b601354811115806110b4575b6110549061229e565b61271061106761ffff6007541683611f8e565b04606482029180830460641481151715610ba2576127106080930491611091836103c48385611fab565b9261109d841515611ffb565b604051938452602084015260408301526060820152f35b5080151561104b565b34610a1f575f366003190112610a1f576004546040516001600160a01b039091168152602090f35b34610a1f575f366003190112610a1f5760515460ff811690611106826121ed565b916111146040519384611f09565b808352611120816121ed565b602084019190601f1901368337611136816121ed565b906111446040519283611f09565b808252611150816121ed565b602083019490601f19013686376030821015611270575060ff5f95949392955b165f5b8281106111ff57505050604051938493604085019060408652518091526060850192905f5b8181106111e6575050506020908483038286015251918281520191905f5b8181106111c4575050500390f35b82516001600160401b03168452859450602093840193909201916001016111b6565b8251855287965060209485019490920191600101611198565b603061121082849996979899611fb8565b0690603082101561125c576001600160401b0361123e8360019460150154611238858d612204565b52612218565b90549060031b1c166112508287612204565b52019594939295611173565b634e487b7160e01b5f52603260045260245ffd5b60ff809160081c169594939295611170565b34610a1f575f366003190112610a1f576002546040516001600160a01b039091168152602090f35b34610a1f575f366003190112610a1f57602060ff60105416604051908152f35b34610a1f575f366003190112610a1f5760e25460ff81166112ea816121ed565b916112f86040519384611f09565b818352601f19611307836121ed565b015f5b8181106114655750506030821015611458575060ff5f5b165f5b8281106113bf57836040518091602082016020835281518091526020604084019201905f5b818110611357575050500390f35b91935091602060a060019286516001600160401b0381511682526001600160801b038482015116848301526001600160801b03604082015116604083015260608101511515606083015260808580851b03910151166080820152019401910191849392611349565b60306113cb8284611fb8565b0690603082101561125c576040516001926003026113e882611eda565b6001600160801b0381605201546001600160401b038116845260401c16602083015260ff60538201546001600160801b038116604085015260801c16151560608301526054848060a01b039101541660808201526114468287612204565b526114518186612204565b5001611324565b60ff809160081c16611321565b60209060405161147481611eda565b5f81525f838201525f60408201525f60608201525f60808201528282880101520161130a565b34610a1f575f366003190112610a1f5760e06011546012546013546114bd6120d1565b6114c56121a9565b9060ff60145416926114d561210c565b946040519687526020870152604086015260608501526080840152151560a083015260c0820152f35b34610a1f575f366003190112610a1f57602060ff60e25460081c16604051908152f35b34610a1f575f366003190112610a1f576020601354604051908152f35b34610a1f575f366003190112610a1f57604051600654905f61155f83611ea2565b80835260208301936001811690811561161457506001146115b6575b509061158b816040930382611f09565b8151928391602083525180918160208501528484015e5f828201840152601f01601f19168101030190f35b91905060065f527ff652222313e28459528d920b65115c16c04f3efc82aaedc97be59f3f377c0d3f915f905b8082106115fa5750909150810160200161158b61157b565b9192600181602092548385880101520191019092916115e2565b60ff1916855250151560051b8201602001905061158b61157b565b34610a1f575f366003190112610a1f576020610dcd6121a9565b34610a1f5761165736611e78565b60149291925461166d60ff8260581c161561213c565b60ff60581b1916600160581b176014556003546001600160a01b031633036116b457600454602093610d039390916116af906001600160a01b03161515612175565b6124a5565b60405162461bcd60e51b8152602060048201526007602482015266666163746f727960c81b6044820152606490fd5b34610a1f575f366003190112610a1f57602060ff60e25416604051908152f35b34610a1f575f366003190112610a1f576020601154604051908152f35b34610a1f575f366003190112610a1f5760075460405160109190911c6001600160a01b03168152602090f35b34610a1f575f366003190112610a1f576020600554604051908152f35b34610a1f575f366003190112610a1f576020610dcd61210c565b34610a1f575f366003190112610a1f576020610dcd6120d1565b34610a1f57610100366003190112610a1f576117b7611e62565b6024356001600160a01b0381169190829003610a1f576044356001600160a01b0381169190829003610a1f57606435906001600160401b038211610a1f5736602383011215610a1f5781600401356001600160401b038111610a1f573660248285010111610a1f576084359161ffff8316809303610a1f5760a435936001600160401b038511610a1f5736602386011215610a1f578460040135956001600160401b038711610a1f573660248860051b88010111610a1f5760c4356001600160a01b03811690819003610a1f5760e435916001600160a01b0383168303610a1f57601454946118ac60ff8760501c161561208d565b6001600160a01b031680151580611c25575b80611c1c575b6118cd90611f2a565b6101e08711611bf15761012c8811611bc65760088a11611b9b5760ff60501b19909516600160501b176014555f80546001600160a01b03199081169690961790556001805486168b1790556002805486169190911790556003805485163317905560048054909416179092556007805462010000600160b01b03191660109390931b62010000600160b01b03169290921790915560065482919061197090611ea2565b601f8111611b24575b505f90601f8311600114611a98575f92611a8a575b50508160011b915f199060031b1c1916176006555b61ffff1960075416176007556714d1120d7b1600006011556b033b2e3c9fd0803ce800000060125560145469ffffffffffffffff00004260101b169069ffffffffffffffff00001916176014555f5b82811015611a80576024600582901b830101356001600160a01b0381169190829003610a1f5781158015611a77575b611a6e5760ff6010541691600883101561125c57600192600801906001600160601b0360a01b82541617905560105460ff611a5d8183166120bf565b169060ff1916176010555b016119f2565b60019150611a68565b50848214611a21565b611a88612406565b005b60249250010135868061198e565b909150601f1983169160065f527ff652222313e28459528d920b65115c16c04f3efc82aaedc97be59f3f377c0d3f925f5b818110611b095750908460019594939210611aed575b505050811b016006556119a3565b01602401355f19600384901b60f8161c19169055868080611adf565b91936020600181926024888801013581550195019201611ac9565b828111156119795790915060065f52601f830160051c9060208410611b93575b9080601f8594930160051c03905f5b828110611b61575050611979565b5f8183017ff652222313e28459528d920b65115c16c04f3efc82aaedc97be59f3f377c0d3f0155859450600101611b53565b5f9150611b44565b606460405162461bcd60e51b81526020600482015260046024820152637465616d60e01b6044820152fd5b60405162461bcd60e51b81526020600482015260036024820152620e8c2f60eb1b6044820152606490fd5b606460405162461bcd60e51b81526020600482015260046024820152636d65746160e01b6044820152fd5b508115156118c4565b508a15156118be565b34610a1f576020366003190112610a1f576020611c51611c4c611e62565b61202d565b6040519015158152f35b34610a1f575f366003190112610a1f576020601254604051908152f35b34610a1f576020366003190112610a1f576004356008811015610a1f57600801546040516001600160a01b039091168152602090f35b34610a1f576040366003190112610a1f57611cc7611e62565b611cf7612710611cef611ce960243594610dc86509184e72a000871015611f5c565b84611f8e565b048092611fab565b612710611d0a61ffff6007541683611f8e565b04916064820282810460641483151715610ba25783926103c4612710611d339304948592611fab565b90611d4082601154611fb8565b936d0434327d0ca15db54731cf010b3f602c1b851561073f5760a095611d6f91046012546103c4818310611fc5565b93611d7b851515611ffb565b6040519485526020850152604084015260608301526080820152f35b34610a1f576020366003190112610a1f57611db0611e62565b600254906001600160a01b0382163303611e0f576001600160a01b0316908190611ddb821515611f2a565b6001600160a01b031916176002557f90ed2f900bebee953d2681b0d058f80fd7ddec64c41a29669b22dbe3618687965f80a2005b60405162461bcd60e51b81526020600482015260086024820152671c1c9bdd1bd8dbdb60c21b6044820152606490fd5b34610a1f575f366003190112610a1f576001546001600160a01b03168152602090f35b600435906001600160a01b0382168203610a1f57565b6060906003190112610a1f576004356001600160a01b0381168103610a1f57906024359060443590565b90600182811c92168015611ed0575b6020831014611ebc57565b634e487b7160e01b5f52602260045260245ffd5b91607f1691611eb1565b60a081019081106001600160401b03821117611ef557604052565b634e487b7160e01b5f52604160045260245ffd5b90601f801991011681019081106001600160401b03821117611ef557604052565b15611f3157565b606460405162461bcd60e51b81526020600482015260046024820152637a65726f60e01b6044820152fd5b15611f6357565b60405162461bcd60e51b815260206004820152600360248201526236b4b760e91b6044820152606490fd5b81810292918115918404141715610ba257565b811561073f570490565b91908203918211610ba257565b91908201809211610ba257565b15611fcc57565b60405162461bcd60e51b81526020600482015260076024820152667265736572766560c81b6044820152606490fd5b1561200257565b606460405162461bcd60e51b8152602060048201526004602482015263191d5cdd60e21b6044820152fd5b6001546001600160a01b03918216911681146120875760105460ff16905f5b82811061205a575050505f90565b600881101561125c5760088101546001600160a01b0316821461207f5760010161204c565b505050600190565b50600190565b1561209457565b606460405162461bcd60e51b81526020600482015260046024820152631a5b9a5d60e21b6044820152fd5b60ff60019116019060ff8211610ba257565b6011546b033b2e3c9fd0803ce80000008102908082046b033b2e3c9fd0803ce80000001490151715610ba25760125461210991611fa1565b90565b601154670de0b6b3a7640000810290808204670de0b6b3a76400001490151715610ba25760125461210991611fa1565b1561214357565b60405162461bcd60e51b815260206004820152600a6024820152697265656e7472616e637960b01b6044820152606490fd5b1561217c57565b60405162461bcd60e51b815260206004820152600560248201526471756f746560d81b6044820152606490fd5b60ff601454166121e7576013546127108102908082046127101490151715610ba257673a4965bf58a400009004612710811115612109575061271090565b61271090565b6001600160401b038111611ef55760051b60200190565b805182101561125c5760209160051b010190565b90603082101561125c5760188260021c6045019260031b1690565b1561223a57565b60405162461bcd60e51b8152602060048201526006602482015265746f6b656e7360d01b6044820152606490fd5b1561226f57565b60405162461bcd60e51b81526020600482015260076024820152661d9a5c9d1d585b60ca1b6044820152606490fd5b156122a557565b606460405162461bcd60e51b81526020600482015260046024820152631c99585b60e21b6044820152fd5b6122d99061202d565b612325576122f56001600160401b0360145460101c1642611fab565b60058110156123205760050360058111610ba257806126ac02906126ac820403610ba2576005900490565b505f90565b5f90565b90816020910312610a1f57516001600160a01b0381168103610a1f5790565b90816020910312610a1f57518015158103610a1f5790565b1561236757565b60405162461bcd60e51b815260206004820152600960248201526819dc98591d585d195960ba1b6044820152606490fd5b1561239f57565b60405162461bcd60e51b8152602060048201526008602482015267736c69707061676560c01b6044820152606490fd5b156123d657565b60405162461bcd60e51b81526020600482015260086024820152673a3930b739b332b960c11b6044820152606490fd5b61240e6120d1565b60ff60515460081c16603081101561125c576015015561243560ff60515460081c16612218565b81549060031b906001600160401b03804216831b921b191617905560515460ff8160081c1660018101809111610ba257603061ff00910660081b168061ff001983161760515560ff82166030811061248c57505050565b61249760ff916120bf565b169161ffff19161717605155565b929192601454906124bb60ff8360501c1661208d565b60ff821615916124ca83612360565b6001600160a01b038216938415612880576124ed6509184e72a000821015611f5c565b6124ff612710611cef611ce9866122d0565b9061271061251361ffff6007541684611f8e565b04946064830283810460641484151715610ba25786936103c461271061253c9304988992611fab565b9361254985601154611fb8565b6d0434327d0ca15db54731cf010b3f602c1b811561073f5781900490612577826012546103c4818310611fc5565b9b8c101580612877575b61258a90612398565b60115560125561259c85601354611fb8565b918260135580612865575b612827575b50506125b6612406565b6001600160801b03831115612818576001600160801b035b6001600160801b03891115612809576001600160801b035b604051906125f382611eda565b6001600160401b03421682526001600160801b0360208301931683526001600160801b03604083019116815260608201906001825260808301918a835260ff60e25460081c1693603085101561125c57600360549502956001600160401b0387605201925116600160401b600160c01b038354925160401b16916001600160401b0360c01b16171790556001600160801b036053860192511682549160ff60801b9051151560801b16916001600160881b0319161717905560018060a01b0390511691019060018060a01b03166001600160601b0360a01b82541617905560e25460ff8160081c1660018101809111610ba25761274f9560209261ff0060308d940660081b168061ff001983161760e25560ff8216603081106127ea575b50505f805460405163a9059cbb60e01b81526001600160a01b0394851660048201526024810195909552939889949093169284925082906044820190565b03925af1918215610a14577f30410272d9c4bb7e60f94addbee83d821dcd41431f1654d9e3e7d382c718ae87956127926127979460c0975f916127d157506123cf565b612b29565b61279f612c7d565b6013546127aa6120d1565b9060405192600184526020840152876040840152606083015260808201524260a0820152a2565b61069c915060203d6020116106a2576106948183611f09565b6127f560ff916120bf565b169161ffff1916171760e2555f8080612711565b6001600160801b0389166125e6565b6001600160801b0383166125ce565b60019060ff1916176014556040519081527f3a11b9c0ca38b86101cb9e6e1dd2f752c31467c6eaa353f931b801a338406de660203092a25f806125ac565b50673a4965bf58a400008210156125a7565b508b1515612581565b60405162461bcd60e51b81526020600482015260096024820152681c9958da5c1a595b9d60ba1b6044820152606490fd5b90610bb8820290828204610bb81483151715610ba2576128d96127106128de93048094611fab565b611fb8565b6002545f926128f5916001600160a01b0316612ba5565b80156129b05760075460101c6001600160a01b031680612b1d57506003546040516327b16a2560e21b815290602090829060049082906001600160a01b03165afa908115610a14575f91612afe575b506004546001600160a01b0316806129ca575082546001600160a01b039182169116813b156129c65760405163586125fb60e11b81526001600160a01b039190911660048201525f60248201526044810183905291839183916064918391905af180156109ce576129b4575b5050565b6129bf828092611f09565b6101f15750565b8380fd5b60405163095ea7b360e01b81526001600160a01b03831660048201526024810184905290602090829060449082905f905af18015610a1457612ae1575b505f546004546001600160a01b0392831693929182169116833b15610a1f5760405163586125fb60e11b81526001600160a01b0392831660048201529116602482015260448101919091525f8160648183865af18015610a1457612acc575b5060208291604460018060a01b036004541691604051958693849263095ea7b360e01b845260048401528160248401525af1908115612ac05750612aa8575b50565b612aa59060203d6020116106a2576106948183611f09565b604051903d90823e3d90fd5b602092505f612ada91611f09565b5f91612a66565b612af99060203d6020116106a2576106948183611f09565b612a07565b612b17915060203d602011610b9b57610b8d8183611f09565b5f612944565b612b279250612ba5565b565b91905f92610bb8810291818304610bb81482151715610ba257612b5b612b6d916128d96127106128f596048095611fab565b9360018060a01b036002541692611fb8565b90612ba5565b15612b7a57565b60405162461bcd60e51b815260206004820152600360248201526270617960e81b6044820152606490fd5b81156129b0576004546001600160a01b031615612c2d576004805460405163a9059cbb60e01b81526001600160a01b0393841692810192909252602482019390935291602091839160449183915f91165af18015610a1457612b27915f91612c0e575b50612b73565b612c27915060203d6020116106a2576106948183611f09565b5f612c08565b5f80809381935af13d15612c74573d906001600160401b038211611ef557604051612b2792612c66601f8201601f191660200183611f09565b81525f60203d92013e612b73565b612b2790612b73565b60145460ff81168015612cd1575b612aa55760019060ff1916176014556013546040519081527f3a11b9c0ca38b86101cb9e6e1dd2f752c31467c6eaa353f931b801a338406de660203092a2612b27612ce4565b50673a4965bf58a4000060135410612c8b565b6005545f90612aa5576003546040516316f0115b60e01b815290602090829060049082906001600160a01b03165afa8015610a145782915f91612e1b575b5060ff60145460081c1615612dd0575b604051630c9e56fb60e11b81523060048201529260209184916024918391906001600160a01b03165af180928293612d98575b50612d6e575050565b7fd68c766dc26285c80153653e39af123d4faeeaa0e5d93a4af2fb187e87ab2578908260055580a2565b9092506020813d602011612dc8575b81612db460209383611f09565b81010312612dc45751915f612d65565b5080fd5b3d9150612da7565b9050303b15610a1f57604051636a47ea3760e11b81525f8160048183305af19081612e06575b50612dff575050565b8190612d32565b612e139193505f90611f09565b5f915f612df6565b612e34915060203d602011610b9b57610b8d8183611f09565b5f612d2256fea2646970667358221220b8e3eae4065670f2b9284acf7639fd2a29bf52a56ff349a44e0410ebd7436fdb64736f6c63430008250033")) throw new Error("Curve bytecode does not match SkyLaunchpad. Trading is disabled.");
}
async function readMarket(relay, curve) {
	await assertCurveCode(relay, curve);
	const packed = encodeFunctionData({
		abi: curveAbi,
		functionName: "viewState",
		args: []
	});
	const tokenData = encodeFunctionData({
		abi: curveAbi,
		functionName: "token",
		args: []
	});
	const creatorData = encodeFunctionData({
		abi: curveAbi,
		functionName: "creator",
		args: []
	});
	const protocolData = encodeFunctionData({
		abi: curveAbi,
		functionName: "protocol",
		args: []
	});
	const factoryData = encodeFunctionData({
		abi: curveAbi,
		functionName: "factory",
		args: []
	});
	const metaData = encodeFunctionData({
		abi: curveAbi,
		functionName: "metadataUri",
		args: []
	});
	const launchedData = encodeFunctionData({
		abi: curveAbi,
		functionName: "launchedAt",
		args: []
	});
	const quoteData = encodeFunctionData({
		abi: curveAbi,
		functionName: "quote",
		args: []
	});
	const historyData = encodeFunctionData({
		abi: curveAbi,
		functionName: "history",
		args: []
	});
	const printsData = encodeFunctionData({
		abi: curveAbi,
		functionName: "prints",
		args: []
	});
	const poolIdData = encodeFunctionData({
		abi: curveAbi,
		functionName: "poolId",
		args: []
	});
	const feeWalletData = encodeFunctionData({
		abi: curveAbi,
		functionName: "feeRecipient",
		args: []
	});
	const [stateR, tokenR, creatorR, protocolR, factoryR, metaR, launchedR, quoteR, historyR, printsR, poolIdR, feeWalletR] = await batch(relay, [
		call(curve, packed),
		call(curve, tokenData),
		call(curve, creatorData),
		call(curve, protocolData),
		call(curve, factoryData),
		call(curve, metaData),
		call(curve, launchedData),
		call(curve, quoteData),
		call(curve, historyData),
		call(curve, printsData),
		call(curve, poolIdData),
		call(curve, feeWalletData)
	]);
	const state = decodeFunctionResult({
		abi: curveAbi,
		functionName: "viewState",
		data: asHex(stateR, "state")
	});
	const token = decodeFunctionResult({
		abi: curveAbi,
		functionName: "token",
		data: asHex(tokenR, "token")
	});
	const [tokenCode, nameR, symbolR, supplyR, logoR] = await batch(relay, [
		{
			method: "eth_getCode",
			params: [token, "latest"]
		},
		call(token, encodeFunctionData({
			abi: tokenAbi,
			functionName: "name",
			args: []
		})),
		call(token, encodeFunctionData({
			abi: tokenAbi,
			functionName: "symbol",
			args: []
		})),
		call(token, encodeFunctionData({
			abi: tokenAbi,
			functionName: "totalSupply",
			args: []
		})),
		call(token, encodeFunctionData({
			abi: tokenAbi,
			functionName: "logo",
			args: []
		}))
	]);
	const tokenImpl = cloneTarget(String(tokenCode));
	if (!tokenImpl) throw new Error("Token is not a SkyToken proxy.");
	const [implCode] = await batch(relay, [{
		method: "eth_getCode",
		params: [tokenImpl, "latest"]
	}]);
	if (!sameCode(String(implCode), "0x60806040526004361015610011575f80fd5b5f3560e01c806306fdde0314611ba4578063077f224a146116cb578063095ea7b31461165257806318160ddd1461163557806323b872dd14611558578063313ce5671461153d57806353cd512a1461111e57806370a08231146110e65780637165485d146110be5780637284e4161461101957806395d89b4114610f74578063a9059cbb14610f43578063b0dbfa8b14610e47578063c45a015514610e1f578063d9f146311461020a578063dd62ed3e146101ba5763fb7f21eb146100d4575f80fd5b346101b6575f3660031901126101b6576040515f6005546100f481611c46565b80845290600181169081156101925750600114610134575b6101308361011c81850382611c99565b604051918291602083526020830190611cba565b0390f35b60055f9081527f036b6384b5eca791c62761152d0c79bb0604c104a5fb6f4eb0703f3154bb3db0939250905b8082106101785750909150810160200161011c61010c565b919260018160209254838588010152019101909291610160565b60ff191660208086019190915291151560051b8401909101915061011c905061010c565b5f80fd5b346101b65760403660031901126101b6576101d3611d0b565b6101db611d21565b6001600160a01b039182165f908152600d60209081526040808320949093168252928352819020549051908152f35b346101b65760e03660031901126101b6576004356001600160401b0381116101b65761023a903690600401611cde565b6024356001600160401b0381116101b657610259903690600401611cde565b926044356001600160401b0381116101b657610279903690600401611cde565b6064939193356001600160401b0381116101b65761029b903690600401611cde565b6084356001600160401b0381116101b6576102ba903690600401611cde565b96909360a4356001600160401b0381116101b6576102dc903690600401611cde565b9a909660c4356001600160401b0381116101b6576102fe903690600401611cde565b9b909961031660018060a01b03600354163314611d37565b60045460ff8160a81c16610df45760a08311610dc957608c8511610d9e5760308611610d745760308811610d4a5760308d11610d205760308f11610cf55760308e11610ccb5760ff60a81b1916600160a81b176004556001600160401b03821161071657610385600554611c46565b601f8111610c5c575b505f90601f8311600114610bd9576103bd92915f9183610bce575b50508160011b915f199060031b1c19161790565b6005555b6001600160401b038211610716576103da600654611c46565b601f8111610b60575b505f90601f8311600114610ac357946104416104599561043a9c9b999561042c8661044a976104689c976104779f9c5f92610ab85750508160011b915f199060031b1c19161790565b6006555b6040519d8e611c7e565b3691611d6d565b8b523691611d6d565b96602089019788523691611d6d565b97604087019889523691611d6d565b94606085019586523691611d6d565b9160808101928352518051906001600160401b0382116107165761049c600754611c46565b601f8111610a4a575b50602090601f83116001146109c7576104d492915f91836109bc5750508160011b915f199060031b1c19161790565b6007555b519283516001600160401b038111610716576104f5600854611c46565b601f811161094e575b50602094601f82116001146108eb576105309293949582915f926108e05750508160011b915f199060031b1c19161790565b6008555b519182516001600160401b03811161071657610551600954611c46565b601f8111610872575b506020601f821160011461080f57819061058a9394955f926108045750508160011b915f199060031b1c19161790565b6009555b519081516001600160401b038111610716576105ab600a54611c46565b601f8111610796575b50602092601f8211600114610735576105e4929382915f9261072a5750508160011b915f199060031b1c19161790565b600a555b5180516001600160401b03811161071657610604600b54611c46565b601f81116106a8575b50602091601f821160011461064b5761063b925f91836106405750508160011b915f199060031b1c19161790565b600b55005b0151905083806103a9565b601f19821692600b5f52805f20915f5b85811061069057508360019510610678575b505050811b01600b55005b01515f1960f88460031b161c1916905582808061066d565b9192602060018192868501518155019401920161065b565b8181111561060d57600b5f52601f820160051c7f0175b7a638427703f0dbe7bb9bbf987a2551717b34e79f33b5b1008d1fa01db96020841061070e575b81601f9101920160051c03905f5b82811061070157505061060d565b5f828201556001016106f3565b5f91506106e5565b634e487b7160e01b5f52604160045260245ffd5b0151905084806103a9565b601f19821693600a5f52805f20915f5b86811061077e5750836001959610610766575b505050811b01600a556105e8565b01515f1960f88460031b161c19169055838080610758565b91926020600181928685015181550194019201610745565b818111156105b457600a5f52601f820160051c7fc65a7bb8d6351c1cf70c95a316cc6a92839c986682d98bc35f958f4883f9d2a8602084106107fc575b81601f9101920160051c03905f5b8281106107ef5750506105b4565b5f828201556001016107e1565b5f91506107d3565b0151905085806103a9565b601f1982169060095f52805f20915f5b81811061085a57509583600195969710610842575b505050811b0160095561058e565b01515f1960f88460031b161c19169055848080610834565b9192602060018192868b01518155019401920161081f565b8181111561055a5760095f52601f820160051c7f6e1540171b6c0c960b71a7020d9f60077f6af931a8bbf590da0223dacf75c7af602084106108d8575b81601f9101920160051c03905f5b8281106108cb57505061055a565b5f828201556001016108bd565b5f91506108af565b0151905086806103a9565b601f1982169560085f52805f20915f5b8881106109365750836001959697981061091e575b505050811b01600855610534565b01515f1960f88460031b161c19169055858080610910565b919260206001819286850151815501940192016108fb565b818111156104fe5760085f52601f820160051c7ff3f7a9fe364faab93b216da50a3214154f22a0a2b415b23a84c8169e8b636ee3602084106109b4575b81601f9101920160051c03905f5b8281106109a75750506104fe565b5f82820155600101610999565b5f915061098b565b0151905087806103a9565b90601f1983169160075f527fa66cc928b5edb82af9bd49922954155ab7b0942694bea4ce44661d9a8736c688925f5b818110610a325750908460019594939210610a1a575b505050811b016007556104d8565b01515f1960f88460031b161c19169055868080610a0c565b929360206001819287860151815501950193016109f6565b828111156104a55760075f52601f830160051c7fa66cc928b5edb82af9bd49922954155ab7b0942694bea4ce44661d9a8736c68860208510610ab0575b81601f9101920160051c03905f5b828110610aa35750506104a5565b5f82820155600101610a95565b5f9150610a87565b013590505f806103a9565b601f1983169160065f527ff652222313e28459528d920b65115c16c04f3efc82aaedc97be59f3f377c0d3f925f5b818110610b4857509561043a9c9b99956001866104689b966104779e9b966104419661044a9a6104599d10610b2f575b505050811b01600655610430565b01355f19600384901b60f8161c191690555f8080610b21565b91936020600181928787013581550195019201610af1565b828111156103e35760065f52601f830160051c7ff652222313e28459528d920b65115c16c04f3efc82aaedc97be59f3f377c0d3f60208510610bc6575b81601f9101920160051c03905f5b828110610bb95750506103e3565b5f82820155600101610bab565b5f9150610b9d565b013590508f806103a9565b601f1983169160055f527f036b6384b5eca791c62761152d0c79bb0604c104a5fb6f4eb0703f3154bb3db0925f5b818110610c445750908460019594939210610c2b575b505050811b016005556103c1565b01355f19600384901b60f8161c191690558e8080610c1d565b91936020600181928787013581550195019201610c07565b8281111561038e5760055f819052601f8401901c7f036b6384b5eca791c62761152d0c79bb0604c104a5fb6f4eb0703f3154bb3db060208510610cc3575b81601f9101920160051c03905f5b828110610cb657505061038e565b5f82820155600101610ca8565b5f9150610c9a565b60405162461bcd60e51b8152602060048201526002602482015261666360f01b6044820152606490fd5b60405162461bcd60e51b81526020600482015260036024820152623bb2b160e91b6044820152606490fd5b60405162461bcd60e51b8152602060048201526002602482015261646360f01b6044820152606490fd5b60405162461bcd60e51b8152602060048201526002602482015261746760f01b6044820152606490fd5b60405162461bcd60e51b8152602060048201526002602482015261747760f01b6044820152606490fd5b606460405162461bcd60e51b81526020600482015260046024820152636465736360e01b6044820152fd5b606460405162461bcd60e51b81526020600482015260046024820152636c6f676f60e01b6044820152fd5b606460405162461bcd60e51b81526020600482015260046024820152636d65746160e01b6044820152fd5b346101b6575f3660031901126101b6576003546040516001600160a01b039091168152602090f35b346101b65760203660031901126101b657610e60611d0b565b610e7560018060a01b03600354163314611d37565b600454906001600160a01b038216610f16576001600160a01b0316908190610e9e821515611e3e565b6bffffffffffffffffffffffff60a01b16176004556b033b2e3c9fd0803ce8000000600255805f52600c6020526b033b2e3c9fd0803ce800000060405f20555f7fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60206040516b033b2e3c9fd0803ce80000008152a3005b60405162461bcd60e51b8152602060048201526005602482015264189bdd5b9960da1b6044820152606490fd5b346101b65760403660031901126101b657610f69610f5f611d0b565b6024359033611e70565b602060405160018152f35b346101b6575f3660031901126101b6576040515f600154610f9481611c46565b80845290600181169081156101925750600114610fbb576101308361011c81850382611c99565b60015f9081527fb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf6939250905b808210610fff5750909150810160200161011c61010c565b919260018160209254838588010152019101909291610fe7565b346101b6575f3660031901126101b6576040515f60065461103981611c46565b80845290600181169081156101925750600114611060576101308361011c81850382611c99565b60065f9081527ff652222313e28459528d920b65115c16c04f3efc82aaedc97be59f3f377c0d3f939250905b8082106110a45750909150810160200161011c61010c565b91926001816020925483858801015201910190929161108c565b346101b6575f3660031901126101b6576004546040516001600160a01b039091168152602090f35b346101b65760203660031901126101b6576001600160a01b03611107611d0b565b165f52600c602052602060405f2054604051908152f35b346101b6575f3660031901126101b65760405161113a81611c7e565b604051600754815f61114b83611c46565b808352926001811690811561151e57506001146114bf575b61116f92500382611c99565b8152604051600854815f61118283611c46565b80835292600181169081156114a05750600114611441575b6111a692500382611c99565b60208201908152604051600954815f6111be83611c46565b808352926001811690811561142257506001146113c3575b6111e292500382611c99565b604083810191825251600a54815f6111f983611c46565b80835292600181169081156113a45750600114611345575b61121d92500382611c99565b60608401908152604051935f600b5461123581611c46565b808852906001811690811561132157506001146112c7575b50926112ab869361129d6112b99461126d61128f9a610130990388611c99565b8660808201525197519351915193604051998a9960a08b5260a08b0190611cba565b9089820360208b0152611cba565b908782036040890152611cba565b908582036060870152611cba565b908382036080850152611cba565b600b5f90815291507f0175b7a638427703f0dbe7bb9bbf987a2551717b34e79f33b5b1008d1fa01db95b81831061130757505085016020016112ab61124d565b6001816020929493945483858c01015201910191906112f1565b60ff19166020808a019190915291151560051b880190910191506112ab905061124d565b50600a5f90815290917fc65a7bb8d6351c1cf70c95a316cc6a92839c986682d98bc35f958f4883f9d2a85b81831061138857505090602061121d92820101611211565b6020919350806001915483858801015201910190918392611370565b6020925061121d94915060ff191682840152151560051b820101611211565b5060095f90815290917f6e1540171b6c0c960b71a7020d9f60077f6af931a8bbf590da0223dacf75c7af5b8183106114065750509060206111e2928201016111d6565b60209193508060019154838588010152019101909183926113ee565b602092506111e294915060ff191682840152151560051b8201016111d6565b5060085f90815290917ff3f7a9fe364faab93b216da50a3214154f22a0a2b415b23a84c8169e8b636ee35b8183106114845750509060206111a69282010161119a565b602091935080600191548385880101520191019091839261146c565b602092506111a694915060ff191682840152151560051b82010161119a565b5060075f90815290917fa66cc928b5edb82af9bd49922954155ab7b0942694bea4ce44661d9a8736c6885b81831061150257505090602061116f92820101611163565b60209193508060019154838588010152019101909183926114ea565b6020925061116f94915060ff191682840152151560051b820101611163565b346101b6575f3660031901126101b657602060405160128152f35b346101b65760603660031901126101b657611571611d0b565b611579611d21565b6001600160a01b0382165f818152600d6020908152604080832033845290915290205490926044359291600181016115b7575b50610f699350611e70565b838110611604578381039081116115f057610f69945f52600d60205260405f2060018060a01b0333165f5260205260405f2055846115ac565b634e487b7160e01b5f52601160045260245ffd5b60405162461bcd60e51b8152602060048201526009602482015268616c6c6f77616e636560b81b6044820152606490fd5b346101b6575f3660031901126101b6576020600254604051908152f35b346101b65760403660031901126101b65761166b611d0b565b335f818152600d602090815260408083206001600160a01b03909516808452948252918290206024359081905591519182527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591a3602060405160018152f35b346101b65760603660031901126101b6576004356001600160401b0381116101b6576116fb903690600401611cde565b6024356001600160401b0381116101b65761171a903690600401611cde565b906044359360018060a01b0385168095036101b6576004549160ff8360a01c16611b7957611749861515611d37565b611754368684611d6d565b95611760368684611d6d565b94611778885160018110159081611b6d575b50611db2565b61178f865160018110159081611b61575b50611de4565b5f5b88518110156117f557600190600160fd1b6001600160f81b03196117b5838d611e19565b51161015806117ce575b6117c890611db2565b01611791565b506117c8603f60f91b6001600160f81b03196117ea848e611e19565b5116111590506117bf565b50865f5b875181101561189e5760019061183f6001600160f81b031961181b838c611e19565b5116600360fc1b811015908161188f575b811561186b575b81156118455750611de4565b016117f9565b606160f81b81101591508161185c575b508b611789565b603d60f91b101590508b611855565b9050604160f81b81101580611881575b90611833565b50602d60f91b81111561187b565b603960f81b811115915061182c565b5060ff60a01b198616600160a01b176004556001600160401b038111610716576118c85f54611c46565b601f8111611af4575b505f601f8211600114611a74578190611901939495965f92611a695750508160011b915f199060031b1c19161790565b5f555b6001600160401b0381116107165761191d600154611c46565b601f81116119fb575b505f601f821160011461197f57819061195493945f926119745750508160011b915f199060031b1c19161790565b6001555b6bffffffffffffffffffffffff60a01b60035416176003555f80f35b0135905084806103a9565b601f198216937fb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf6915f5b8681106119e357508360019596106119ca575b505050811b01600155611958565b01355f19600384901b60f8161c191690558380806119bc565b909260206001819286860135815501940191016119a9565b818111156119265760015f52601f820160051c7fb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf660208410611a61575b81601f9101920160051c03905f5b828110611a54575050611926565b5f82820155600101611a46565b5f9150611a38565b0135905086806103a9565b601f198216955f80527f290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563915f5b888110611adc57508360019596979810611ac3575b505050811b015f55611904565b01355f19600384901b60f8161c19169055858080611ab6565b90926020600181928686013581550194019101611aa1565b818111156118d1575f8052601f820160051c7f290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e56360208410611b59575b81601f9101920160051c03905f5b828110611b4c5750506118d1565b5f82820155600101611b3e565b5f9150611b30565b6008915011158a611789565b6020915011158a611772565b606460405162461bcd60e51b81526020600482015260046024820152631a5b9a5d60e21b6044820152fd5b346101b6575f3660031901126101b6576040515f5f54611bc381611c46565b80845290600181169081156101925750600114611bea576101308361011c81850382611c99565b5f8080527f290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563939250905b808210611c2c5750909150810160200161011c61010c565b919260018160209254838588010152019101909291611c14565b90600182811c92168015611c74575b6020831014611c6057565b634e487b7160e01b5f52602260045260245ffd5b91607f1691611c55565b60a081019081106001600160401b0382111761071657604052565b90601f801991011681019081106001600160401b0382111761071657604052565b805180835260209291819084018484015e5f828201840152601f01601f1916010190565b9181601f840112156101b6578235916001600160401b0383116101b657602083818601950101116101b657565b600435906001600160a01b03821682036101b657565b602435906001600160a01b03821682036101b657565b15611d3e57565b60405162461bcd60e51b8152602060048201526007602482015266666163746f727960c81b6044820152606490fd5b9291926001600160401b0382116107165760405191611d96601f8201601f191660200184611c99565b8294818452818301116101b6578281602093845f960137010152565b15611db957565b606460405162461bcd60e51b81526020600482015260046024820152636e616d6560e01b6044820152fd5b15611deb57565b60405162461bcd60e51b81526020600482015260066024820152651cde5b589bdb60d21b6044820152606490fd5b908151811015611e2a570160200190565b634e487b7160e01b5f52603260045260245ffd5b15611e4557565b606460405162461bcd60e51b81526020600482015260046024820152637a65726f60e01b6044820152fd5b6001600160a01b0390911690611e87821515611e3e565b6001600160a01b03165f818152600c6020526040902054909190838110611fe0578390835f52600c6020520360405f2055805f52600c60205260405f2083815401905580827fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef6020604051878152a36003546040516327b16a2560e21b815290602090829060049082906001600160a01b03165afa908115611f93575f91611f9e575b506001600160a01b031680611f40575b50505050565b803b156101b6575f92836064926040519687958694637a48316560e11b86526004860152602485015260448401525af18015611f9357611f83575b808080611f3a565b5f611f8d91611c99565b5f611f7b565b6040513d5f823e3d90fd5b90506020813d602011611fd8575b81611fb960209383611c99565b810103126101b657516001600160a01b03811681036101b6575f611f2a565b3d9150611fac565b60405162461bcd60e51b815260206004820152600760248201526662616c616e636560c81b6044820152606490fdfea264697066735822122062cef7b8c0894710f2977c9c897505d269f2102a271ded35bc23b4a38f418dbc64736f6c63430008250033")) throw new Error("Token bytecode does not match SkyLaunchpad.");
	const history = decodeFunctionResult({
		abi: curveAbi,
		functionName: "history",
		data: asHex(historyR, "history")
	});
	const prints = decodeFunctionResult({
		abi: curveAbi,
		functionName: "prints",
		data: asHex(printsR, "prints")
	});
	const quote = decodeFunctionResult({
		abi: curveAbi,
		functionName: "quote",
		data: asHex(quoteR, "quote")
	});
	let quoteSymbol = "ETH";
	if (quote !== "0x0000000000000000000000000000000000000000") try {
		const [symbolR] = await batch(relay, [call(quote, encodeFunctionData({
			abi: tokenAbi,
			functionName: "symbol",
			args: []
		}))]);
		quoteSymbol = decodeFunctionResult({
			abi: tokenAbi,
			functionName: "symbol",
			data: asHex(symbolR, "symbol")
		}) || "TOKEN";
	} catch {
		quoteSymbol = "TOKEN";
	}
	return {
		curve,
		token,
		creator: decodeFunctionResult({
			abi: curveAbi,
			functionName: "creator",
			data: asHex(creatorR, "creator")
		}),
		protocol: decodeFunctionResult({
			abi: curveAbi,
			functionName: "protocol",
			data: asHex(protocolR, "protocol")
		}),
		factory: decodeFunctionResult({
			abi: curveAbi,
			functionName: "factory",
			data: asHex(factoryR, "factory")
		}),
		name: decodeFunctionResult({
			abi: tokenAbi,
			functionName: "name",
			data: asHex(nameR, "name")
		}),
		symbol: decodeFunctionResult({
			abi: tokenAbi,
			functionName: "symbol",
			data: asHex(symbolR, "symbol")
		}),
		metadataUri: decodeFunctionResult({
			abi: curveAbi,
			functionName: "metadataUri",
			data: asHex(metaR, "metadata")
		}),
		logo: decodeFunctionResult({
			abi: tokenAbi,
			functionName: "logo",
			data: asHex(logoR, "logo")
		}),
		totalSupply: decodeFunctionResult({
			abi: tokenAbi,
			functionName: "totalSupply",
			data: asHex(supplyR, "supply")
		}),
		launchedAt: Number(decodeFunctionResult({
			abi: curveAbi,
			functionName: "launchedAt",
			data: asHex(launchedR, "time")
		})),
		virtualEth: pick(state, 0, "virtualEth_"),
		virtualToken: pick(state, 1, "virtualToken_"),
		realEth: pick(state, 2, "realEth_"),
		marketCap: pick(state, 3, "marketCap_"),
		progressBps: pick(state, 4, "progressBps_"),
		graduated: pick(state, 5, "graduated_"),
		spotPrice: pick(state, 6, "spotPrice_"),
		quote,
		quoteSymbol,
		feeRecipient: decodeFunctionResult({
			abi: curveAbi,
			functionName: "feeRecipient",
			data: asHex(feeWalletR, "fee wallet")
		}),
		poolId: decodeFunctionResult({
			abi: curveAbi,
			functionName: "poolId",
			data: asHex(poolIdR, "pool")
		}),
		history: pick(history, 0, "caps").map((cap, i) => ({
			cap,
			time: Number(pick(history, 1, "times")[i] ?? 0)
		})),
		prints: prints.map((print) => ({
			time: Number(pick(print, 0, "time")),
			ethAmount: pick(print, 1, "ethAmount"),
			tokenAmount: pick(print, 2, "tokenAmount"),
			isBuy: pick(print, 3, "isBuy"),
			trader: pick(print, 4, "trader")
		}))
	};
}
async function readHolding(relay, token, curve, owner, quote = zeroAddress) {
	const calls = [
		{
			method: "eth_getBalance",
			params: [owner, "latest"]
		},
		call(token, encodeFunctionData({
			abi: tokenAbi,
			functionName: "balanceOf",
			args: [owner]
		})),
		call(token, encodeFunctionData({
			abi: tokenAbi,
			functionName: "allowance",
			args: [owner, curve]
		}))
	];
	if (quote !== "0x0000000000000000000000000000000000000000") {
		calls.push(call(quote, encodeFunctionData({
			abi: tokenAbi,
			functionName: "balanceOf",
			args: [owner]
		})));
		calls.push(call(quote, encodeFunctionData({
			abi: tokenAbi,
			functionName: "allowance",
			args: [owner, curve]
		})));
	}
	const [eth, tokens, allowance, quoteBalance, quoteAllowance] = await batch(relay, calls);
	return {
		eth: BigInt(String(eth)),
		tokens: decodeFunctionResult({
			abi: tokenAbi,
			functionName: "balanceOf",
			data: asHex(tokens, "balance")
		}),
		allowance: decodeFunctionResult({
			abi: tokenAbi,
			functionName: "allowance",
			data: asHex(allowance, "allowance")
		}),
		quoteBalance: quote === "0x0000000000000000000000000000000000000000" ? BigInt(String(eth)) : decodeFunctionResult({
			abi: tokenAbi,
			functionName: "balanceOf",
			data: asHex(quoteBalance, "quote balance")
		}),
		quoteAllowance: quote === "0x0000000000000000000000000000000000000000" ? 2n ** 256n - 1n : decodeFunctionResult({
			abi: tokenAbi,
			functionName: "allowance",
			data: asHex(quoteAllowance, "quote allowance")
		})
	};
}
async function readAllowance(relay, token, owner, spender) {
	const [result] = await batch(relay, [call(token, encodeFunctionData({
		abi: tokenAbi,
		functionName: "allowance",
		args: [owner, spender]
	}))]);
	return decodeFunctionResult({
		abi: tokenAbi,
		functionName: "allowance",
		data: asHex(result, "allowance")
	});
}
async function quoteInitialBuy(relay, factory, value, taxBps) {
	const [result] = await batch(relay, [call(factory, encodeFunctionData({
		abi: factoryAbi,
		functionName: "quoteInitialBuy",
		args: [value, taxBps]
	}))]);
	return decodeFunctionResult({
		abi: factoryAbi,
		functionName: "quoteInitialBuy",
		data: asHex(result, "quote")
	});
}
async function quoteCurveBuy(relay, curve, buyer, value) {
	const [result] = await batch(relay, [call(curve, encodeFunctionData({
		abi: curveAbi,
		functionName: "quoteBuy",
		args: [buyer, value]
	}))]);
	return pick(decodeFunctionResult({
		abi: curveAbi,
		functionName: "quoteBuy",
		data: asHex(result, "quote")
	}), 0, "tokensOut");
}
async function quoteCurveSell(relay, curve, tokens) {
	const [result] = await batch(relay, [call(curve, encodeFunctionData({
		abi: curveAbi,
		functionName: "quoteSell",
		args: [tokens]
	}))]);
	return pick(decodeFunctionResult({
		abi: curveAbi,
		functionName: "quoteSell",
		data: asHex(result, "quote")
	}), 0, "ethOut");
}
function readDescription(uri) {
	if (!uri.startsWith("data:application/json,")) return "";
	try {
		const parsed = JSON.parse(decodeURIComponent(uri.slice(22)));
		return typeof parsed.description === "string" ? parsed.description : "";
	} catch {
		return "";
	}
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var ALLOWED = /* @__PURE__ */ new Set([
	"eth_chainId",
	"eth_blockNumber",
	"eth_gasPrice",
	"eth_getBalance",
	"eth_getCode",
	"eth_call",
	"eth_estimateGas",
	"eth_getTransactionReceipt",
	"eth_getTransactionByHash"
]);
function assertCalls(input) {
	if (!input || typeof input !== "object" || !("calls" in input)) throw new Error("Missing RPC calls.");
	const calls = input.calls;
	if (!Array.isArray(calls) || calls.length < 1 || calls.length > 24) throw new Error("RPC batch must be 1–24 calls.");
	const clean = [];
	for (const call of calls) {
		if (!call || typeof call !== "object") throw new Error("Bad RPC call.");
		const method = call.method;
		const params = call.params;
		if (typeof method !== "string" || !ALLOWED.has(method)) throw new Error("That RPC method is not allowed.");
		if (!Array.isArray(params) || params.length > 4) throw new Error("Bad RPC params.");
		if (JSON.stringify(params).length > 8e4) throw new Error("RPC params are too large.");
		clean.push({
			method,
			params
		});
	}
	return { calls: clean };
}
/** Read-only relay to Robinhood Chain mainnet. Sends are signed in the wallet, never here. */
var robinhoodRelay = createServerFn({ method: "POST" }).validator(assertCalls).handler(createSsrRpc("242bc70529b43905379a92defc0916bd4ef240b9d4bff5130479717c45619aea"));
var STORAGE_KEY = "skylaunchpad.factory";
var Ctx$1 = (0, import_react.createContext)(null);
function readStored() {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (isAddress$1(stored)) return stored;
	} catch {}
	return OFFICIAL_FACTORY;
}
function ProtocolProvider({ children }) {
	const relayFn = useServerFn(robinhoodRelay);
	const relayRef = (0, import_react.useRef)(relayFn);
	relayRef.current = relayFn;
	const relay = (0, import_react.useCallback)(async (calls) => {
		return unwrap(await relayRef.current({ data: { calls } }));
	}, []);
	const factoryRef = (0, import_react.useRef)(OFFICIAL_FACTORY);
	const busy = (0, import_react.useRef)(false);
	const [state, setState] = (0, import_react.useState)({
		phase: "boot",
		factory: OFFICIAL_FACTORY,
		info: null,
		launches: [],
		chain: null,
		reason: "",
		refreshedAt: 0
	});
	const load = (0, import_react.useCallback)(async (factory) => {
		let chain = null;
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
				refreshedAt: Date.now()
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
				refreshedAt: Date.now()
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
				refreshedAt: Date.now()
			});
		} catch (error) {
			setState({
				phase: "bad",
				factory,
				info: null,
				launches: [],
				chain,
				reason: explainError(error),
				refreshedAt: Date.now()
			});
		}
	}, [relay]);
	const refresh = (0, import_react.useCallback)(async () => {
		if (busy.current) return;
		busy.current = true;
		try {
			await load(factoryRef.current);
		} finally {
			busy.current = false;
		}
	}, [load]);
	const pinFactory = (0, import_react.useCallback)(async (factory) => {
		localStorage.setItem(STORAGE_KEY, factory);
		factoryRef.current = factory;
		await load(factory);
	}, [load]);
	const clearFactory = (0, import_react.useCallback)(() => {
		localStorage.removeItem(STORAGE_KEY);
		factoryRef.current = OFFICIAL_FACTORY;
		const url = new URL(window.location.href);
		url.searchParams.delete("factory");
		window.history.replaceState({}, "", url);
		load(OFFICIAL_FACTORY);
	}, [load]);
	(0, import_react.useEffect)(() => {
		const initial = readStored();
		factoryRef.current = initial;
		refresh();
		const timer = window.setInterval(() => {
			refresh();
		}, 2e4);
		return () => window.clearInterval(timer);
	}, [refresh]);
	const api = (0, import_react.useMemo)(() => ({
		...state,
		relay,
		refresh,
		pinFactory,
		clearFactory
	}), [
		state,
		relay,
		refresh,
		pinFactory,
		clearFactory
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ctx$1.Provider, {
		value: api,
		children
	});
}
function useProtocol() {
	const ctx = (0, import_react.useContext)(Ctx$1);
	if (!ctx) throw new Error("Protocol provider missing.");
	return ctx;
}
function getEthereum() {
	if (typeof window === "undefined") return null;
	const eth = window.ethereum;
	if (!eth || typeof eth.request !== "function") return null;
	return eth;
}
async function readSilentAccount(eth) {
	const [accounts, chain] = await Promise.all([eth.request({ method: "eth_accounts" }), eth.request({ method: "eth_chainId" })]);
	const list = Array.isArray(accounts) ? accounts : [];
	return {
		address: typeof list[0] === "string" ? list[0] : null,
		chainId: typeof chain === "string" ? Number(chain) : null
	};
}
async function connectWallet(eth) {
	const accounts = await eth.request({ method: "eth_requestAccounts" });
	const list = Array.isArray(accounts) ? accounts : [];
	if (typeof list[0] !== "string") throw new Error("Wallet returned no account.");
	return list[0];
}
async function ensureRobinhood(eth) {
	const current = await eth.request({ method: "eth_chainId" });
	if (typeof current === "string" && Number(current) === 4663) return;
	try {
		await eth.request({
			method: "wallet_switchEthereumChain",
			params: [{ chainId: CHAIN_ID_HEX }]
		});
	} catch (error) {
		const code = error.code;
		const message = error instanceof Error ? error.message : String(error);
		if (code === 4902 || /4902|unrecognized chain|wallet_addEthereumChain/i.test(message)) {
			await eth.request({
				method: "wallet_addEthereumChain",
				params: [{
					chainId: CHAIN_ID_HEX,
					chainName: CHAIN_NAME,
					nativeCurrency: {
						name: "Ether",
						symbol: "ETH",
						decimals: 18
					},
					rpcUrls: [RPC_PUBLIC],
					blockExplorerUrls: [EXPLORER]
				}]
			});
			return;
		}
		throw error;
	}
}
async function estimateOrThrow(relay, tx) {
	await relay([{
		method: "eth_estimateGas",
		params: [{
			from: tx.from,
			to: tx.to,
			data: tx.data,
			value: tx.value != null ? toHex(tx.value) : void 0
		}]
	}]);
}
async function sendTx(eth, tx) {
	const hash = await eth.request({
		method: "eth_sendTransaction",
		params: [{
			from: tx.from,
			to: tx.to,
			data: tx.data,
			value: tx.value != null ? toHex(tx.value) : "0x0"
		}]
	});
	if (typeof hash !== "string" || !hash.startsWith("0x")) throw new Error("Wallet did not return a transaction hash.");
	return hash;
}
async function waitForReceipt(relay, hash) {
	for (let attempt = 0; attempt < 40; attempt++) {
		const [receipt] = await relay([{
			method: "eth_getTransactionReceipt",
			params: [hash]
		}]);
		if (receipt && typeof receipt === "object") {
			const row = receipt;
			return {
				ok: row.status === "0x1" || row.status === "1",
				contractAddress: typeof row.contractAddress === "string" && row.contractAddress.startsWith("0x") ? row.contractAddress : null,
				logs: (row.logs ?? []).map((log) => ({
					address: String(log.address ?? ""),
					topics: log.topics ?? [],
					data: log.data ?? "0x"
				}))
			};
		}
		await new Promise((resolve) => setTimeout(resolve, 1500));
	}
	throw new Error("The transaction is still pending. Check the explorer for the hash.");
}
function factoryInitData(protocol, hookSalt) {
	return encodeDeployData({
		abi: factoryAbi,
		bytecode: factoryBytecode,
		args: [protocol, hookSalt]
	});
}
var HOOK_MASK = 16383n;
var HOOK_FLAG = 8772n;
/** Salt whose CREATE2 address has the Sky hook permission bits and no others. */
function mineHookSalt(factory) {
	const rewards = getContractAddress({
		from: factory,
		nonce: 4n
	});
	const init = concat([hookBytecode, encodeAbiParameters([{ type: "address" }, { type: "address" }], [V4_POOL_MANAGER, rewards])]);
	const bytecodeHash = keccak256(init);
	for (let i = 0; i < 5e5; i++) {
		const salt = toHex(i, { size: 32 });
		const addr = getCreate2Address({
			from: factory,
			salt,
			bytecodeHash
		});
		if ((BigInt(addr) & HOOK_MASK) === HOOK_FLAG) return salt;
	}
	throw new Error("Could not find a Uniswap hook address. Try the deploy again.");
}
async function pendingNonce(eth, account) {
	const nonce = await eth.request({
		method: "eth_getTransactionCount",
		params: [account, "pending"]
	});
	return Number(nonce);
}
function predictedFactory(account, nonce) {
	return getContractAddress({
		from: account,
		nonce: BigInt(nonce)
	});
}
function openPoolCalldata() {
	return encodeFunctionData({
		abi: curveAbi,
		functionName: "openPool",
		args: []
	});
}
function pendingRewardsCalldata(token, user) {
	return encodeFunctionData({
		abi: rewardsAbi,
		functionName: "pending",
		args: [token, user]
	});
}
function claimRewardsCalldata(token) {
	return encodeFunctionData({
		abi: rewardsAbi,
		functionName: "claim",
		args: [token]
	});
}
function tradeCalldata(token, quote, buyingToken, amountIn, minOut, recipient) {
	return encodeFunctionData({
		abi: poolAbi,
		functionName: "trade",
		args: [
			token,
			quote,
			buyingToken,
			amountIn,
			minOut,
			recipient
		]
	});
}
function quoteV4Calldata(token, quote, hook, zeroForOne, amountIn) {
	const currency0 = token.toLowerCase() < quote.toLowerCase() ? token : quote;
	return encodeFunctionData({
		abi: [{
			type: "function",
			name: "quoteExactInputSingle",
			stateMutability: "nonpayable",
			inputs: [{
				name: "params",
				type: "tuple",
				components: [
					{
						name: "poolKey",
						type: "tuple",
						components: [
							{
								name: "currency0",
								type: "address"
							},
							{
								name: "currency1",
								type: "address"
							},
							{
								name: "fee",
								type: "uint24"
							},
							{
								name: "tickSpacing",
								type: "int24"
							},
							{
								name: "hooks",
								type: "address"
							}
						]
					},
					{
						name: "zeroForOne",
						type: "bool"
					},
					{
						name: "exactAmount",
						type: "uint128"
					},
					{
						name: "hookData",
						type: "bytes"
					}
				]
			}],
			outputs: [{
				name: "amountOut",
				type: "uint256"
			}, {
				name: "gasEstimate",
				type: "uint256"
			}]
		}],
		functionName: "quoteExactInputSingle",
		args: [{
			poolKey: {
				currency0,
				currency1: currency0 === token ? quote : token,
				fee: 3e3,
				tickSpacing: 60,
				hooks: hook
			},
			zeroForOne,
			exactAmount: amountIn,
			hookData: "0x"
		}]
	});
}
function zeroForOne(token, quote, buyingToken) {
	const quoteIsCurrency0 = quote.toLowerCase() < token.toLowerCase();
	return buyingToken ? quoteIsCurrency0 : !quoteIsCurrency0;
}
function launchCalldata(name, symbol, logo, description, socials, quote, buyAmount, taxBps, feeWallet, team, minTokens) {
	return encodeFunctionData({
		abi: factoryAbi,
		functionName: "launch",
		args: [{
			name,
			symbol,
			logo,
			description,
			socials,
			quote,
			buyAmount,
			taxBps,
			feeWallet,
			team,
			minTokens
		}]
	});
}
function buyCalldata(recipient, minTokens) {
	return encodeFunctionData({
		abi: curveAbi,
		functionName: "buy",
		args: [recipient, minTokens]
	});
}
function buyQuoteCalldata(recipient, amount, minTokens) {
	return encodeFunctionData({
		abi: curveAbi,
		functionName: "buyQuote",
		args: [
			recipient,
			amount,
			minTokens
		]
	});
}
function sellCalldata(tokensIn, minEth) {
	return encodeFunctionData({
		abi: curveAbi,
		functionName: "sell",
		args: [tokensIn, minEth]
	});
}
function approveCalldata(spender, amount) {
	return encodeFunctionData({
		abi: tokenAbi,
		functionName: "approve",
		args: [spender, amount]
	});
}
var Ctx = (0, import_react.createContext)(null);
function WalletProvider({ children }) {
	const [address, setAddress] = (0, import_react.useState)(null);
	const [chainId, setChainId] = (0, import_react.useState)(null);
	const [hasProvider, setHasProvider] = (0, import_react.useState)(false);
	const [ready, setReady] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const eth = getEthereum();
		setHasProvider(Boolean(eth));
		if (!eth) {
			setReady(true);
			return;
		}
		let cancelled = false;
		readSilentAccount(eth).then((found) => {
			if (cancelled) return;
			setAddress(found.address);
			setChainId(found.chainId);
		}).catch(() => void 0).finally(() => {
			if (!cancelled) setReady(true);
		});
		const onAccounts = (...args) => {
			const accounts = args[0];
			const list = Array.isArray(accounts) ? accounts : [];
			setAddress(typeof list[0] === "string" ? list[0] : null);
		};
		const onChain = (...args) => {
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
	const api = (0, import_react.useMemo)(() => ({
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
				const next = await connectWallet(eth);
				const found = await readSilentAccount(eth);
				setAddress(next);
				setChainId(found.chainId);
			} finally {
				setBusy(false);
			}
		},
		forget: () => setAddress(null)
	}), [
		address,
		chainId,
		hasProvider,
		ready,
		busy
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ctx.Provider, {
		value: api,
		children
	});
}
function useWallet() {
	const ctx = (0, import_react.useContext)(Ctx);
	if (!ctx) throw new Error("Wallet provider missing.");
	return ctx;
}
//#endregion
export { readMarket as $, displayName as A, mineHookSalt as B, approveCalldata as C, capNumber as D, buyQuoteCalldata as E, factoryInitData as F, predictedFactory as G, parseEth as H, formatEth as I, quoteInitialBuy as J, quoteCurveBuy as K, formatTokens as L, estimateOrThrow as M, explainError as N, claimRewardsCalldata as O, factoryAbi as P, readHolding as Q, isAddress$1 as R, ago as S, buyCalldata as T, pendingNonce as U, openPoolCalldata as V, pendingRewardsCalldata as W, readAllowance as X, quoteV4Calldata as Y, readDescription as Z, TOTAL_SUPPLY as _, CREATOR_SHARE_BPS as a, useServerFn as at, VIRTUAL_ETH as b, GRADUATION_ETH as c, zeroForOne as ct, MAX_CREATOR_TAX_BPS as d, sellCalldata as et, MIN_TRADE_ETH as f, SNIPE_WINDOW as g, SNIPE_START_BPS as h, CONNECT_DOCS as i, useProtocol as it, ensureRobinhood as j, createSsrRpc as k, K as l, RPC_PUBLIC as m, CHAIN_ID as n, shortAddr as nt, EXPLORER as o, useWallet as ot, ProtocolProvider as p, quoteCurveSell as q, CHAIN_NAME as r, tradeCalldata as rt, FEE_BPS as s, waitForReceipt as st, BRIDGE_DOCS as t, sendTx as tt, LAUNCH_FEE as u, V4_QUOTER as v, bpsLabel as w, WalletProvider as x, VERSION as y, launchCalldata as z };
