// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./SpellsToken.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SpellsUtility is AccessControl {
    SpellsToken public spells;
    IERC20 public arcane;
    uint256 public spellPrice = 100 * 10 ** 18; // Example price
    uint256 public upgradePrice = 150 * 10 ** 18; // Example price

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    constructor(address _spells, address _arcane) {
        spells = SpellsToken(_spells);
        arcane = IERC20(_arcane);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    function setSpellPrice(uint256 _spellPrice) external onlyRole(ADMIN_ROLE) {
        spellPrice = _spellPrice;
    }

    function setUpgradePrice(
        uint256 _upgradePrice
    ) external onlyRole(ADMIN_ROLE) {
        upgradePrice = _upgradePrice;
    }

    function buySpell(uint256 spellId) external {
        require(
            !spells.userSpellOwnership(msg.sender, spellId),
            "User already owns a version"
        );
        require(
            arcane.balanceOf(msg.sender) >= spellPrice,
            "Insufficient Arcane tokens"
        );

        arcane.transferFrom(msg.sender, address(this), spellPrice);
        spells.mint(msg.sender, spellId, 1);
    }

    function upgradeSpell(
        uint256 currentSpellId,
        uint256 nextSpellId
    ) external {
        require(
            spells.userSpellOwnership(msg.sender, currentSpellId),
            "User does not own this spell"
        );
        require(
            !spells.userSpellOwnership(msg.sender, nextSpellId),
            "Already owns max level"
        );
        require(
            arcane.balanceOf(msg.sender) >= upgradePrice,
            "Insufficient Arcane tokens"
        );

        arcane.transferFrom(msg.sender, address(this), upgradePrice);
        spells.burn(msg.sender, currentSpellId, 1);
        spells.mint(msg.sender, nextSpellId, 1);
    }

    function withdrawTokens(
        address recipient,
        uint256 amount
    ) external onlyRole(ADMIN_ROLE) {
        require(
            arcane.balanceOf(address(this)) >= amount,
            "Insufficient balance in contract"
        );
        arcane.transfer(recipient, amount);
    }
}
