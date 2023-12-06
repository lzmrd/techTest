"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
const RELAYER_ADDRESS = '0xC6763329FBBDECa1998AB8893Fde90Bf08DFBdbc';
async function main() {
    // Ottieni il Contract Factory per il tuo contratto MintNFT
    const MintNFT_backend = await hardhat_1.ethers.getContractFactory("MintNFT_backend");
    // Effettua il deploy del contratto
    //  const mintNFT = await MintNFT_relayer.deploy(RELAYER_ADDRESS);
    const mintNFT = await MintNFT_backend.deploy();
    // Aspetta che il deploy sia completato
    await mintNFT.deployed();
    console.log(`MintNFT deployed to: ${mintNFT.address}`);
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
