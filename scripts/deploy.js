const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const KryptKombat = await hre.ethers.getContractFactory("KryptKombat");
    const kryptKombat = await KryptKombat.deploy();
    await kryptKombat.deployed();

    console.log("KryptKombat deployed to:", kryptKombat.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
