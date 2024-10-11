const { expect } = require("chai");
const { ethers, network } = require("hardhat");

describe("KryptKombat NFT Contract", function () {
    let kryptKombat, owner, recipient, otherAccount;

    beforeEach(async function () {
        [owner, recipient, otherAccount] = await ethers.getSigners();
        const KryptKombat = await ethers.getContractFactory("KryptKombat");
        kryptKombat = await KryptKombat.deploy(owner.address, 500);
        await kryptKombat.deployed();
    });

    it("Should mint an NFT with an initial color", async function () {
        await kryptKombat.createNFT(owner.address, "red");
        const color = await kryptKombat.colors(0);
        expect(color).to.equal("red");
    });

    it("Should batch mint NFTs", async function () {
        await kryptKombat.batchMint(owner.address, 3, "blue");
        const balance = await kryptKombat.balanceOf(owner.address);
        expect(balance).to.equal(3);
    });

    it("Should change the color of an NFT", async function () {
        await kryptKombat.createNFT(owner.address, "red");
        await kryptKombat.changeColor(0, "blue");
        const color = await kryptKombat.colors(0);
        expect(color).to.equal("blue");
    });

    it("Should transfer an NFT from owner to recipient", async function () {
        await kryptKombat.createNFT(owner.address, "green");
        await kryptKombat.transferFrom(owner.address, recipient.address, 0);
        const newOwner = await kryptKombat.ownerOf(0);
        expect(newOwner).to.equal(recipient.address);
    });

    it("Should fail when transferring a token without ownership", async function () {
        await kryptKombat.createNFT(owner.address, "green");
        await expect(
            kryptKombat.connect(otherAccount).transferFrom(owner.address, recipient.address, 0)
        ).to.be.revertedWith("ERC721: caller is not token owner or approved");
    });

    it("Should only allow the owner to mint new tokens", async function () {
        await expect(
            kryptKombat.connect(otherAccount).createNFT(otherAccount.address, "yellow")
        ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should correctly set royalty info", async function () {
        const royaltyInfo = await kryptKombat.royaltyInfo(0, 10000);
        expect(royaltyInfo[0]).to.equal(owner.address);
        expect(royaltyInfo[1]).to.equal(500);
    });

    it("Should update the tokenURI based on time since minting", async function () {
        await kryptKombat.createNFT(owner.address, "yellow");
        const tokenId = 0;

        // Get initial URI and decode JSON
        let uri = await kryptKombat.tokenURI(tokenId);
        console.log("Initial URI:", uri);
        const decodedJson = JSON.parse(Buffer.from(uri.split(',')[1], 'base64').toString('utf-8'));
        console.log("Decoded JSON:", decodedJson);
        expect(decodedJson.attributes).to.deep.include({ trait_type: "Days Since Mint", value: "0" });

        // Simulate 31 days passing
        await network.provider.send("evm_increaseTime", [31 * 24 * 60 * 60]);
        await network.provider.send("evm_mine");

        uri = await kryptKombat.tokenURI(tokenId);
        console.log("Updated URI after 31 days:", uri);
        const updatedDecodedJson = JSON.parse(Buffer.from(uri.split(',')[1], 'base64').toString('utf-8'));
        console.log("Updated Decoded JSON:", updatedDecodedJson);
        expect(updatedDecodedJson.attributes).to.deep.include({ trait_type: "Days Since Mint", value: "31" });
    });
});
