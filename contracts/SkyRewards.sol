// SPDX-License-Identifier: MIT
pragma solidity 0.8.37;

interface ISkyRewardToken {
    function factory() external view returns (address);
    function curve() external view returns (address);
    function balanceOf(address account) external view returns (uint256);
    function totalSupply() external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

interface ISkyRewardCurve {
    function creator() external view returns (address);
}

interface ISkyRewardFactory {
    function locker() external view returns (address);
    function hook() external view returns (address);
}

/// @title SkyRewards
/// @notice Splits a launch's creator fees across current holders, in proportion to balance.
///         The curve, the locker, and the Uniswap pool manager do not earn.
contract SkyRewards {
    uint256 internal constant MAG = 1e18;
    address internal constant POOL_MANAGER = 0x8366a39CC670B4001A1121B8F6A443A643e40951;

    address public immutable factory;
    address public hook;

    mapping(address token => uint256) public acc;
    mapping(address token => address) public quoteOf;
    mapping(address token => mapping(address user => uint256)) public rewardDebt;
    mapping(address token => mapping(address user => uint256)) public owed;

    event Funded(address indexed token, uint256 amount, uint256 supply);
    event Claimed(address indexed token, address indexed user, uint256 amount);

    constructor() {
        factory = msg.sender;
    }

    function setHook(address hook_) external {
        require(msg.sender == factory && hook == address(0) && hook_ != address(0), "hook");
        hook = hook_;
    }

    function pending(address token, address user) external view returns (uint256) {
        if (_excluded(token, user)) return owed[token][user];
        uint256 bal = ISkyRewardToken(token).balanceOf(user);
        uint256 entitled = (bal * acc[token]) / MAG;
        uint256 debt = rewardDebt[token][user];
        uint256 extra = entitled > debt ? entitled - debt : 0;
        return owed[token][user] + extra;
    }

    function afterTransfer(address from, address to, uint256 amount) external {
        address token = msg.sender;
        require(ISkyRewardToken(token).factory() == factory, "token");
        if (from != address(0)) {
            _accrue(token, from, ISkyRewardToken(token).balanceOf(from) + amount);
            _setDebt(token, from);
        }
        if (to != address(0)) {
            uint256 nowBal = ISkyRewardToken(token).balanceOf(to);
            _accrue(token, to, nowBal - amount);
            _setDebt(token, to);
        }
    }

    /// @notice Add creator fees. Native quote sends ETH. Any other quote must be approved first.
    function onFee(address token, address quote, uint256 amount) external payable {
        require(ISkyRewardToken(token).factory() == factory, "token");
        address curve = ISkyRewardToken(token).curve();
        require(msg.sender == curve || msg.sender == hook, "caller");
        require(amount > 0, "amount");
        if (quote == address(0)) require(msg.value == amount, "value");
        else {
            require(msg.value == 0, "value");
            uint256 beforeBal = ISkyRewardToken(quote).balanceOf(address(this));
            require(ISkyRewardToken(quote).transferFrom(msg.sender, address(this), amount), "transfer");
            amount = ISkyRewardToken(quote).balanceOf(address(this)) - beforeBal;
        }
        address stored = quoteOf[token];
        if (stored == address(0)) quoteOf[token] = quote == address(0) ? address(1) : quote;
        else require((quote == address(0) ? address(1) : quote) == stored, "quote");
        uint256 supply = _earningSupply(token);
        if (supply == 0) {
            _send(quote, ISkyRewardCurve(curve).creator(), amount);
            return;
        }
        acc[token] += (amount * MAG) / supply;
        emit Funded(token, amount, supply);
    }

    function claim(address token) external returns (uint256 pay) {
        require(!_excluded(token, msg.sender), "excluded");
        uint256 bal = ISkyRewardToken(token).balanceOf(msg.sender);
        _accrue(token, msg.sender, bal);
        rewardDebt[token][msg.sender] = (bal * acc[token]) / MAG;
        pay = owed[token][msg.sender];
        require(pay > 0, "empty");
        owed[token][msg.sender] = 0;
        address stored = quoteOf[token];
        _send(stored == address(1) ? address(0) : stored, msg.sender, pay);
        emit Claimed(token, msg.sender, pay);
    }

    function _accrue(address token, address user, uint256 oldBal) internal {
        if (_excluded(token, user) || oldBal == 0) return;
        uint256 entitled = (oldBal * acc[token]) / MAG;
        uint256 debt = rewardDebt[token][user];
        if (entitled > debt) owed[token][user] += entitled - debt;
    }

    function _setDebt(address token, address user) internal {
        if (_excluded(token, user)) {
            rewardDebt[token][user] = 0;
            return;
        }
        rewardDebt[token][user] = (ISkyRewardToken(token).balanceOf(user) * acc[token]) / MAG;
    }

    function _earningSupply(address token) internal view returns (uint256 supply) {
        supply = ISkyRewardToken(token).totalSupply();
        address curve = ISkyRewardToken(token).curve();
        supply -= ISkyRewardToken(token).balanceOf(curve);
        supply -= ISkyRewardToken(token).balanceOf(ISkyRewardFactory(factory).locker());
        supply -= ISkyRewardToken(token).balanceOf(POOL_MANAGER);
    }

    function _excluded(address token, address user) internal view returns (bool) {
        if (user == address(0)) return true;
        if (user == ISkyRewardToken(token).curve()) return true;
        if (user == ISkyRewardFactory(factory).locker()) return true;
        if (user == POOL_MANAGER) return true;
        return false;
    }

    function _send(address quote, address to, uint256 amount) internal {
        if (amount == 0 || to == address(0)) return;
        if (quote == address(0)) {
            (bool ok,) = to.call{value: amount}("");
            require(ok, "send");
        } else {
            require(ISkyRewardToken(quote).transfer(to, amount), "send");
        }
    }
}
