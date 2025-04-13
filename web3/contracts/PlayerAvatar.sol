// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Rune.sol";

contract PlayerAvatarNFT is ERC721URIStorage, ERC721Burnable, Ownable {
    Rune public rune;
    mapping(address => uint256) private _ownedToken;
    uint256 private _nextTokenId = 1;

    event AvatarMinted(address indexed user, uint256 tokenId, string uri);
    event AvatarUpdated(address indexed user, string newUri);

    constructor(
        address initialOwner,
        address _Rune
    ) ERC721("Player Avatar NFT", "AVATAR") Ownable(initialOwner) {
        rune = Rune(_Rune);
    }

    function mintAvatar(string calldata uri) external {
        require(_ownedToken[msg.sender] == 0, "Already owns an avatar");
        require(bytes(uri).length > 0, "URI cannot be empty");

        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);

        _ownedToken[msg.sender] = tokenId;
        rune.allocateInitialTokens(msg.sender);

        emit AvatarMinted(msg.sender, tokenId, uri);
    }

    function updateAvatar(string calldata newUri) external {
        uint256 tokenId = _ownedToken[msg.sender];
        require(tokenId != 0, "No avatar owned");
        require(bytes(newUri).length > 0, "URI cannot be empty");

        _setTokenURI(tokenId, newUri);
        emit AvatarUpdated(msg.sender, newUri);
    }

    function ownerMint(address to, string calldata uri) external onlyOwner {
        require(_ownedToken[to] == 0, "Already owns an avatar");
        require(bytes(uri).length > 0, "URI cannot be empty");

        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        _ownedToken[to] = tokenId;
        emit AvatarMinted(to, tokenId, uri);
    }

    function getAvatar(
        address user
    ) external view returns (uint256, string memory) {
        uint256 tokenId = _ownedToken[user];
        if (tokenId == 0) return (0, "");
        return (tokenId, tokenURI(tokenId));
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
