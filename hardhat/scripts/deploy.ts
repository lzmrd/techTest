import { ethers } from "hardhat";


async function main() {
  // Ottieni il Contract Factory per il tuo contratto MintNFT
  const MintNFT = await ethers.getContractFactory("mintNFT");

  // Effettua il deploy del contratto
//  const mintNFT = await MintNFT_relayer.deploy(RELAYER_ADDRESS);
  const mintNFT = await MintNFT.deploy();

  // Aspetta che il deploy sia completato
  await mintNFT.deployed();

  console.log(`MintNFT deployed to: ${mintNFT.address}`);

  const RestrictedCollection = await ethers.getContractFactory("RestrictedCollection");

  const restrictedCollection =  await RestrictedCollection.deploy(mintNFT.address);

  await restrictedCollection.deployed();

  console.log(`MintNFT deployed to: ${restrictedCollection.address}`);


}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
