const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("KryptKombat NFT Contract", function () {
    let kryptKombat, owner, recipient, otherAccount;

    beforeEach(async function () {
        [owner, recipient, otherAccount] = await ethers.getSigners();
        const KryptKombat = await ethers.getContractFactory("KryptKombat");
        kryptKombat = await KryptKombat.deploy();
        await kryptKombat.deployed();
    });

    it("Should mint an NFT to the owner", async function () {
        await kryptKombat.createNFT(owner.address);
        const balance = await kryptKombat.balanceOf(owner.address);
        console.log("Minted an NFT to the owner address. Balance:", balance.toString());
        expect(balance).to.equal(1);
    });

    it("Should transfer an NFT from owner to recipient", async function () {
        await kryptKombat.createNFT(owner.address);
        await kryptKombat.transferFrom(owner.address, recipient.address, 0);
        const newOwner = await kryptKombat.ownerOf(0);
        console.log("Transferred NFT with token ID 0 to the recipient. New owner:", newOwner);
        expect(newOwner).to.equal(recipient.address);
    });

    it("Should fail when transferring a token without ownership", async function () {
        await kryptKombat.createNFT(owner.address);
        await expect(
            kryptKombat.connect(otherAccount).transferFrom(owner.address, recipient.address, 0)
        ).to.be.revertedWith("ERC721: caller is not token owner or approved");
    });

    it("Should mint multiple NFTs and check balances", async function () {
        await kryptKombat.createNFT(owner.address);
        await kryptKombat.createNFT(owner.address);
        const balance = await kryptKombat.balanceOf(owner.address);
        console.log("Minted two NFTs to the owner address. Balance:", balance.toString());
        expect(balance).to.equal(2);
    });

    it("Should only allow the owner to mint new tokens", async function () {
        await expect(
            kryptKombat.connect(otherAccount).createNFT(otherAccount.address)
        ).to.be.revertedWith("Ownable: caller is not the owner");
    });
});
