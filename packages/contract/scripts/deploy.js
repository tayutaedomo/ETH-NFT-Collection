// deploy.js

async function main() {
  const nftContractFactory = await hre.ethers.getContractFactory("MyEpicNFT");
  const nftContract = await nftContractFactory.deploy();
  await nftContract.deployed();
  console.log("Contract deployed to:", nftContract.address);

  const txn = await nftContract.makeAnEpicNFT();
  await txn.wait();
  console.log("Minted NFT #1");
}

main().catch((error) => {
  console.log(error);
  process.exitCode = 1;
});
