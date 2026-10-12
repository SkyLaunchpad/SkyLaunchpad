// SPDX-License-Identifier: MIT
pragma solidity 0.8.37;

interface ISkyQuote {
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

interface ISkyHookRegister {
    function register(address token, address quote, address feeRecipient, uint16 taxBps) external returns (bytes32 poolId);
}

interface ICurveFee {
    function feeRecipient() external view returns (address);
}

interface ISkyManager {
    function unlock(bytes calldata data) external returns (bytes memory);
    function initialize(
        address currency0,
        address currency1,
        uint24 fee,
        int24 tickSpacing,
        address hooks,
        uint160 sqrtPriceX96
    ) external returns (int24);
    function modifyLiquidity(
        address currency0,
        address currency1,
        uint24 fee,
        int24 tickSpacing,
        address hooks,
        int24 tickLower,
        int24 tickUpper,
        int256 liquidityDelta,
        bytes32 salt,
        bytes calldata hookData
    ) external returns (int256 callerDelta, int256 feesAccrued);
    function swap(
        address currency0,
        address currency1,
        uint24 fee,
        int24 tickSpacing,
        address hooks,
        bool zeroForOne,
        int256 amountSpecified,
        uint160 sqrtPriceLimitX96,
        bytes calldata hookData
    ) external returns (int256 swapDelta);
    function sync(address currency) external;
    function settle() external payable returns (uint256);
    function take(address currency, address to, uint256 amount) external;
}

/// @title SkyPool
/// @notice Seeds a full-range Uniswap v4 position and swaps against it.
///         The position owner is this contract. It has no withdraw function.
///         SkyHook also reverts on every remove, including fee collection.
contract SkyPool {
    uint24 internal constant FEE = 3000;
    int24 internal constant SPACING = 60;
    int24 internal constant TICK_LOWER = -887220;
    int24 internal constant TICK_UPPER = 887220;
    uint160 internal constant SQRT_LOWER = 4306310044;
    uint160 internal constant SQRT_UPPER = 1457652066949847389969617340386294118487833376468;
    uint160 internal constant MIN_SQRT = 4295128740;
    uint160 internal constant MAX_SQRT = 1461446703485210103287273052203988822378723970341;
    uint256 internal constant Q96 = 2 ** 96;

    address public immutable manager;
    address public immutable hook;
    address public immutable factory;

    struct Held {
        address token;
        address quote;
        address creator;
        uint256 tokenAmt;
        uint256 quoteAmt;
        uint16 taxBps;
        bool ready;
    }

    mapping(address => Held) public held;

    event Seeded(address indexed curve, bytes32 indexed poolId);

    constructor(address manager_, address hook_) {
        require(manager_ != address(0) && hook_ != address(0), "zero");
        manager = manager_;
        hook = hook_;
        factory = msg.sender;
    }

    receive() external payable {}

    function key(address token, address quote)
        public
        view
        returns (address currency0, address currency1, uint24 fee, int24 tickSpacing, address hooks)
    {
        (currency0, currency1) = token < quote ? (token, quote) : (quote, token);
        return (currency0, currency1, FEE, SPACING, hook);
    }

    function poolId(address token, address quote) public view returns (bytes32) {
        (address c0, address c1, uint24 fee, int24 spacing, address hooks) = key(token, quote);
        return keccak256(abi.encode(c0, c1, fee, spacing, hooks));
    }

    /// @notice Curve hands the price-matched reserves here. Seeding is a second call so a failed pool cannot revert the buy.
    function deposit(address token, address quote, address creator, uint16 taxBps, uint256 tokenAmt, uint256 quoteAmt)
        external
        payable
    {
        require(msg.sender != address(0) && !held[msg.sender].ready, "held");
        require(token != quote && token != address(0) && tokenAmt > 0 && quoteAmt > 0, "pair");
        uint256 beforeTok = ISkyQuote(token).balanceOf(address(this));
        ISkyQuote(token).transferFrom(msg.sender, address(this), tokenAmt);
        uint256 gotToken = ISkyQuote(token).balanceOf(address(this)) - beforeTok;
        uint256 gotQuote;
        if (quote == address(0)) {
            require(msg.value == quoteAmt, "value");
            gotQuote = msg.value;
        } else {
            require(msg.value == 0, "value");
            uint256 beforeQuote = ISkyQuote(quote).balanceOf(address(this));
            ISkyQuote(quote).transferFrom(msg.sender, address(this), quoteAmt);
            gotQuote = ISkyQuote(quote).balanceOf(address(this)) - beforeQuote;
        }
        require(gotToken > 0 && gotQuote > 0, "empty");
        held[msg.sender] = Held({
            token: token,
            quote: quote,
            creator: creator,
            tokenAmt: gotToken,
            quoteAmt: gotQuote,
            taxBps: taxBps,
            ready: true
        });
    }

    /// @notice Seed the locked v4 position from a prior deposit. Anyone may retry it.
    function seedHeld(address curve) external returns (bytes32 id) {
        Held memory h = held[curve];
        require(h.ready, "held");
        held[curve].ready = false;
        ISkyHookRegister(hook).register(h.token, h.quote, ICurveFee(curve).feeRecipient(), h.taxBps);
        bytes memory result = ISkyManager(manager).unlock(abi.encode(uint8(1), h.token, h.quote, h.tokenAmt, h.quoteAmt));
        id = abi.decode(result, (bytes32));
        emit Seeded(curve, id);
    }

    /// @notice Exact-input swap. `buyingToken` spends the quote asset and buys the launched token.
    function trade(address token, address quote, bool buyingToken, uint256 amountIn, uint256 minOut, address recipient)
        external
        payable
        returns (uint256 amountOut)
    {
        require(recipient != address(0) && amountIn > 0 && amountIn < uint256(type(uint128).max), "trade");
        (address c0, address c1,,,) = key(token, quote);
        bool zeroForOne = buyingToken ? quote == c0 : token == c0;
        address input = zeroForOne ? c0 : c1;
        _pull(input, amountIn);
        bytes memory result = ISkyManager(manager).unlock(abi.encode(uint8(2), c0, c1, zeroForOne, amountIn, recipient));
        uint256 spent;
        (amountOut, spent) = abi.decode(result, (uint256, uint256));
        require(amountOut >= minOut, "slippage");
        if (spent < amountIn) _refund(input, msg.sender, amountIn - spent);
    }

    function unlockCallback(bytes calldata data) external returns (bytes memory) {
        require(msg.sender == manager, "manager");
        uint8 action = abi.decode(data, (uint8));
        if (action == 1) return _seed(data);
        if (action == 2) return _swap(data);
        revert("action");
    }

    function _seed(bytes calldata data) internal returns (bytes memory) {
        (, address token, address quote, uint256 tokenAmt, uint256 quoteAmt) =
            abi.decode(data, (uint8, address, address, uint256, uint256));
        (address c0, address c1, uint24 fee, int24 spacing, address hooks) = key(token, quote);
        uint256 amount0 = c0 == token ? tokenAmt : quoteAmt;
        uint256 amount1 = c1 == token ? tokenAmt : quoteAmt;
        uint160 sqrtPrice = _sqrtPrice(amount0, amount1);
        ISkyManager(manager).initialize(c0, c1, fee, spacing, hooks, sqrtPrice);
        uint256 from0 = (amount0 * uint256(sqrtPrice)) / Q96;
        uint256 from1 = (amount1 * Q96) / uint256(sqrtPrice);
        uint256 liquidity = from0 < from1 ? from0 : from1;
        require(liquidity > 0 && liquidity <= uint256(type(uint128).max), "liquidity");
        (int256 packed,) = ISkyManager(manager).modifyLiquidity(
            c0, c1, fee, spacing, hooks, TICK_LOWER, TICK_UPPER, int256(liquidity), bytes32(0), ""
        );
        _settle(c0, int128(packed >> 128));
        _settle(c1, int128(packed));
        return abi.encode(keccak256(abi.encode(c0, c1, fee, spacing, hooks)));
    }

    function _swap(bytes calldata data) internal returns (bytes memory) {
        (, address c0, address c1, bool zeroForOne, uint256 amountIn, address recipient) =
            abi.decode(data, (uint8, address, address, bool, uint256, address));
        uint160 limit = zeroForOne ? MIN_SQRT : MAX_SQRT;
        int256 packed = ISkyManager(manager).swap(
            c0, c1, FEE, SPACING, hook, zeroForOne, -int256(amountIn), limit, ""
        );
        int128 d0 = int128(packed >> 128);
        int128 d1 = int128(packed);
        int128 output = zeroForOne ? d1 : d0;
        require(output > 0, "out");
        _pay(c0, d0, recipient);
        _pay(c1, d1, recipient);
        int128 inputDelta = zeroForOne ? d0 : d1;
        uint256 spent = inputDelta < 0 ? uint256(uint128(-inputDelta)) : 0;
        return abi.encode(uint256(uint128(output)), spent);
    }

    function _pull(address currency, uint256 amount) internal {
        if (currency == address(0)) {
            require(msg.value == amount, "value");
            return;
        }
        require(msg.value == 0, "value");
        uint256 beforeBal = ISkyQuote(currency).balanceOf(address(this));
        ISkyQuote(currency).transferFrom(msg.sender, address(this), amount);
        require(ISkyQuote(currency).balanceOf(address(this)) - beforeBal == amount, "received");
    }

    function _pay(address currency, int128 delta, address recipient) internal {
        if (delta < 0) {
            uint256 amount = uint256(uint128(-delta));
            if (currency == address(0)) {
                ISkyManager(manager).settle{value: amount}();
            } else {
                ISkyManager(manager).sync(currency);
                require(ISkyQuote(currency).transfer(manager, amount), "sync");
                ISkyManager(manager).settle();
            }
        } else if (delta > 0) {
            ISkyManager(manager).take(currency, recipient, uint256(uint128(delta)));
        }
    }

    function _settle(address currency, int128 delta) internal {
        _pay(currency, delta, address(this));
    }

    function _sqrtPrice(uint256 amount0, uint256 amount1) internal pure returns (uint160) {
        uint256 s0 = _sqrt(amount0);
        uint256 s1 = _sqrt(amount1);
        require(s0 > 0, "price");
        uint256 price = (s1 << 96) / s0;
        require(price > SQRT_LOWER && price < SQRT_UPPER, "price");
        return uint160(price);
    }

    function _sqrt(uint256 x) internal pure returns (uint256 y) {
        if (x == 0) return 0;
        uint256 z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }

    function _refund(address currency, address to, uint256 amount) internal {
        if (amount == 0 || to == address(0)) return;
        if (currency == address(0)) {
            (bool ok,) = to.call{value: amount}("");
            require(ok, "refund");
        } else {
            require(ISkyQuote(currency).transfer(to, amount), "refund");
        }
    }
}
