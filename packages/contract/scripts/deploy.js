// deploy.js

async function main() {
  const nftContractFactory = await hre.ethers.getContractFactory("MyEpicNFT");
  const nftContract = await nftContractFactory.deploy();
  await nftContract.deployed();
  console.log("Contract deployed to:", nftContract.address);

  const txn = await nftContract.makeAnEpicNFT();
  await txn.wait();

  const txn2 = await nftContract.makeAnEpicNFT();
  await txn2.wait();
}

main().catch((error) => {
  console.log(error);
  process.exitCode = 1;
});
