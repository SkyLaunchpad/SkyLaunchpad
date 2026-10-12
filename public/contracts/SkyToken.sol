// SPDX-License-Identifier: MIT
pragma solidity 0.8.37;

import {SkyParams} from "./SkyParams.sol";

interface ISkyTokenFactory {
    function rewards() external view returns (address);
}

interface ISkyTokenRewards {
    function afterTransfer(address from, address to, uint256 amount) external;
}

/// @title SkyToken
/// @notice Fixed-supply ERC-20. The entire supply is minted once, to its curve.
///         No owner, no further mint, no transfer tax, no blacklist.
contract SkyToken {
    struct Socials {
        string twitter;
        string telegram;
        string discord;
        string website;
        string farcaster;
    }

    string public name;
    string public symbol;
    uint8 public constant decimals = 18;
    uint256 public totalSupply;

    address public factory;
    address public curve;
    bool private initialized;
    bool private metaSet;

    string public logo;
    string public description;
    Socials private _socials;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 amount);
    event Approval(address indexed owner, address indexed spender, uint256 amount);

    constructor() {
        initialized = true;
    }

    function initialize(string calldata name_, string calldata symbol_, address factory_) external {
        require(!initialized, "init");
        require(factory_ != address(0), "factory");
        bytes memory nb = bytes(name_);
        bytes memory sb = bytes(symbol_);
        require(nb.length >= 1 && nb.length <= 32, "name");
        require(sb.length >= 1 && sb.length <= 8, "symbol");
        for (uint256 i = 0; i < nb.length; i++) {
            require(nb[i] >= 0x20 && nb[i] <= 0x7e, "name");
        }
        for (uint256 i = 0; i < sb.length; i++) {
            bytes1 c = sb[i];
            bool ok = (c >= 0x30 && c <= 0x39) || (c >= 0x41 && c <= 0x5A) || (c >= 0x61 && c <= 0x7A);
            require(ok, "symbol");
        }
        initialized = true;
        name = name_;
        symbol = symbol_;
        factory = factory_;
    }

    function setMeta(
        string calldata logo_,
        string calldata description_,
        string calldata twitter,
        string calldata telegram,
        string calldata discord,
        string calldata website,
        string calldata farcaster
    ) external {
        require(msg.sender == factory, "factory");
        require(!metaSet, "meta");
        require(bytes(logo_).length <= 160, "logo");
        require(bytes(description_).length <= 140, "desc");
        require(bytes(twitter).length <= 48, "tw");
        require(bytes(telegram).length <= 48, "tg");
        require(bytes(discord).length <= 48, "dc");
        require(bytes(website).length <= 48, "web");
        require(bytes(farcaster).length <= 48, "fc");
        metaSet = true;
        logo = logo_;
        description = description_;
        _socials = Socials(twitter, telegram, discord, website, farcaster);
    }

    function socials()
        external
        view
        returns (string memory twitter, string memory telegram, string memory discord, string memory website, string memory farcaster)
    {
        Socials memory s = _socials;
        return (s.twitter, s.telegram, s.discord, s.website, s.farcaster);
    }

    function bindCurve(address curve_) external {
        require(msg.sender == factory, "factory");
        require(curve == address(0), "bound");
        require(curve_ != address(0), "zero");
        curve = curve_;
        uint256 supply = SkyParams.TOTAL_SUPPLY;
        totalSupply = supply;
        balanceOf[curve_] = supply;
        emit Transfer(address(0), curve_, supply);
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        _transfer(msg.sender, to, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        uint256 allowed = allowance[from][msg.sender];
        if (allowed != type(uint256).max) {
            require(allowed >= amount, "allowance");
            allowance[from][msg.sender] = allowed - amount;
        }
        _transfer(from, to, amount);
        return true;
    }

    function _transfer(address from, address to, uint256 amount) internal {
        require(to != address(0), "zero");
        uint256 bal = balanceOf[from];
        require(bal >= amount, "balance");
        unchecked {
            balanceOf[from] = bal - amount;
            balanceOf[to] += amount;
        }
        emit Transfer(from, to, amount);
        address rewards = ISkyTokenFactory(factory).rewards();
        if (rewards != address(0)) ISkyTokenRewards(rewards).afterTransfer(from, to, amount);
    }
}
