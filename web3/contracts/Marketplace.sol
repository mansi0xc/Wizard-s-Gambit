// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {GameItems} from "./GameItems.sol";

contract Marketplace {
    IERC20 public runesToken;
    GameItems public gameItems;

    address public owner;
    uint256 public mysteryBoxPrice;
    uint256 public professorBoxPrice;

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

    function approveContract(uint256 amount) external {
        runesToken.approve(address(this), amount);
        runesToken.allowance(msg.sender, address(this));

    }

    function purchaseWand(uint256 wandId, uint256 amount) external {
        uint256 price = 50 * 10**18;
        uint256 totalCost = price * amount;
        // IERC20(runesToken).approve(address(this), totalCost * 10**18);
        // uint256 allowance = runesToken.allowance(msg.sender, address(this));
        // require(allowance >= totalCost, "Not enough allowance to buy wand");
        approveContract(totalCost);
        require(runesToken.transferFrom(msg.sender, address(this), totalCost), "Payment failed");

        gameItems.mint(msg.sender, wandId, amount, "");

        emit WandPurchased(msg.sender, wandId, amount);
    }

    function purchaseSpell(uint256 spellId, uint256 amount) external {
        uint256 price = 100 * 10**18;
        uint256 totalCost = price * amount;
        // IERC20(runesToken).approve(address(this), totalCost * 10**18);
        // uint256 allowance = runesToken.allowance(msg.sender, address(this));
        // require(allowance >= totalCost, "Not enough allowance to buy spell");
        approveContract(totalCost);
        require(runesToken.transferFrom(msg.sender, address(this), totalCost), "Payment failed");

        gameItems.mint(msg.sender, spellId, amount, "");

        emit SpellPurchased(msg.sender, spellId, amount);
    }

    function purchaseMysteryBox() external {
        // IERC20(runesToken).approve(address(this), 100 * 10**18);
        // uint256 allowance = runesToken.allowance(msg.sender, address(this));
        // require(allowance >= mysteryBoxPrice, "Not enough allowance. Approve tokens first.");
        approveContract(mysteryBoxPrice);
        require(runesToken.transferFrom(msg.sender, address(this), mysteryBoxPrice), "Payment failed");

        uint256 random = uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, msg.sender, block.number))) % 3;
        uint256 cardId = (random == 0) ? INFERNO_CARD_ID : (random == 1 ? FROST_CARD_ID : TEMPEST_CARD_ID);

        gameItems.mint(msg.sender, cardId, 1, "");

        emit MysteryBoxPurchased(msg.sender, cardId, 1);
    }

    function purchaseProfessorBox(uint256 shardID) external {
        // IERC20(runesToken).approve(address(this), 100 * 10**18);
        // uint256 allowance = runesToken.allowance(msg.sender, address(this));
        // require(allowance >= professorBoxPrice, "Not enough allowance. Approve tokens first.");
        approveContract(professorBoxPrice);
        require(runesToken.transferFrom(msg.sender, address(this), professorBoxPrice), "Payment failed");

        gameItems.mint(msg.sender, shardID, 1, "");

        emit ProfessorBoxPurchased(msg.sender, shardID, 1);
    }

    function withdrawRunes(address to, uint256 amount) external onlyOwner {
        require(runesToken.transfer(to, amount), "Withdrawal failed");
    }
}
