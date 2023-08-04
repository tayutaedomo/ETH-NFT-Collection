const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("MyEpicNFT", function () {
  async function deployMyEpicNFTFixture() {
    const [owner, nonOwner] = await ethers.getSigners();
    const firstWords = [
      "Shoot",
      "Task",
      "Couple",
      "Senior",
      "Attack",
      "Bed",
      "Assume",
      "News",
      "Drive",
      "Quality",
    ];
    const secondWords = [
      "Behind",
      "Body",
      "Front",
      "Year",
      "Three",
      "Everything",
      "Head",
      "Middle",
      "Happy",
      "Everything",
    ];
    const thirdWords = [
      "Push",
      "Break",
      "Ten",
      "Begin",
      "Until",
      "Even",
      "Board",
      "Order",
      "Lead",
      "Moment",
    ];
    const MyEpicNFTFactory = await ethers.getContractFactory("MyEpicNFT");
    const MyEpicNFT = await MyEpicNFTFactory.deploy();
    return { MyEpicNFT, owner, nonOwner, firstWords, secondWords, thirdWords };
  }

  describe("maxSupply", function () {
    it("should return max NFT supply", async function () {
      const { MyEpicNFT } = await loadFixture(deployMyEpicNFTFixture);
      expect(await MyEpicNFT.maxSupply()).to.equal(50);
    });
  });

  describe("setMaxSupply", function () {
    it("should allow owner to set max supply", async function () {
      const { MyEpicNFT, owner } = await loadFixture(deployMyEpicNFTFixture);
      await MyEpicNFT.connect(owner).setMaxSupply(100);
      expect(await MyEpicNFT.maxSupply()).to.equal(100);
    });

    it("should not allow non-owner to set max supply", async function () {
      const { MyEpicNFT, nonOwner } = await loadFixture(deployMyEpicNFTFixture);
      await expect(
        MyEpicNFT.connect(nonOwner).setMaxSupply(100)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("totalSupply", function () {
    it("should return total minted NFTs", async function () {
      const { MyEpicNFT } = await loadFixture(deployMyEpicNFTFixture);
      await MyEpicNFT.makeAnEpicNFT();
      await MyEpicNFT.makeAnEpicNFT();
      expect(await MyEpicNFT.totalSupply()).to.equal(2);
    });
  });

  describe("pickRandomFirstWord", function () {
    it("should get strings in firstWords", async function () {
      const { MyEpicNFT, firstWords } = await loadFixture(
        deployMyEpicNFTFixture
      );
      expect(firstWords).to.include(await MyEpicNFT.pickRandomFirstWord(0));
    });
  });

  describe("pickRandomSecondWord", function () {
    it("should get strings in secondWords", async function () {
      const { MyEpicNFT, secondWords } = await loadFixture(
        deployMyEpicNFTFixture
      );
      expect(secondWords).to.include(await MyEpicNFT.pickRandomSecondWord(0));
    });
  });

  describe("pickRandomThirdWord", function () {
    it("should get strings in thirdWords", async function () {
      const { MyEpicNFT, thirdWords } = await loadFixture(
        deployMyEpicNFTFixture
      );
      expect(thirdWords).to.include(await MyEpicNFT.pickRandomThirdWord(0));
    });
  });

  describe("makeAnEpicNFT", function () {
    it("emit a NewEpicNFTMinted event", async function () {
      const { MyEpicNFT, owner } = await loadFixture(deployMyEpicNFTFixture);
      await expect(MyEpicNFT.makeAnEpicNFT())
        .to.emit(MyEpicNFT, "NewEpicNFTMinted")
        .withArgs(owner.address, 1);
    });

    it("should fail to mint a new NFT if the max supply is reached", async function () {
      const { MyEpicNFT } = await loadFixture(deployMyEpicNFTFixture);
      const maxSupply = 1;
      await MyEpicNFT.setMaxSupply(maxSupply);
      await MyEpicNFT.makeAnEpicNFT();
      await expect(MyEpicNFT.makeAnEpicNFT()).to.be.revertedWith(
        "Maximum NFT supply reached."
      );
    });
  });
});
