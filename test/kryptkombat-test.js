const { expect } = require("chai");
const { ethers, network } = require("hardhat");

describe("KryptKombat NFT Contract", function () {
    let kryptKombat, owner, recipient, otherAccount;

    beforeEach(async function () {
        [owner, recipient, otherAccount] = await ethers.getSigners();
        const KryptKombat = await ethers.getContractFactory("KryptKombat");
        kryptKombat = await KryptKombat.deploy(
            "ipfs://YOUR_IPFS_CID/", // Replace with your IPFS CID
            owner.address,
            500 // 5% royalty fee
        );
        await kryptKombat.deployed();
    });

    it("Should mint an NFT to the owner", async function () {
        await kryptKombat.createNFT(owner.address);
        const balance = await kryptKombat.balanceOf(owner.address);
        expect(balance).to.equal(1);
    });

    it("Should batch mint NFTs", async function () {
        await kryptKombat.batchMint(owner.address, 3);
        const balance = await kryptKombat.balanceOf(owner.address);
        expect(balance).to.equal(3);
    });

    it("Should transfer an NFT from owner to recipient", async function () {
        await kryptKombat.createNFT(owner.address);
        await kryptKombat.transferFrom(owner.address, recipient.address, 0);
        const newOwner = await kryptKombat.ownerOf(0);
        expect(newOwner).to.equal(recipient.address);
    });

    it("Should fail when transferring a token without ownership", async function () {
        await kryptKombat.createNFT(owner.address);
        await expect(
            kryptKombat.connect(otherAccount).transferFrom(owner.address, recipient.address, 0)
        ).to.be.revertedWith("ERC721: caller is not token owner or approved");
    });

    it("Should only allow the owner to mint new tokens", async function () {
        await expect(
            kryptKombat.connect(otherAccount).createNFT(otherAccount.address)
        ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should correctly set royalty info", async function () {
        const royaltyInfo = await kryptKombat.royaltyInfo(0, 10000); // Query for 10,000 units of sale price
        expect(royaltyInfo[0]).to.equal(owner.address);
        expect(royaltyInfo[1]).to.equal(500); // 5% of 10,000 is 500
    });

    it("Should update the tokenURI based on time since minting", async function () {
        await kryptKombat.createNFT(owner.address);
        const tokenId = 0;

        let uri = await kryptKombat.tokenURI(tokenId);
        expect(uri).to.equal("ipfs://YOUR_IPFS_CID/initial.json");

        // Simulate time passing (e.g., by 31 days)
        await network.provider.send("evm_increaseTime", [31 * 24 * 60 * 60]); // 31 days
        await network.provider.send("evm_mine");

        uri = await kryptKombat.tokenURI(tokenId);
        expect(uri).to.equal("ipfs://YOUR_IPFS_CID/evolved.json");

        // Simulate more time passing (e.g., by 365 days)
        await network.provider.send("evm_increaseTime", [334 * 24 * 60 * 60]); // Additional 334 days
        await network.provider.send("evm_mine");

        uri = await kryptKombat.tokenURI(tokenId);
        expect(uri).to.equal("ipfs://YOUR_IPFS_CID/legendary.json");
    });
});
