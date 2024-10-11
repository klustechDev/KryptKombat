// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error ERC721InsufficientApproval(address operator, uint256 tokenId);

contract KryptKombat is ERC721, Ownable {
    uint256 public tokenCounter;

    constructor() ERC721("KryptKombat", "KKOMBAT") {
        tokenCounter = 0;
    }

    function createNFT(address to) public onlyOwner returns (uint256) {
        uint256 newTokenId = tokenCounter;
        _safeMint(to, newTokenId);
        tokenCounter += 1;
        return newTokenId;
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
}
