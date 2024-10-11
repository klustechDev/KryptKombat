const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const baseURI = "ipfs://YOUR_IPFS_CID/"; // Replace with your IPFS base URI
    const royaltyReceiver = deployer.address;
    const royaltyFee = 500; // 5% (500 basis points)

    const KryptKombat = await ethers.getContractFactory("KryptKombat");
    const kryptKombat = await KryptKombat.deploy(baseURI, royaltyReceiver, royaltyFee);

    await kryptKombat.deployed();
    console.log("KryptKombat deployed to:", kryptKombat.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
