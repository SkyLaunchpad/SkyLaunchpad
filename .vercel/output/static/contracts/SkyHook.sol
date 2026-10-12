// SPDX-License-Identifier: MIT
pragma solidity 0.8.37;

interface ISkyHookManager {
    function take(address currency, address to, uint256 amount) external;
}

interface ISkyHookRewards {
    function onFee(address token, address quote, uint256 amount) external payable;
}

interface ISkyHookToken {
    function approve(address spender, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
}

interface ISkyHookFactory {
    function protocol() external view returns (address);
}

/// @title SkyHook
/// @notice Locks the graduated position and forwards the 1% fee plus creator tax.
///         Address bits must be exactly 0x2244.
contract SkyHook {
    struct PoolKey {
        address currency0;
        address currency1;
        uint24 fee;
        int24 tickSpacing;
        address hooks;
    }

    struct ModifyLiquidityParams {
        int24 tickLower;
        int24 tickUpper;
        int256 liquidityDelta;
        bytes32 salt;
    }

    struct SwapParams {
        bool zeroForOne;
        int256 amountSpecified;
        uint160 sqrtPriceLimitX96;
    }

    struct Info {
        address token;
        address quote;
        address feeRecipient;
        uint16 taxBps;
        bool registered;
    }

    uint256 internal constant FEE_BPS = 100;

    address public immutable manager;
    address public immutable rewards;
    address public immutable factory;
    address public seeder;

    mapping(bytes32 => Info) public launches;

    error Locked();

    constructor(address manager_, address rewards_) {
        require(manager_ != address(0) && rewards_ != address(0), "zero");
        manager = manager_;
        rewards = rewards_;
        factory = msg.sender;
    }

    function authorize(address seeder_) external {
        require(msg.sender == factory && seeder == address(0) && seeder_ != address(0), "seeder");
        seeder = seeder_;
    }

    function register(address token, address quote, address feeRecipient, uint16 taxBps) external returns (bytes32 poolId) {
        require(msg.sender == seeder, "seeder");
        (address c0, address c1) = token < quote ? (token, quote) : (quote, token);
        poolId = keccak256(abi.encode(c0, c1, uint24(3000), int24(60), address(this)));
        require(!launches[poolId].registered, "registered");
        launches[poolId] = Info({token: token, quote: quote, feeRecipient: feeRecipient, taxBps: taxBps, registered: true});
    }

    function beforeInitialize(address sender, PoolKey calldata, uint160) external view returns (bytes4) {
        require(msg.sender == manager, "manager");
        require(sender == seeder, "seeder");
        return this.beforeInitialize.selector;
    }

    function beforeRemoveLiquidity(address, PoolKey calldata, ModifyLiquidityParams calldata, bytes calldata)
        external
        view
        returns (bytes4)
    {
        require(msg.sender == manager, "manager");
        revert Locked();
    }

    function afterSwap(address, PoolKey calldata key, SwapParams calldata params, int256 delta, bytes calldata)
        external
        returns (bytes4, int128)
    {
        require(msg.sender == manager, "manager");
        bytes32 poolId = keccak256(abi.encode(key.currency0, key.currency1, key.fee, key.tickSpacing, key.hooks));
        Info memory info = launches[poolId];
        if (!info.registered) return (this.afterSwap.selector, 0);
        bool specifiedIs0 = (params.amountSpecified < 0) == params.zeroForOne;
        int128 unspecified = specifiedIs0 ? int128(delta) : int128(delta >> 128);
        if (unspecified < 0) unspecified = -unspecified;
        if (unspecified == 0) return (this.afterSwap.selector, 0);
        uint256 base = uint256(uint128(unspecified));
        uint256 feeAmount = (base * FEE_BPS) / 10_000;
        uint256 taxAmount = (base * info.taxBps) / 10_000;
        uint256 total = feeAmount + taxAmount;
        if (total == 0) return (this.afterSwap.selector, 0);
        address currency = specifiedIs0 ? key.currency1 : key.currency0;
        ISkyHookManager(manager).take(currency, address(this), total);
        uint256 protocolAmount = (feeAmount * 3_000) / 10_000;
        uint256 creatorAmount = feeAmount - protocolAmount + taxAmount;
        _pay(currency, ISkyHookFactory(factory).protocol(), protocolAmount);
        if (info.feeRecipient != address(0)) _pay(currency, info.feeRecipient, creatorAmount);
        else if (creatorAmount > 0) {
            if (currency == address(0)) ISkyHookRewards(rewards).onFee{value: creatorAmount}(info.token, address(0), creatorAmount);
            else {
                ISkyHookToken(currency).approve(rewards, creatorAmount);
                ISkyHookRewards(rewards).onFee(info.token, currency, creatorAmount);
            }
        }
        return (this.afterSwap.selector, int128(uint128(total)));
    }

    function _pay(address currency, address to, uint256 amount) internal {
        if (amount == 0 || to == address(0)) return;
        if (currency == address(0)) {
            (bool ok,) = to.call{value: amount}("");
            require(ok, "pay");
        } else {
            require(ISkyHookToken(currency).transfer(to, amount), "pay");
        }
    }

    receive() external payable {}
}
