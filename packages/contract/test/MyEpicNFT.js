const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("MyEpicNFT", function () {
  async function deployMyEpicNFTFixture() {
    const [owner] = await ethers.getSigners();
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
    return { MyEpicNFT, owner, firstWords, secondWords, thirdWords };
  }

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
});
