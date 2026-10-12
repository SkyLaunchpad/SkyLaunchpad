/** Keep in lockstep with contracts/SkyParams.sol. Live factories are checked on chain. */
export const TOTAL_SUPPLY = 1_000_000_000n * 10n ** 18n;
export const VIRTUAL_ETH = 1_500_000_000_000_000_000n;
export const GRADUATION_ETH = 4_200_000_000_000_000_000n;
export const FEE_BPS = 100n;
export const CREATOR_SHARE_BPS = 7_000n;
export const LAUNCH_FEE = 500_000_000_000_000n;
export const MIN_TRADE_ETH = 10_000_000_000_000n;
export const K = VIRTUAL_ETH * TOTAL_SUPPLY;
export const MAX_CREATOR_TAX_BPS = 300n;
export const SNIPE_START_BPS = 9_900n;
export const SNIPE_WINDOW = 5n;
export const VERSION = "skylaunchpad-4";

export const CHAIN_ID = 4663;
export const CHAIN_ID_HEX = "0x1237";
export const CHAIN_NAME = "Robinhood Chain";
export const RPC_PUBLIC = "https://rpc.mainnet.chain.robinhood.com";
export const EXPLORER = "https://robinhoodchain.blockscout.com";
export const BRIDGE_DOCS = "https://docs.robinhood.com/chain/bridging/";
export const CONNECT_DOCS = "https://docs.robinhood.com/chain/connecting/";

export const EXPECTED_PARAMS = [
  LAUNCH_FEE,
  GRADUATION_ETH,
  VIRTUAL_ETH,
  TOTAL_SUPPLY,
  FEE_BPS,
  CREATOR_SHARE_BPS,
  MIN_TRADE_ETH,
  MAX_CREATOR_TAX_BPS,
] as const;
