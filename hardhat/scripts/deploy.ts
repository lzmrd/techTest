import { ethers } from "hardhat";

async function main() {
  const MintNFT = await ethers.getContractFactory("mintNFT"); // Obtains ContractFactory for mintNFT

  const mintNFT = await MintNFT.deploy(); // Deploys the mintNFT contract
  await mintNFT.deployed(); // Ensures deployment completion

  console.log(`MintNFT deployed to: ${mintNFT.address}`); // Logs the deployed contract address

  const RestrictedCollection = await ethers.getContractFactory("RestrictedCollection"); // Obtains ContractFactory for RestrictedCollection

  const restrictedCollection = await RestrictedCollection.deploy(mintNFT.address); // Deploys RestrictedCollection with mintNFT address
  await restrictedCollection.deployed(); // Ensures deployment completion

  console.log(`RestrictedCollection deployed to: ${restrictedCollection.address}`); // Logs the deployed contract address
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
