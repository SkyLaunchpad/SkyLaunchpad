// SPDX-License-Identifier: MIT
pragma solidity 0.8.37;

/// @title SkyParams
/// @notice Shared economics for SkyLaunchpad v2. One source of truth.
/// @dev Not a Pons contract. The curve trades until 4.2 of the quote asset is raised.
///      At 4.2 the real reserves move into a full-range Uniswap v4 position.
///      Creator fees are paid to a chosen wallet on the same trade, or split
///      across holders. They are not locked for five years.
library SkyParams {
    uint256 internal constant TOTAL_SUPPLY = 1_000_000_000 ether;
    uint256 internal constant VIRTUAL_ETH = 1.5 ether;
    uint256 internal constant GRADUATION_ETH = 4.2 ether;
    uint256 internal constant FEE_BPS = 100;
    uint256 internal constant CREATOR_SHARE_BPS = 7_000;
    uint256 internal constant LAUNCH_FEE = 0.0005 ether;
    uint256 internal constant MIN_TRADE_ETH = 0.00001 ether;
    uint256 internal constant K = VIRTUAL_ETH * TOTAL_SUPPLY;
    uint256 internal constant MAX_CREATOR_TAX_BPS = 300;
    uint256 internal constant SNIPE_START_BPS = 9_900;
    uint256 internal constant SNIPE_WINDOW = 5;
    uint256 internal constant MAX_TEAM = 8;
    string internal constant VERSION = "skylaunchpad-7";
}
