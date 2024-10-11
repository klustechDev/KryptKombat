// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";

error ERC721InsufficientApproval(address operator, uint256 tokenId);

contract KryptKombat is ERC721, ERC2981, Ownable {
    uint256 public tokenCounter;
    string private baseTokenURI;
    mapping(uint256 => uint256) private mintTimestamps;

    constructor(string memory baseURI, address royaltyReceiver, uint96 royaltyFee) 
        ERC721("KryptKombat", "KKOMBAT") 
    {
        tokenCounter = 0;
        baseTokenURI = baseURI;
        _setDefaultRoyalty(royaltyReceiver, royaltyFee);
    }

    function createNFT(address to) public onlyOwner returns (uint256) {
        uint256 newTokenId = tokenCounter;
        _safeMint(to, newTokenId);
        mintTimestamps[newTokenId] = block.timestamp;
        tokenCounter += 1;
        return newTokenId;
    }

    function batchMint(address to, uint256 numberOfTokens) public onlyOwner {
        require(numberOfTokens > 0, "Number of tokens must be greater than zero");
        for (uint256 i = 0; i < numberOfTokens; i++) {
            createNFT(to);
        }
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        // Calculate days since minting
        uint256 daysSinceMint = (block.timestamp - mintTimestamps[tokenId]) / 1 days;

        // Construct different URIs based on time since minting
        if (daysSinceMint < 30) {
            return string(abi.encodePacked(baseTokenURI, "initial.json"));
        } else if (daysSinceMint < 365) {
            return string(abi.encodePacked(baseTokenURI, "evolved.json"));
        } else {
            return string(abi.encodePacked(baseTokenURI, "legendary.json"));
        }
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }

    function setBaseURI(string memory newBaseURI) external onlyOwner {
        baseTokenURI = newBaseURI;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);

        if (from != address(0) && !_isSenderApprovedOrOwner(msg.sender, tokenId)) {
            revert ERC721InsufficientApproval(msg.sender, tokenId);
        }
    }

    function _isSenderApprovedOrOwner(address sender, uint256 tokenId) internal view returns (bool) {
        return (ownerOf(tokenId) == sender ||
            getApproved(tokenId) == sender ||
            isApprovedForAll(ownerOf(tokenId), sender));
    }

    function supportsInterface(bytes4 interfaceId) 
        public 
        view 
        virtual 
        override(ERC721, ERC2981) 
        returns (bool) 
    {
        return super.supportsInterface(interfaceId);
    }
}
