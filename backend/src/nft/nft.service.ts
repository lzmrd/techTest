import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { readFileSync } from 'fs';
import { join } from 'path';
require('dotenv').config();

// Define the path to the contract's JSON file and load the contract's ABI
const jsonPath = join(__dirname, '../../../../hardhat/artifacts/contracts/mintNFT.sol/mintNFT.json');
const contractABI = JSON.parse(readFileSync(jsonPath, 'utf-8')).abi;

@Injectable()
export class NftService {
    private provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL); // Create an Ethereum provider using the configured RPC URL
    private wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider); // Create a wallet using the provided private key and the Ethereum provider
    private contract = new ethers.Contract(process.env.MINT_BACKEND_CONTRACT_ADDRESS, contractABI, this.wallet); // Create an Ethereum contract instance using the contract address and ABI

    async mint(userAddress: string): Promise<string> {
        const tx = await this.contract.mint(userAddress); // Initiate a transaction to mint an NFT for the provided user address
        await tx.wait(); // Wait for the transaction to be confirmed on the blockchain
        return tx.hash; // Return the transaction hash upon successful minting
    }
}
