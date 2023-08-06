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

  describe("mintingFee", function () {
    it("should return the minting fee", async function () {
      const { MyEpicNFT } = await loadFixture(deployMyEpicNFTFixture);
      expect(await MyEpicNFT.mintingFee()).to.equal(
        ethers.utils.parseEther("0.00001")
      );
    });
  });

  describe("setMintingFee", function () {
    it("should allow owner to set minting fee", async function () {
      const { MyEpicNFT, owner } = await loadFixture(deployMyEpicNFTFixture);
      await MyEpicNFT.connect(owner).setMintingFee(
        ethers.utils.parseEther("0.0002")
      );
      expect(await MyEpicNFT.mintingFee()).to.equal(
        ethers.utils.parseEther("0.0002")
      );
    });

    it("should not allow non-owner to set minting fee", async function () {
      const { MyEpicNFT, nonOwner } = await loadFixture(deployMyEpicNFTFixture);
      await expect(
        MyEpicNFT.connect(nonOwner).setMintingFee(
          ethers.utils.parseEther("0.0002")
        )
      ).to.be.revertedWith("Ownable: caller is not the owner");
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

    it("should collect minting fee", async function () {
      const { MyEpicNFT, owner, nonOwner } = await loadFixture(
        deployMyEpicNFTFixture
      );
      const feeBefore = await ethers.provider.getBalance(MyEpicNFT.address);
      await MyEpicNFT.connect(owner).makeAnEpicNFT();
      await MyEpicNFT.connect(nonOwner).makeAnEpicNFT({
        value: ethers.utils.parseEther("0.01"),
      });
      const feeAfter = await ethers.provider.getBalance(MyEpicNFT.address);
      expect(feeAfter.sub(feeBefore)).to.equal(ethers.utils.parseEther("0.01"));
    });

    it("should revert if minting fee is not provided", async function () {
      const { MyEpicNFT, nonOwner } = await loadFixture(deployMyEpicNFTFixture);
      await expect(
        MyEpicNFT.connect(nonOwner).makeAnEpicNFT()
      ).to.be.revertedWith("Insufficient minting fee provided");
    });
  });

  describe("withdraw", function () {
    it("should allow owner to withdraw", async function () {
      const { MyEpicNFT, owner } = await loadFixture(deployMyEpicNFTFixture);
      await MyEpicNFT.makeAnEpicNFT({ value: ethers.utils.parseEther("0.01") });
      const ownerBalanceBefore = await ethers.provider.getBalance(
        owner.address
      );
      const contractBalanceBefore = await ethers.provider.getBalance(
        MyEpicNFT.address
      );

      const tx = await MyEpicNFT.connect(owner).withdraw();
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed;
      const txDetails = await ethers.provider.getTransaction(tx.hash);
      const gasPrice = txDetails.gasPrice;
      const gasCost = gasUsed.mul(gasPrice);

      const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);
      const contractBalanceAfter = await ethers.provider.getBalance(
        MyEpicNFT.address
      );

      expect(ownerBalanceAfter.add(gasCost).sub(ownerBalanceBefore)).to.equal(
        contractBalanceBefore
      );
      expect(contractBalanceAfter).to.equal(0);
    });

    it("should not allow non-owner to withdraw", async function () {
      const { MyEpicNFT, nonOwner } = await loadFixture(deployMyEpicNFTFixture);
      await expect(MyEpicNFT.connect(nonOwner).withdraw()).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });
  });

  describe("royaltyReceiver", function () {
    it("should set the correct initial royaltyReceiver", async function () {
      const { MyEpicNFT, owner } = await loadFixture(deployMyEpicNFTFixture);
      expect(await MyEpicNFT.royaltyReceiver()).to.equal(owner.address);
    });
  });

  describe("setRoyaltyReceiver", function () {
    it("should allow owner to set royaltyReceiver", async function () {
      const { MyEpicNFT, owner, nonOwner } = await loadFixture(
        deployMyEpicNFTFixture
      );
      await MyEpicNFT.connect(owner).setRoyaltyReceiver(nonOwner.address);
      expect(await MyEpicNFT.royaltyReceiver()).to.equal(nonOwner.address);
    });

    it("should not allow non-owner to set royaltyReceiver", async function () {
      const { MyEpicNFT, nonOwner } = await loadFixture(deployMyEpicNFTFixture);
      await expect(
        MyEpicNFT.connect(nonOwner).setRoyaltyReceiver(nonOwner.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should revert if setting invalid address as royaltyReceiver", async function () {
      const { MyEpicNFT, owner } = await loadFixture(deployMyEpicNFTFixture);
      await expect(
        MyEpicNFT.connect(owner).setRoyaltyReceiver(
          ethers.constants.AddressZero
        )
      ).to.be.revertedWith("Invalid address");
    });
  });

  describe("setRoyaltyPercentage", function () {
    it("should allow owner to set royaltyPercentage", async function () {
      const { MyEpicNFT, owner } = await loadFixture(deployMyEpicNFTFixture);
      const newPercentage = 5;
      await MyEpicNFT.connect(owner).setRoyaltyPercentage(newPercentage);
      expect(await MyEpicNFT.royaltyPercentage()).to.equal(newPercentage);
    });

    it("should not allow non-owner to set royaltyPercentage", async function () {
      const { MyEpicNFT, nonOwner } = await loadFixture(deployMyEpicNFTFixture);
      await expect(
        MyEpicNFT.connect(nonOwner).setRoyaltyPercentage(5)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("royaltyInfo", function () {
    it("should return the correct royalty information", async function () {
      const { MyEpicNFT, owner } = await loadFixture(deployMyEpicNFTFixture);
      await MyEpicNFT.makeAnEpicNFT({ value: ethers.utils.parseEther("0.01") });
      const [receiver, amount] = await MyEpicNFT.royaltyInfo(
        1,
        ethers.utils.parseEther("1")
      );
      expect(receiver).to.equal(owner.address);
      expect(amount).to.equal(ethers.utils.parseEther("0.1"));
    });
  });
});
