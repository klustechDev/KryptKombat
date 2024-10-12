KryptKombat
KryptKombat is an advanced Ethereum-based NFT (Non-Fungible Token) project, featuring dynamic SVG-based NFTs with unique fighter characters and batch minting capabilities. The project implements royalty management, different fighter tiers, and evolving metadata using Solidity smart contracts. It is designed for both collectors and developers looking to explore complex NFT minting mechanics on the Ethereum blockchain.

Features
Dynamic SVG-Based NFTs: Each NFT is represented as an SVG image, dynamically generated and stored on-chain.
Batch Minting Logic: Efficient minting with a structured batch process that maintains rarity ratios across different fighter tiers.
Rarity Tiers:
Common: 100,000 maximum supply
Uncommon: 10,000 maximum supply
Rare: 1,000 maximum supply
Epic: 100 maximum supply
Legendary: 10 maximum supply
Royalties (ERC-2981): Implements royalty payments to the creator on every resale of the NFT.
Upgradable Metadata: Metadata evolves over time, updating attributes like "Days Since Mint" to reflect how long each NFT has been owned.
Customizable Colors: NFT owners can change the color attribute of their NFTs.
Comprehensive Test Suite: A set of tests to ensure correct functionality of minting logic, metadata updates, royalties, and more using Hardhat and Mocha.
Getting Started
Prerequisites
Make sure you have the following installed:

Node.js (v16.x or later)
npm or yarn
Hardhat (for Ethereum development)
Installation
Clone the repository:

bash
Copy code
git clone https://github.com/klustechDev/KryptKombat.git
cd KryptKombat
Install the dependencies:

bash
Copy code
npm install
Compile the smart contracts:

bash
Copy code
npx hardhat compile
Deployment
Deploy the smart contract to a local Hardhat network:

bash
Copy code
npx hardhat run scripts/deploy.js --network localhost
Make sure to have a local blockchain running using:

bash
Copy code
npx hardhat node
To deploy on a testnet like Rinkeby, update the network settings in hardhat.config.js and run:

bash
Copy code
npx hardhat run scripts/deploy.js --network rinkeby
Usage
Interacting with the Contract
After deploying the contract, you can interact with it through Hardhat's console:

bash
Copy code
npx hardhat console --network localhost
Minting an NFT
javascript
Copy code
const [owner] = await ethers.getSigners();
const KryptKombat = await ethers.getContractFactory("KryptKombat");
const kryptKombat = await KryptKombat.attach("YOUR_CONTRACT_ADDRESS");

// Mint a new NFT
await kryptKombat.mintSingle(owner.address, "yellow");
Batch Minting
javascript
Copy code
await kryptKombat.mintBatch(owner.address);
Update NFT Color
javascript
Copy code
await kryptKombat.changeColor(tokenId, "blue");
Running Tests
To ensure everything is working correctly, run the test suite:

bash
Copy code
npx hardhat test
The test suite includes:

Validation of the batch minting process.
Ensuring correct metadata updates.
Verifying royalty settings.
Testing token transfers and ownership checks.
Smart Contract Overview
KryptKombat.sol
The main smart contract KryptKombat.sol inherits from:

ERC721: Implements the basic NFT standard.
ERC2981: Implements royalty management for secondary sales.
Ownable: Provides access control for minting functions.
Key Functions:

mintSingle(address recipient, string memory color): Mints a single NFT with the specified initial color.
mintBatch(address recipient): Mints a batch of NFTs following the rarity tier distribution.
changeColor(uint256 tokenId, string memory newColor): Allows the owner to change the color of a specific NFT.
tokenURI(uint256 tokenId): Returns metadata JSON, including SVG image data.
supportsInterface(bytes4 interfaceId): Ensures compatibility with ERC2981 and ERC721.
Contributing
Contributions are welcome! If you would like to contribute to this project, please fork the repository and submit a pull request with your proposed changes.

Setting Up a Development Environment
Fork the repository on GitHub.

Clone your forked repository locally:

bash
Copy code
git clone https://github.com/your-username/KryptKombat.git
Create a new branch for your feature or bugfix:

bash
Copy code
git checkout -b feature/my-feature
Make your changes and ensure the tests are passing.

Commit your changes:

bash
Copy code
git commit -m "Add new feature"
Push your changes to GitHub:

bash
Copy code
git push origin feature/my-feature
Open a pull request against the main repository.

License
This project is licensed under the MIT License. See the LICENSE file for more details.

Acknowledgments
OpenZeppelin for the ERC721 and ERC2981 implementation.
Hardhat for providing an excellent Ethereum development environment.
Special thanks to the blockchain developer community for continuous support and contributions.
Feel free to update this README as your project evolves. It covers all the essential information for potential users, developers, and contributors, making it easier for them to understand and use the KryptKombat NFT project.
