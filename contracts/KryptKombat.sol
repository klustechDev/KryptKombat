// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract KryptKombat is ERC721, Ownable {
    uint256 public commonCount;
    uint256 public uncommonCount;
    uint256 public rareCount;
    uint256 public epicCount;
    uint256 public legendaryCount;

    uint256 public constant COMMON_LIMIT = 100000;
    uint256 public constant UNCOMMON_LIMIT = 10000;
    uint256 public constant RARE_LIMIT = 1000;
    uint256 public constant EPIC_LIMIT = 100;
    uint256 public constant LEGENDARY_LIMIT = 10;

    uint256 public tokenCounter;
    mapping(uint256 => string) private _tokenColors;

    constructor() ERC721("KryptKombat", "KKOMBAT") {}

    function batchMint() external onlyOwner {
        uint256 commonsToMint = 100;
        uint256 uncommonsToMint = commonsToMint / 10;
        uint256 raresToMint = uncommonsToMint / 10;
        uint256 epicsToMint = raresToMint;
        uint256 legendariesToMint = epicsToMint;

        mintBatch(commonsToMint, "yellow", "common");
        mintBatch(uncommonsToMint, "green", "uncommon");
        mintBatch(raresToMint, "blue", "rare");
        mintBatch(epicsToMint, "purple", "epic");
        mintBatch(legendariesToMint, "red", "legendary");
    }

    function mintBatch(uint256 amount, string memory color, string memory rarity) internal {
        for (uint256 i = 0; i < amount; i++) {
            if (keccak256(abi.encodePacked(rarity)) == keccak256("common")) {
                require(commonCount < COMMON_LIMIT, "Max common limit reached");
                commonCount++;
            } else if (keccak256(abi.encodePacked(rarity)) == keccak256("uncommon")) {
                require(uncommonCount < UNCOMMON_LIMIT, "Max uncommon limit reached");
                uncommonCount++;
            } else if (keccak256(abi.encodePacked(rarity)) == keccak256("rare")) {
                require(rareCount < RARE_LIMIT, "Max rare limit reached");
                rareCount++;
            } else if (keccak256(abi.encodePacked(rarity)) == keccak256("epic")) {
                require(epicCount < EPIC_LIMIT, "Max epic limit reached");
                epicCount++;
            } else if (keccak256(abi.encodePacked(rarity)) == keccak256("legendary")) {
                require(legendaryCount < LEGENDARY_LIMIT, "Max legendary limit reached");
                legendaryCount++;
            }

            _safeMint(msg.sender, tokenCounter);
            _tokenColors[tokenCounter] = color;
            tokenCounter++;
        }
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        string memory color = _tokenColors[tokenId];
        string memory svg = Base64.encode(bytes(string(abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">',
            '<rect width="100" height="100" fill="', color, '"/>',
            '<text x="10" y="20" font-family="Arial" font-size="10" fill="black">KryptKombat</text>',
            '<text x="10" y="40" font-family="Arial" font-size="10" fill="black">', color, '</text>',
            '</svg>'
        ))));

        return string(abi.encodePacked(
            "data:application/json;base64,",
            Base64.encode(bytes(abi.encodePacked(
                '{"name": "KryptKombat #', uintToString(tokenId), '",',
                '"description": "A dynamic on-chain SVG-based NFT",',
                '"image": "data:image/svg+xml;base64,', svg, '",',
                '"attributes": [{"trait_type": "Color", "value": "', color, '"}]}'
            )))
        ));
    }

    function uintToString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}
