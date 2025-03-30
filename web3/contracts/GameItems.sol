// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {ERC1155Burnable} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import {ERC1155URIStorage} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";

contract UpdatedGame is ERC1155, ERC1155URIStorage, AccessControl, ERC1155Burnable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    // Element Cards (Fungible)
    uint256 public constant INFERNO_CARD = 1001;
    uint256 public constant FROST_CARD = 1002;
    uint256 public constant TEMPEST_CARD = 1003;

    // Wands (Non-fungible)
    uint256[] public infernoWands = [101, 102, 103];
    uint256[] public frostWands = [201, 202, 203];
    uint256[] public tempestWands = [301, 302, 303];

    // Spells (Non-fungible)
    uint256[] public infernoSpells = [401, 402, 403];
    uint256[] public glaciusSpells = [501, 502, 503];
    uint256[] public tempestSpells = [601, 602, 603];

    // Patronus (Non-fungible)
    uint256 public constant stag = 701;
    uint256 public constant phoenix = 702;
    uint256 public constant otter = 703;
    uint256 public constant wolf = 704;

    // Professor Shards (Fungible)
    uint256 public constant SNAPE_SHARD = 9001;
    uint256 public constant DUMBLEDORE_SHARD = 9002;
    uint256 public constant VOLDEMORT_SHARD = 9003;

    // Professor SFTs (Non-fungible)
    uint256 public constant SNAPE = 9100;
    uint256 public constant DUMBLEDORE = 9200;
    uint256 public constant VOLDEMORT = 9300;

    constructor(address admin) ERC1155("") {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
    }

    function mint(address account, uint256 id, uint256 amount, string memory uri) public onlyRole(MINTER_ROLE) {
        _mint(account, id, amount, "");
        _setURI(id, uri);
    }

    function uri(uint256 tokenId) public view override(ERC1155, ERC1155URIStorage) returns (string memory) {
        return super.uri(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function mintBasicSpell(uint256 spellId, uint256 elementCard, uint256 amount, string memory uri) external {
        require(isValidBasicSpell(spellId), "Invalid spell ID");
        _burn(msg.sender, elementCard, amount);
        mint(msg.sender, spellId, 1, "");
        _setURI(spellId, uri);
    }

    // Upgrade Spell (Requires Burning Cards & Having Wand)
    function upgradeSpell(uint256 oldSpell, uint256 newSpell, uint256 elementCard, uint256 wandId, string memory uri) external {
        require(isValidUpgrade(oldSpell, newSpell), "Invalid spell upgrade path");
        require(balanceOf(msg.sender, elementCard) >= 100, "Not enough element cards");
        require(balanceOf(msg.sender, wandId) > 0, "Required wand level not owned");
        _burn(msg.sender, elementCard, 100);
        _burn(msg.sender, oldSpell, 1);
        mint(msg.sender, newSpell, 1, "");
        _setURI(newSpell, uri);
    }

    // Mint Professor SFT (Burns Shards)
    function mintProfessor(uint256 shardId, uint256 professorId) external {
        uint256 userBalance = balanceOf(msg.sender, shardId);
        require(userBalance >= 4, "Need at least 4 shards to mint professor");
        _burn(msg.sender, shardId, userBalance);
        mint(msg.sender, professorId, 1, "");
    }

    // Mint Professor Shards SFT
    function mintProfessorShard(uint256 shardId, uint256 amount, uint256 professorID, string memory uri) external {
        require(isValidProfessor(shardId, professorID), "Invalid shard for this professor");
        require(amount > 0, "Amount must be greater than zero");
        mint(msg.sender, shardId, amount, "");
        _setURI(shardId, uri);
    }

    // Mint Element Cards (SFT)
    function mintElementCard(uint256 cardId, uint256 amount, string memory uri) external {
        require(cardId == 1001 || cardId == 1002 || cardId == 1003, "Invalid element card ID");
        require(amount > 0, "Amount must be greater than zero");
        mint(msg.sender, cardId, amount, "");
        _setURI(cardId, uri);
    }

    // Mint Wands (SFT)
    function mintWand(uint256 wandId, uint256 amount, string memory uri) external {
        require((wandId >= 101 && wandId <= 103) || (wandId >= 201 && wandId <= 203) || (wandId >= 301 && wandId <= 303), "Invalid wand ID");
        require(amount > 0, "Amount must be greater than zero");
        mint(msg.sender, wandId, amount, "");
        _setURI(wandId, uri);
    }

    // Mint Patronus (SFT)
    function mintPatronus(uint256 patronusId, string memory uri) external {
        require(patronusId >= 701 && patronusId <= 704, "Invalid Patronus ID");
        mint(msg.sender, patronusId, 1, "");
        _setURI(patronusId, uri);
    }

    function transfer(address from, address to, uint256 id, uint256 value) external {
        safeTransferFrom(from, to, id, value, "");
    }

    function isValidBasicSpell(uint256 spellId) internal pure returns (bool) {
        return spellId == 401 || spellId == 501 || spellId == 601;
    }

    function isValidUpgrade(uint256 oldSpell, uint256 newSpell) internal pure returns (bool) {
        return (oldSpell == 401 && newSpell == 402) || (oldSpell == 402 && newSpell == 403) || 
               (oldSpell == 501 && newSpell == 502) || (oldSpell == 502 && newSpell == 503) || 
               (oldSpell == 601 && newSpell == 602) || (oldSpell == 602 && newSpell == 603);
    }

    function isValidProfessor(uint256 shard, uint256 professor) internal pure returns (bool) {
        return (shard == 9001 && professor == 9100) || 
               (shard == 9002 && professor == 9200) || 
               (shard == 9003 && professor == 9300);
    }
}
