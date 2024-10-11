const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const KryptKombat = await ethers.getContractFactory("KryptKombat");
    const kryptKombat = await KryptKombat.deploy();

    await kryptKombat.deployed();
    console.log("KryptKombat deployed to:", kryptKombat.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
