// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract PlayerAvatar is ERC721URIStorage, AccessControl {
    bytes32 public constant UPDATER_ROLE = keccak256("UPDATER_ROLE");

    struct PlayerStats {
        uint256 health;
        uint256 mana;
        uint256 defense;
        string wandType;
        string patronus;
    }

    mapping(uint256 => PlayerStats) public playerStats;

    uint256 private _tokenIdCounter;

    constructor() ERC721("PlayerAvatar", "PAVT") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(UPDATER_ROLE, msg.sender);
    }

    /// @notice Mint a new Player Avatar NFT
    /// @param to The address of the player
    /// @param health Initial health stat
    /// @param mana Initial mana stat
    /// @param defense Initial defense stat
    /// @param wandType Initial wand type
    /// @param patronus Initial patronus
    function mintAvatar(
        address to,
        uint256 health,
        uint256 mana,
        uint256 defense,
        string memory wandType,
        string memory patronus
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        _safeMint(to, tokenId);

        playerStats[tokenId] = PlayerStats({
            health: health,
            mana: mana,
            defense: defense,
            wandType: wandType,
            patronus: patronus
        });

        _setTokenURI(tokenId, _generateTokenURI(tokenId));
    }

    /// @notice Update the stats of an existing Player Avatar NFT
    /// @param tokenId The ID of the NFT to update
    /// @param health New health stat
    /// @param mana New mana stat
    /// @param defense New defense stat
    /// @param wandType New wand type
    function updateAvatar(
        uint256 tokenId,
        uint256 health,
        uint256 mana,
        uint256 defense,
        string memory wandType
    ) external onlyRole(UPDATER_ROLE) {
        require(_ownerOf(tokenId) != address(0), "Avatar does not exist");

        PlayerStats storage stats = playerStats[tokenId];
        stats.health = health;
        stats.mana = mana;
        stats.defense = defense;
        stats.wandType = wandType;

        _setTokenURI(tokenId, _generateTokenURI(tokenId));
    }

    /// @notice Generate the metadata URI for the NFT
    /// @param tokenId The ID of the NFT
    /// @return The metadata URI as a JSON string
    function _generateTokenURI(uint256 tokenId) internal view returns (string memory) {
        PlayerStats memory stats = playerStats[tokenId];

        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(
                    bytes(
                        abi.encodePacked(
                            '{"name":"Player Avatar #',
                            Strings.toString(tokenId),
                            '", "description":"Dynamic Player Avatar NFT", "attributes":[',
                            '{"trait_type":"Health","value":', Strings.toString(stats.health), '},',
                            '{"trait_type":"Mana","value":', Strings.toString(stats.mana), '},',
                            '{"trait_type":"Defense","value":', Strings.toString(stats.defense), '},',
                            '{"trait_type":"Wand Type","value":"', stats.wandType, '"},',
                            '{"trait_type":"Patronus","value":"', stats.patronus, '"}',
                            ']}'
                        )
                    )
                )
            )
        );
    }
    /// @notice Prevent transfers to make the NFT soulbound
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override returns (address) {
        address from = _ownerOf(tokenId);
        require(from == address(0) || to == address(0), "Token is soulbound");
        return super._update(to, tokenId, auth);
    }

    /// @notice Override supportsInterface to handle multiple inheritance
    function supportsInterface(bytes4 interfaceId) public view override(ERC721URIStorage, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}