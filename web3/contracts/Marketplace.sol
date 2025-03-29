// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./GameItems.sol";

contract Marketplace {
    IERC20 public runesToken; // The in-game currency (Runes)
    GameItems public gameItems; // The GameItems contract

    address public owner;

    uint256 public mysteryBoxPrice; // Price for a mystery box
    uint256 public professorBoxPrice; // Price for a Professor mystery box

    // Constants for specific SFT IDs
    uint256 public constant INFERNO_CARD_ID = 701;
    uint256 public constant FROST_CARD_ID = 702;
    uint256 public constant TEMPEST_CARD_ID = 703;
    uint256 public constant PROFESSOR_SNAPE_SHARD_ID = 801;
    uint256 public constant PROFESSOR_SNAPE_ID = 802;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    event WandPurchased(address indexed buyer, uint256 wandId, uint256 amount);
    event SpellPurchased(address indexed buyer, uint256 spellId, uint256 amount);
    event SpellUpgraded(address indexed buyer, uint256 spellId, uint256 newLevel);
    event MysteryBoxPurchased(address indexed buyer, uint256 cardId, uint256 amount);
    event ProfessorBoxPurchased(address indexed buyer, uint256 shardId, uint256 amount);
    event ProfessorSnapeMinted(address indexed buyer);

    constructor(
        address _runesToken,
        address _gameItems,
        uint256 _mysteryBoxPrice,
        uint256 _professorBoxPrice
    ) {
        runesToken = IERC20(_runesToken);
        gameItems = GameItems(_gameItems);
        owner = msg.sender;

        mysteryBoxPrice = _mysteryBoxPrice;
        professorBoxPrice = _professorBoxPrice;
    }

    /// @notice Purchase a wand using Runes
    /// @param wandId The ID of the wand to purchase
    /// @param amount The number of wands to purchase
    function purchaseWand(uint256 wandId, uint256 amount) external {
        uint256 price = 50 * 10**18; // Example price: 50 Runes per wand
        uint256 totalCost = price * amount;

        require(runesToken.transferFrom(msg.sender, address(this), totalCost), "Payment failed");

        gameItems.mint(msg.sender, wandId, amount);

        emit WandPurchased(msg.sender, wandId, amount);
    }

    /// @notice Purchase a Level 1 spell using Runes
    /// @param spellId The ID of the spell to purchase
    /// @param amount The number of spells to purchase
    function purchaseSpell(uint256 spellId, uint256 amount) external {
        uint256 price = 100 * 10**18; // Example price: 100 Runes per Level 1 spell
        uint256 totalCost = price * amount;

        require(runesToken.transferFrom(msg.sender, address(this), totalCost), "Payment failed");

        gameItems.mint(msg.sender, spellId, amount);

        emit SpellPurchased(msg.sender, spellId, amount);
    }

    /// @notice Upgrade a spell to the next level by burning Attribute Cards
    /// @param spellId The ID of the spell to upgrade
    /// @param cardId The ID of the Attribute Card to burn
    /// @param cardAmount The number of cards to burn
    function upgradeSpell(uint256 spellId, uint256 cardId, uint256 cardAmount) external {
        require(cardAmount == 100, "You must burn exactly 100 cards to upgrade");
        require(
            cardId == INFERNO_CARD_ID || cardId == FROST_CARD_ID || cardId == TEMPEST_CARD_ID,
            "Invalid card ID"
        );

        gameItems.burn(msg.sender, cardId, cardAmount);

        uint256 newSpellId = spellId + 1; // Increment spell level (e.g., 401 -> 402)
        gameItems.mint(msg.sender, newSpellId, 1);

        emit SpellUpgraded(msg.sender, spellId, newSpellId);
    }

    /// @notice Purchase a mystery box to receive a random Attribute Card
    function purchaseMysteryBox() external {
        require(
            runesToken.transferFrom(msg.sender, address(this), mysteryBoxPrice),
            "Payment failed"
        );

        // Randomly select one of the Attribute Cards
        uint256 random = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender))) % 3;
        uint256 cardId = random == 0
            ? INFERNO_CARD_ID
            : (random == 1 ? FROST_CARD_ID : TEMPEST_CARD_ID);

        gameItems.mint(msg.sender, cardId, 1);

        emit MysteryBoxPurchased(msg.sender, cardId, 1);
    }

    /// @notice Purchase a Professor mystery box to receive a ProfessorSnape Shard
    function purchaseProfessorBox() external {
        require(
            runesToken.transferFrom(msg.sender, address(this), professorBoxPrice),
            "Payment failed"
        );

        gameItems.mint(msg.sender, PROFESSOR_SNAPE_SHARD_ID, 1);

        emit ProfessorBoxPurchased(msg.sender, PROFESSOR_SNAPE_SHARD_ID, 1);
    }

    /// @notice Exchange 4 ProfessorSnape Shards for the ProfessorSnape SFT
    function mintProfessorSnape() external {
        uint256 requiredShards = 4;

        require(
            gameItems.getBalanceOf(msg.sender, PROFESSOR_SNAPE_SHARD_ID) >= requiredShards,
            "Not enough shards"
        );

        gameItems.burn(msg.sender, PROFESSOR_SNAPE_SHARD_ID, requiredShards);
        gameItems.mint(msg.sender, PROFESSOR_SNAPE_ID, 1);

        emit ProfessorSnapeMinted(msg.sender);
    }

    /// @notice Withdraw Runes from the contract
    /// @param to The address to send the Runes to
    /// @param amount The amount of Runes to withdraw
    function withdrawRunes(address to, uint256 amount) external onlyOwner {
        require(runesToken.transfer(to, amount), "Withdrawal failed");
    }
}