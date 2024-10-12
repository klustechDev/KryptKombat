const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("KryptKombat NFT Contract", function () {
    let kryptKombat;
    let owner;

    beforeEach(async () => {
        [owner] = await ethers.getSigners();
        const KryptKombat = await ethers.getContractFactory("KryptKombat");
        kryptKombat = await KryptKombat.deploy();
        await kryptKombat.deployed();
    });

    it("Should batch mint NFTs according to the supply limits and ratios", async function () {
        await kryptKombat.connect(owner).batchMint();

        const commonCount = await kryptKombat.commonCount();
        const uncommonCount = await kryptKombat.uncommonCount();
        const rareCount = await kryptKombat.rareCount();
        const epicCount = await kryptKombat.epicCount();
        const legendaryCount = await kryptKombat.legendaryCount();

        console.log(
            `Total minted - Common: ${commonCount}, Uncommon: ${uncommonCount}, Rare: ${rareCount}, Epic: ${epicCount}, Legendary: ${legendaryCount}`
        );

        expect(commonCount).to.equal(100);
        expect(uncommonCount).to.equal(10);
        expect(rareCount).to.equal(1);
        expect(epicCount).to.equal(1);
        expect(legendaryCount).to.equal(1);
    });

    it("Should mint an NFT with an initial color", async function () {
        await kryptKombat.connect(owner).batchMint();
        const tokenUri = await kryptKombat.tokenURI(0);
        const decodedData = Buffer.from(tokenUri.split(",")[1], "base64").toString();
        console.log("Decoded JSON:", decodedData);
        expect(decodedData).to.include("yellow");
    });
});
