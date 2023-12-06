import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { readFileSync } from 'fs';
import { join } from 'path';
require('dotenv').config();
const jsonPath = join(__dirname, '../../../hardhat/artifacts/contracts/mintNFT.sol/mintNFT.json');
const contractABI = JSON.parse(readFileSync(jsonPath, 'utf-8')).abi;

@Injectable()
export class NftService {
    
    private provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    private wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
    private contract = new ethers.Contract(process.env.MINT_BACKEND_CONTRACT_ADDRESS, contractABI, this.wallet);

    async mint(userAddress: string): Promise<string> {
        const tx = await this.contract.mint(userAddress); // Assumi che il metodo mintNFT accetti un indirizzo
        await tx.wait();
        return tx.hash;
    }
}
