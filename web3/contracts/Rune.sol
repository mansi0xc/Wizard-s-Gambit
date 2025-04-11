// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Rune is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    uint256 public constant INITIAL_PLAYER_TOKENS = 1000 * 10 ** 18; // 1000 tokens

    constructor() ERC20("Runic Token", "RNT") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    function grantMinterRole(
        address minter
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(MINTER_ROLE, minter);
    }

    // Function to allocate initial tokens to new players
    function allocateInitialTokens(
        address player
    ) external onlyRole(MINTER_ROLE) {
        require(balanceOf(player) == 0, "Player already has tokens");
        _mint(player, INITIAL_PLAYER_TOKENS);
    }

    // Function to burn tokens (for marketplace purchases, etc.)
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
