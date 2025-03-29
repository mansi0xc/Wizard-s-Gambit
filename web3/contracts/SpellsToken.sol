// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {ERC1155Burnable} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";

contract SpellsToken is ERC1155, AccessControl, ERC1155Burnable {
    bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    // Mappings for the spells
    mapping(string => uint256[]) public spellTypes;  // Stores spells by category (Fire, Ice, etc.)
    mapping(uint256 => string) public spellNames;    // Maps spell ID to its name
    mapping(uint256 => bool) public existingSpells;  // Ensures unique spell IDs like 101,102,13.....

    address public utilityContract;
    mapping(address => mapping(uint256 => bool)) public userSpellOwnership;

    // Function to dynamically add new spells
    function addSpell(string memory spellType, uint256 spellId, string memory spellName) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        require(!existingSpells[spellId], "Spell ID already exists");

        spellTypes[spellType].push(spellId);  // Add spell ID to its category
        spellNames[spellId] = spellName;      // Store spell name
        existingSpells[spellId] = true;       // Mark spell ID as existing
    }

    constructor(address defaultAdmin) ERC1155("https://ipfswhatever/{id}.json") {
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(URI_SETTER_ROLE, defaultAdmin);
        _grantRole(MINTER_ROLE, defaultAdmin);

    }
    

    function setUtilityContract(address _utilityContract) external onlyRole(DEFAULT_ADMIN_ROLE) {
        utilityContract = _utilityContract;
         _grantRole(MINTER_ROLE, _utilityContract);
    }

    function getSpellsByType(string memory spellType) external view returns (uint256[] memory) {
        return spellTypes[spellType];
    }

    function getSpellName(uint256 spellId) external view returns (string memory) {
        require(existingSpells[spellId], "Spell ID does not exist");
        return spellNames[spellId];
    }

    function mint(address account, uint256 id, uint256 amount) public onlyRole(MINTER_ROLE) {
        require(existingSpells[id], "Spell ID does not exist");
        require(!userSpellOwnership[account][id], "User already owns this spell");
        require(amount == 1, "Can only mint 1 of each spell");

        _mint(account, id, amount, "");
        userSpellOwnership[account][id] = true;
    }

    function burn(address account, uint256 id, uint256 amount) public override{
        super.burn(account, id, amount);
        userSpellOwnership[account][id] = false;
    }

    function setURI(string memory newuri) public onlyRole(URI_SETTER_ROLE) {
        _setURI(newuri);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
