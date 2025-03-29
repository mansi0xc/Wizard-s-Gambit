// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {ERC1155Burnable} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";

contract GameItems is ERC1155, AccessControl, ERC1155Burnable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    // 🔥 Element Cards (Fungible)
    uint256 public constant INFERNO_CARD = 1001;
    uint256 public constant FROST_CARD = 1002;
    uint256 public constant TEMPEST_CARD = 1003;

    // 🪄 Wands (Non-fungible)
    uint256[] public infernoWands = [101, 102, 103];
    uint256[] public frostWands = [201, 202, 203];
    uint256[] public tempestWands = [301, 302, 303];

    // ✨ Spells (Non-fungible)
    uint256[] public infernoSpells = [401, 402, 403];
    uint256[] public glaciusSpells = [501, 502, 503];
    uint256[] public tempestSpells = [601, 602, 603];

    // Patronus (Non-fungible)
    uint256 public constant stag = 701;
    uint256 public constant phoenix = 702;
    uint256 public constant otter = 703;
    uint256 public constant wolf = 704;

    // 🧙 Professor Shards (Fungible)
    uint256 public constant SNAPE_SHARD = 9001;
    uint256 public constant DUMBLEDORE_SHARD = 9002;
    uint256 public constant VOLDEMORT_SHARD = 9003;

    // 👤 Professor SFTs (Non-fungible)
    uint256 public constant SNAPE = 9100;
    uint256 public constant DUMBLEDORE = 9200;
    uint256 public constant VOLDEMORT = 9300;

    constructor(address admin) ERC1155("https://gameitems/{id}.json") {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
    }

    function isValidBasicSpell(uint256 spellId) internal pure returns (bool) {
        return spellId == 401 || spellId == 501 || spellId == 601; // Only Level 1 Spells
    }


    function mintBasicSpell(uint256 spellId, uint256 elementCard, uint256 amount, string memory uri) external {
        require(isValidBasicSpell(spellId), "Invalid spell ID");

        _burn(msg.sender, elementCard, amount); // Burn the  element cards
        _mint(msg.sender, spellId, 1, uri); // Mint the Level 1 spell
    }


    // 🔥 Upgrade Spell (Requires Burning Cards & Having Wand)
    function upgradeSpell(uint256 oldSpell, uint256 newSpell, uint256 elementCard, uint256 wandId, string memory uri) external {
        require(isValidUpgrade(oldSpell, newSpell), "Invalid spell upgrade path");
        require(balanceOf(msg.sender, elementCard) >= 100, "Not enough element cards");
        require(balanceOf(msg.sender, wandId) > 0, "Required wand level not owned");

        _burn(msg.sender, elementCard, 100);
        _burn(msg.sender, oldSpell, 1);
        _mint(msg.sender, newSpell, 1, uri);
    }

    // 🧙 Mint Professor SFT (Burns Shards)
    function mintProfessor(uint256 shardId, uint256 professorId) external {
        uint256 userBalance = balanceOf(msg.sender, shardId);
        require(userBalance >= 4, "Need at least 4 shards to mint professor");

        // Burn all Snape Shards
        _burn(msg.sender, shardId, userBalance);

        // Mint 1 Snape Professor
        _mint(msg.sender, professorId, 1, "");
    }

    // Mint Professor Shards SFT
    function mintProfessorShard(uint256 shardId, uint256 amount, string memory professorName, string memory uri) external {
        require(isValidProfessor(shardId, professorName), "Invalid shard for this professor");
        require(amount > 0, "Amount must be greater than zero");
        _mint(msg.sender, shardId, amount, uri);
    }

    // 🔥 Mint Element Cards
    function mintElementCard(uint256 cardId, uint256 amount, string memory uri) external {
        require(cardId == INFERNO_CARD || cardId == FROST_CARD || cardId == TEMPEST_CARD, "Invalid element card ID");
        require(amount > 0, "Amount must be greater than zero");
        _mint(msg.sender, cardId, amount, uri);
    }

    // 🔥 Mint Wands
    function mintWand(uint256 wandId, uint256 amount, string memory uri) external {
        require(
            (wandId >= 101 && wandId <= 103) || (wandId >= 201 && wandId <= 203) || (wandId >= 301 && wandId <= 303),
            "Invalid wand ID"
        );
        require(amount > 0, "Amount must be greater than zero");
        _mint(msg.sender, wandId, amount, uri);
    }

    // 🔥 Mint Patronus
    function mintPatronus(uint256 patronusId, string memory uri) external {
        require(
            patronusId == stag || patronusId == phoenix || patronusId == otter || patronusId == wolf,
            "Invalid Patronus ID"
        );
        require(amount > 0, "Amount must be greater than zero");
        _mint(msg.sender, patronusId, 1, uri);
    }

    // 🔍 Validate Spell Upgrade Path
    function isValidUpgrade(uint256 oldSpell, uint256 newSpell) internal pure returns (bool) {
        return 
            (oldSpell == 401 && newSpell == 402) || (oldSpell == 402 && newSpell == 403) || // Inferno
            (oldSpell == 501 && newSpell == 502) || (oldSpell == 502 && newSpell == 503) || // Glacius
            (oldSpell == 601 && newSpell == 602) || (oldSpell == 602 && newSpell == 603);   // Tempest
    }

    // 🔍 Validate Professor Minting Path
    function isValidProfessor(uint256 shard, uint256 professor) internal pure returns (bool) {
        return 
            (shard == SNAPE_SHARD && professor == SNAPE) || 
            (shard == DUMBLEDORE_SHARD && professor == DUMBLEDORE) || 
            (shard == VOLDEMORT_SHARD && professor == VOLDEMORT);
    }

    // 🛠 Mint Function for Admin
    function mint(address account, uint256 id, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(account, id, amount, "");
    }

    // 🌎 Set Metadata URI
    function setURI(string memory newuri) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _setURI(newuri);
    }

    // 🔗 ERC165 Support
    function supportsInterface(bytes4 interfaceId) public view override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
