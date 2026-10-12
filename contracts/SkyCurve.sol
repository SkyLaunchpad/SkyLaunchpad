// SPDX-License-Identifier: MIT
pragma solidity 0.8.37;

import {SkyParams} from "./SkyParams.sol";
import {SkyToken} from "./SkyToken.sol";

interface IQuoteToken {
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

/// @title SkyCurve
/// @notice Constant-product market for one SkyToken.
///         Virtual ETH is not money. Real ETH stays here until holders sell.
///         There is no withdraw. Crossing 4.2 ETH marks the market graduated.
///         Buys in the first 5 seconds pay a decaying opening tax unless the
///         buyer is the creator or on the public team list. Sells are never
///         opening-taxed. The creator tax is a quote-side cut, not a transfer tax.
contract SkyCurve {
    struct Print {
        uint64 time;
        uint128 ethAmount;
        uint128 tokenAmount;
        bool isBuy;
        address trader;
    }

    address public token;
    address public creator;
    address public protocol;
    address public factory;
    /// @notice Quote asset. The zero address means native ETH. Any other address is an ERC-20.
    address public quote;
    string public metadataUri;
    uint16 public creatorTaxBps;
    address[8] public team;
    uint8 public teamCount;

    uint256 public virtualEth;
    uint256 public virtualToken;
    uint256 public realEth;
    bool public graduated;
    uint64 public launchedAt;
    bool private initialized;
    bool private entered;

    uint256[48] private capRing;
    uint64[48] private timeRing;
    uint8 public histCount;
    uint8 public histPos;

    Print[48] private printRing;
    uint8 public printCount;
    uint8 public printPos;

    event Trade(
        address indexed trader,
        bool isBuy,
        uint256 ethAmount,
        uint256 tokenAmount,
        uint256 realEth,
        uint256 marketCap,
        uint256 timestamp
    );
    event Graduated(address indexed curve, uint256 realEth);
    event ProtocolUpdated(address indexed next);

    modifier nonReentrant() {
        require(!entered, "reentrancy");
        entered = true;
        _;
        entered = false;
    }

    constructor() {
        initialized = true;
    }

    function initialize(
        address token_,
        address creator_,
        address protocol_,
        string calldata metadata_,
        uint16 taxBps_,
        address[] calldata team_,
        address quote_
    ) external {
        require(!initialized, "init");
        require(token_ != address(0) && creator_ != address(0) && protocol_ != address(0), "zero");
        require(bytes(metadata_).length <= 480, "meta");
        require(taxBps_ <= SkyParams.MAX_CREATOR_TAX_BPS, "tax");
        require(team_.length <= SkyParams.MAX_TEAM, "team");
        initialized = true;
        token = token_;
        creator = creator_;
        protocol = protocol_;
        factory = msg.sender;
        quote = quote_;
        metadataUri = metadata_;
        creatorTaxBps = taxBps_;
        virtualEth = SkyParams.VIRTUAL_ETH;
        virtualToken = SkyParams.TOTAL_SUPPLY;
        launchedAt = uint64(block.timestamp);
        for (uint256 i = 0; i < team_.length; i++) {
            address member = team_[i];
            if (member == address(0) || member == creator_) continue;
            team[teamCount] = member;
            teamCount += 1;
        }
        _snap();
    }

    function isTeam(address who) public view returns (bool) {
        if (who == creator) return true;
        for (uint256 i = 0; i < teamCount; i++) {
            if (team[i] == who) return true;
        }
        return false;
    }

    /// @notice Opening buy tax. 99% at second 0, then 20% less of that each second, zero after 5s.
    ///         Sells and team wallets are never charged.
    function snipeTaxBps(address buyer) public view returns (uint256) {
        if (isTeam(buyer)) return 0;
        uint256 elapsed = block.timestamp - launchedAt;
        if (elapsed >= SkyParams.SNIPE_WINDOW) return 0;
        return (SkyParams.SNIPE_START_BPS * (SkyParams.SNIPE_WINDOW - elapsed)) / SkyParams.SNIPE_WINDOW;
    }

    function setProtocol(address next) external {
        require(msg.sender == protocol, "protocol");
        require(next != address(0), "zero");
        protocol = next;
        emit ProtocolUpdated(next);
    }

    function spotPrice() public view returns (uint256) {
        return (virtualEth * 1 ether) / virtualToken;
    }

    function marketCap() public view returns (uint256) {
        return (virtualEth * SkyParams.TOTAL_SUPPLY) / virtualToken;
    }

    function progressBps() public view returns (uint256) {
        if (graduated) return 10_000;
        uint256 p = (realEth * 10_000) / SkyParams.GRADUATION_ETH;
        return p > 10_000 ? 10_000 : p;
    }

    function viewState()
        external
        view
        returns (
            uint256 virtualEth_,
            uint256 virtualToken_,
            uint256 realEth_,
            uint256 marketCap_,
            uint256 progressBps_,
            bool graduated_,
            uint256 spotPrice_
        )
    {
        return (virtualEth, virtualToken, realEth, marketCap(), progressBps(), graduated, spotPrice());
    }

    function quoteBuy(address buyer, uint256 value)
        external
        view
        returns (uint256 tokensOut, uint256 fee, uint256 tax, uint256 snipe, uint256 ethNet)
    {
        require(value >= SkyParams.MIN_TRADE_ETH, "min");
        snipe = (value * snipeTaxBps(buyer)) / 10_000;
        uint256 afterSnipe = value - snipe;
        tax = (afterSnipe * creatorTaxBps) / 10_000;
        fee = (afterSnipe * SkyParams.FEE_BPS) / 10_000;
        ethNet = afterSnipe - tax - fee;
        uint256 newVirtualEth = virtualEth + ethNet;
        uint256 newVirtualToken = SkyParams.K / newVirtualEth;
        require(newVirtualToken < virtualToken, "reserve");
        tokensOut = virtualToken - newVirtualToken;
        require(tokensOut > 0, "dust");
    }

    function quoteSell(uint256 tokensIn)
        external
        view
        returns (uint256 ethOut, uint256 fee, uint256 tax, uint256 ethGross)
    {
        require(tokensIn > 0, "tokens");
        uint256 newVirtualToken = virtualToken + tokensIn;
        uint256 newVirtualEth = SkyParams.K / newVirtualToken;
        require(newVirtualEth < virtualEth, "reserve");
        require(newVirtualEth >= SkyParams.VIRTUAL_ETH, "virtual");
        ethGross = virtualEth - newVirtualEth;
        require(ethGross <= realEth && ethGross > 0, "real");
        tax = (ethGross * creatorTaxBps) / 10_000;
        fee = (ethGross * SkyParams.FEE_BPS) / 10_000;
        ethOut = ethGross - tax - fee;
        require(ethOut > 0, "dust");
    }

    function buy(address recipient, uint256 minTokens) external payable nonReentrant returns (uint256 tokensOut) {
        require(quote == address(0), "quote");
        return _fill(recipient, msg.value, minTokens);
    }

    /// @notice Buy with the ERC-20 quote. The caller must approve this curve first.
    function buyQuote(address recipient, uint256 amount, uint256 minTokens) external nonReentrant returns (uint256 tokensOut) {
        require(quote != address(0), "quote");
        return _fill(recipient, _pull(msg.sender, amount), minTokens);
    }

    /// @notice Initial buy. The factory has already delivered `amount` of quote tokens.
    function buyFromFactory(address recipient, uint256 amount, uint256 minTokens) external nonReentrant returns (uint256 tokensOut) {
        require(msg.sender == factory, "factory");
        require(quote != address(0), "quote");
        return _fill(recipient, amount, minTokens);
    }

    function _fill(address recipient, uint256 value, uint256 minTokens) internal returns (uint256 tokensOut) {
        require(initialized, "init");
        require(recipient != address(0), "recipient");
        require(value >= SkyParams.MIN_TRADE_ETH, "min");
        uint256 snipe = (value * snipeTaxBps(recipient)) / 10_000;
        uint256 afterSnipe = value - snipe;
        uint256 tax = (afterSnipe * creatorTaxBps) / 10_000;
        uint256 fee = (afterSnipe * SkyParams.FEE_BPS) / 10_000;
        uint256 net = afterSnipe - tax - fee;

        uint256 newVirtualEth = virtualEth + net;
        uint256 newVirtualToken = SkyParams.K / newVirtualEth;
        require(newVirtualToken < virtualToken, "reserve");
        tokensOut = virtualToken - newVirtualToken;
        require(tokensOut >= minTokens && tokensOut > 0, "slippage");

        virtualEth = newVirtualEth;
        virtualToken = newVirtualToken;
        realEth += net;
        if (!graduated && realEth >= SkyParams.GRADUATION_ETH) {
            graduated = true;
            emit Graduated(address(this), realEth);
        }
        _snap();
        _print(true, net, tokensOut, recipient);

        require(SkyToken(token).transfer(recipient, tokensOut), "transfer");
        _pay(fee + snipe);
        _send(creator, tax);
        emit Trade(recipient, true, net, tokensOut, realEth, marketCap(), block.timestamp);
    }

    function sell(uint256 tokensIn, uint256 minEth) external nonReentrant returns (uint256 ethOut) {
        require(initialized, "init");
        require(tokensIn > 0, "tokens");
        uint256 newVirtualToken = virtualToken + tokensIn;
        uint256 newVirtualEth = SkyParams.K / newVirtualToken;
        require(newVirtualEth < virtualEth, "reserve");
        require(newVirtualEth >= SkyParams.VIRTUAL_ETH, "virtual");
        uint256 ethGross = virtualEth - newVirtualEth;
        require(ethGross <= realEth && ethGross > 0, "real");
        uint256 tax = (ethGross * creatorTaxBps) / 10_000;
        uint256 fee = (ethGross * SkyParams.FEE_BPS) / 10_000;
        ethOut = ethGross - tax - fee;
        require(ethOut >= minEth && ethOut > 0, "slippage");

        virtualToken = newVirtualToken;
        virtualEth = newVirtualEth;
        realEth -= ethGross;
        _snap();
        _print(false, ethOut, tokensIn, msg.sender);

        require(SkyToken(token).transferFrom(msg.sender, address(this), tokensIn), "transfer");
        _pay(fee);
        _send(creator, tax);
        _send(msg.sender, ethOut);
        emit Trade(msg.sender, false, ethOut, tokensIn, realEth, marketCap(), block.timestamp);
    }

    function history() external view returns (uint256[] memory caps, uint64[] memory times) {
        uint256 n = histCount;
        caps = new uint256[](n);
        times = new uint64[](n);
        uint256 start = n < 48 ? 0 : histPos;
        for (uint256 i = 0; i < n; i++) {
            uint256 idx = (start + i) % 48;
            caps[i] = capRing[idx];
            times[i] = timeRing[idx];
        }
    }

    function prints() external view returns (Print[] memory out) {
        uint256 n = printCount;
        out = new Print[](n);
        uint256 start = n < 48 ? 0 : printPos;
        for (uint256 i = 0; i < n; i++) {
            out[i] = printRing[(start + i) % 48];
        }
    }

    function _snap() internal {
        capRing[histPos] = marketCap();
        timeRing[histPos] = uint64(block.timestamp);
        histPos = uint8((uint256(histPos) + 1) % 48);
        if (histCount < 48) histCount += 1;
    }

    function _print(bool isBuy, uint256 ethAmount, uint256 tokenAmount, address trader) internal {
        uint128 eth128 = ethAmount > type(uint128).max ? type(uint128).max : uint128(ethAmount);
        uint128 tok128 = tokenAmount > type(uint128).max ? type(uint128).max : uint128(tokenAmount);
        printRing[printPos] = Print({
            time: uint64(block.timestamp),
            ethAmount: eth128,
            tokenAmount: tok128,
            isBuy: isBuy,
            trader: trader
        });
        printPos = uint8((uint256(printPos) + 1) % 48);
        if (printCount < 48) printCount += 1;
    }

    function _pay(uint256 fee) internal {
        if (fee == 0) return;
        uint256 creatorPart = (fee * SkyParams.CREATOR_SHARE_BPS) / 10_000;
        _send(creator, creatorPart);
        _send(protocol, fee - creatorPart);
    }

    function _pull(address from, uint256 amount) internal returns (uint256 got) {
        uint256 beforeBal = IQuoteToken(quote).balanceOf(address(this));
        require(IQuoteToken(quote).transferFrom(from, address(this), amount), "pull");
        got = IQuoteToken(quote).balanceOf(address(this)) - beforeBal;
        require(got > 0, "got");
    }

    function _send(address to, uint256 amount) internal {
        if (amount == 0) return;
        if (quote == address(0)) {
            (bool ok,) = to.call{value: amount}("");
            require(ok, "pay");
            return;
        }
        require(IQuoteToken(quote).transfer(to, amount), "pay");
    }
}
