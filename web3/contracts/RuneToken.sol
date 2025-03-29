// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ArcaneToken is ERC20 {
    
    uint256 public constant INITIAL_PLAYER_TOKENS = 1000 * 10**18; // 1000 tokens
    address public owner;

    constructor() ERC20("Runic Token", "RUNE") {
        owner = msg.sender;
    }

    modifier onlyOwner {
        if (msg.sender != owner) {
            revert("Not the contract owner");
        }
        _;
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    // Function to allocate initial tokens to new players
    function allocateInitialTokens(address player) external onlyOwner {
        require(balanceOf(player) == 0, "Player already has tokens");
        _mint(player, INITIAL_PLAYER_TOKENS);
    }

    // Function to burn tokens (for marketplace purchases, etc.)
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}