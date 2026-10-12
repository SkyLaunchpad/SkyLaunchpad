// SPDX-License-Identifier: MIT
pragma solidity 0.8.37;

/// @title SkyLocker
/// @notice Holds the virtual-reserve tokens that are not seeded into the v4 pool.
///         There is no withdraw function.
contract SkyLocker {
    event Locked(address indexed token, uint256 amount);

    function onToken(address token, uint256 amount) external {
        emit Locked(token, amount);
    }
}
