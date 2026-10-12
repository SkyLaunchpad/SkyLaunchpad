// SPDX-License-Identifier: MIT
pragma solidity 0.8.37;

import {SkyParams} from "./SkyParams.sol";
import {SkyCurve} from "./SkyCurve.sol";
import {SkyToken} from "./SkyToken.sol";
import {SkyHook} from "./SkyHook.sol";
import {SkyPool} from "./SkyPool.sol";
import {SkyRewards} from "./SkyRewards.sol";
import {SkyLocker} from "./SkyLocker.sol";

interface IQuoteToken {
    function balanceOf(address account) external view returns (uint256);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

/// @title SkyFactory
/// @notice Deploys a SkyToken and its SkyCurve in one transaction.
///         The deploying wallet is the protocol treasury. It cannot touch liquidity.
contract SkyFactory {
    struct Launch {
        address token;
        address curve;
        address creator;
        string name;
        string symbol;
        string metadataUri;
        uint64 launchedAt;
    }

    struct CurveView {
        address token;
        address curve;
        address creator;
        string name;
        string symbol;
        string metadataUri;
        uint64 launchedAt;
        uint256 virtualEth;
        uint256 virtualToken;
        uint256 realEth;
        uint256 marketCap;
        uint256 progressBps;
        bool graduated;
        uint256 spotPrice;
    }

    address public protocol;
    address public immutable tokenImplementation;
    address public immutable curveImplementation;
    address public immutable hook;
    address public immutable pool;
    address public immutable rewards;
    address public immutable locker;
    bool private entered;

    address internal constant POOL_MANAGER = 0x8366a39CC670B4001A1121B8F6A443A643e40951;

    Launch[] private _launches;

    event Launched(
        address indexed token,
        address indexed curve,
        address indexed creator,
        string name,
        string symbol,
        string metadataUri
    );
    event ProtocolUpdated(address indexed next);

    modifier nonReentrant() {
        require(!entered, "reentrancy");
        entered = true;
        _;
        entered = false;
    }

    constructor(address protocol_, bytes32 hookSalt) {
        require(protocol_ != address(0), "protocol");
        protocol = protocol_;
        tokenImplementation = address(new SkyToken());
        curveImplementation = address(new SkyCurve());
        locker = address(new SkyLocker());
        rewards = address(new SkyRewards());
        hook = address(new SkyHook{salt: hookSalt}(POOL_MANAGER, rewards));
        require((uint160(hook) & 0x3FFF) == 0x2244, "hook");
        pool = address(new SkyPool(POOL_MANAGER, hook));
        SkyHook(payable(hook)).authorize(pool);
        SkyRewards(rewards).setHook(hook);
    }

    function version() external pure returns (string memory) {
        return SkyParams.VERSION;
    }

    function parameters()
        external
        pure
        returns (
            uint256 launchFee,
            uint256 graduationEth,
            uint256 virtualEth,
            uint256 totalSupply,
            uint256 feeBps,
            uint256 creatorShareBps,
            uint256 minTradeEth,
            uint256 maxCreatorTaxBps
        )
    {
        return (
            SkyParams.LAUNCH_FEE,
            SkyParams.GRADUATION_ETH,
            SkyParams.VIRTUAL_ETH,
            SkyParams.TOTAL_SUPPLY,
            SkyParams.FEE_BPS,
            SkyParams.CREATOR_SHARE_BPS,
            SkyParams.MIN_TRADE_ETH,
            SkyParams.MAX_CREATOR_TAX_BPS
        );
    }

    function quoteInitialBuy(uint256 value, uint16 taxBps) external pure returns (uint256 tokensOut) {
        require(value >= SkyParams.MIN_TRADE_ETH, "min");
        require(taxBps <= SkyParams.MAX_CREATOR_TAX_BPS, "tax");
        uint256 tax = (value * taxBps) / 10_000;
        uint256 fee = (value * SkyParams.FEE_BPS) / 10_000;
        uint256 net = value - tax - fee;
        uint256 newVirtualEth = SkyParams.VIRTUAL_ETH + net;
        uint256 newVirtualToken = SkyParams.K / newVirtualEth;
        require(newVirtualToken < SkyParams.TOTAL_SUPPLY, "reserve");
        tokensOut = SkyParams.TOTAL_SUPPLY - newVirtualToken;
        require(tokensOut > 0, "dust");
    }

    function setProtocol(address next) external {
        require(msg.sender == protocol, "protocol");
        require(next != address(0), "zero");
        protocol = next;
        emit ProtocolUpdated(next);
    }

    function launchCount() external view returns (uint256) {
        return _launches.length;
    }

    struct Socials {
        string twitter;
        string telegram;
        string discord;
        string website;
        string farcaster;
    }

    struct LaunchArgs {
        string name;
        string symbol;
        string logo;
        string description;
        Socials socials;
        address quote;
        uint256 buyAmount;
        uint16 taxBps;
        address feeWallet;
        address[] team;
        uint256 minTokens;
    }

    /// @notice Launch fee is always ETH. Extra ETH is the creator buy only when quote is the zero address.
    ///         A stock pair sends `buyAmount` of that ERC-20, and msg.value must be exactly the launch fee.
    function launch(LaunchArgs calldata a) external payable nonReentrant returns (address tokenAddr, address curveAddr) {
        require(a.taxBps <= SkyParams.MAX_CREATOR_TAX_BPS, "tax");
        require(a.team.length <= SkyParams.MAX_TEAM, "team");
        uint256 buyValue = _buyValue(a.quote, a.buyAmount);
        if (buyValue == 0) require(a.minTokens == 0, "minTokens");
        else require(buyValue >= SkyParams.MIN_TRADE_ETH, "min");

        tokenAddr = _clone(tokenImplementation);
        SkyToken(tokenAddr).initialize(a.name, a.symbol, address(this));
        SkyToken(tokenAddr).setMeta(
            a.logo,
            a.description,
            a.socials.twitter,
            a.socials.telegram,
            a.socials.discord,
            a.socials.website,
            a.socials.farcaster
        );
        curveAddr = _clone(curveImplementation);
        SkyCurve(curveAddr).initialize(tokenAddr, msg.sender, protocol, a.description, a.taxBps, a.team, a.quote, a.feeWallet);
        SkyToken(tokenAddr).bindCurve(curveAddr);

        _launches.push(
            Launch({
                token: tokenAddr,
                curve: curveAddr,
                creator: msg.sender,
                name: a.name,
                symbol: a.symbol,
                metadataUri: a.description,
                launchedAt: uint64(block.timestamp)
            })
        );

        if (a.quote == address(0)) {
            if (buyValue > 0) SkyCurve(curveAddr).buy{value: buyValue}(msg.sender, a.minTokens);
        } else if (buyValue > 0) {
            _pullQuote(a.quote, curveAddr, a.buyAmount, a.minTokens);
        }
        (bool ok,) = protocol.call{value: SkyParams.LAUNCH_FEE}("");
        require(ok, "fee pay");

        emit Launched(tokenAddr, curveAddr, msg.sender, a.name, a.symbol, a.description);
    }

    function _buyValue(address quote, uint256 buyAmount) internal view returns (uint256 buyValue) {
        if (quote == address(0)) {
            require(msg.value >= SkyParams.LAUNCH_FEE, "fee");
            require(buyAmount == 0, "buyAmount");
            return msg.value - SkyParams.LAUNCH_FEE;
        }
        require(msg.value == SkyParams.LAUNCH_FEE, "fee");
        return buyAmount;
    }

    function _pullQuote(address quote, address curveAddr, uint256 buyAmount, uint256 minTokens) internal {
        uint256 beforeBal = IQuoteToken(quote).balanceOf(curveAddr);
        require(IQuoteToken(quote).transferFrom(msg.sender, curveAddr, buyAmount), "pull");
        uint256 got = IQuoteToken(quote).balanceOf(curveAddr) - beforeBal;
        SkyCurve(curveAddr).buyFromFactory(msg.sender, got, minTokens);
    }

    function newest(uint256 limit) external view returns (CurveView[] memory out) {
        uint256 n = _launches.length;
        if (limit > 40) limit = 40;
        if (limit > n) limit = n;
        out = new CurveView[](limit);
        for (uint256 i = 0; i < limit; i++) {
            out[i] = _materialize(_launches[n - 1 - i]);
        }
    }

    function _materialize(Launch storage L) internal view returns (CurveView memory v) {
        (
            uint256 vEth,
            uint256 vTok,
            uint256 real,
            uint256 cap,
            uint256 progress,
            bool grad,
            uint256 spot
        ) = SkyCurve(L.curve).viewState();
        v.token = L.token;
        v.curve = L.curve;
        v.creator = L.creator;
        v.name = L.name;
        v.symbol = L.symbol;
        v.metadataUri = L.metadataUri;
        v.launchedAt = L.launchedAt;
        v.virtualEth = vEth;
        v.virtualToken = vTok;
        v.realEth = real;
        v.marketCap = cap;
        v.progressBps = progress;
        v.graduated = grad;
        v.spotPrice = spot;
    }

    function _clone(address impl) internal returns (address instance) {
        assembly {
            let ptr := mload(0x40)
            mstore(ptr, 0x3d602d80600a3d3981f3363d3d373d3d3d363d73000000000000000000000000)
            mstore(add(ptr, 0x14), shl(0x60, impl))
            mstore(add(ptr, 0x28), 0x5af43d82803e903d91602b57fd5bf30000000000000000000000000000000000)
            instance := create(0, ptr, 0x37)
        }
        require(instance != address(0), "clone");
    }
}
