// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract KryptKombat is ERC721, ERC2981, Ownable {
    uint256 public tokenCounter;
    mapping(uint256 => string) public colors;
    mapping(uint256 => uint256) private mintTimestamps;

    constructor(address royaltyReceiver, uint96 royaltyFee)
        ERC721("KryptKombat", "KKOMBAT")
    {
        tokenCounter = 0;
        _setDefaultRoyalty(royaltyReceiver, royaltyFee);
    }

    function createNFT(address to, string memory initialColor)
        public
        onlyOwner
        returns (uint256)
    {
        uint256 newTokenId = tokenCounter;
        _safeMint(to, newTokenId);
        colors[newTokenId] = initialColor;
        mintTimestamps[newTokenId] = block.timestamp;
        tokenCounter += 1;
        return newTokenId;
    }

    function batchMint(address to, uint256 numberOfTokens, string memory color) public onlyOwner {
        for (uint256 i = 0; i < numberOfTokens; i++) {
            createNFT(to, color);
        }
    }

    function changeColor(uint256 tokenId, string memory newColor) public {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "Not owner nor approved");
        colors[tokenId] = newColor;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        string memory svg = generateSVG(tokenId);
        uint256 daysSinceMint = (block.timestamp - mintTimestamps[tokenId]) / 1 days;
        string memory json = string(
            abi.encodePacked(
                '{"name": "KryptKombat #',
                Strings.toString(tokenId),
                '", "description": "A dynamic on-chain SVG-based NFT", "image": "data:image/svg+xml;base64,',
                Base64.encode(bytes(svg)),
                '", "attributes": [{"trait_type": "Color", "value": "',
                colors[tokenId],
                '"}, {"trait_type": "Days Since Mint", "value": "',
                Strings.toString(daysSinceMint),
                '"}]}'
            )
        );

        return string(abi.encodePacked("data:application/json;base64,", Base64.encode(bytes(json))));
    }

    function generateSVG(uint256 tokenId) internal view returns (string memory) {
        string memory color = colors[tokenId];
        uint256 daysSinceMint = (block.timestamp - mintTimestamps[tokenId]) / 1 days;

        return string(
            abi.encodePacked(
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">',
                '<rect width="100" height="100" fill="', color, '"/>',
                '<text x="10" y="20" font-family="Arial" font-size="10" fill="black">KryptKombat</text>',
                '<text x="10" y="40" font-family="Arial" font-size="10" fill="black">Days Since Mint: ', Strings.toString(daysSinceMint), '</text>',
                '</svg>'
            )
        );
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
