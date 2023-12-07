// src/listeners/blockchain.listener.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ethers } from 'ethers';
import axios from 'axios';
import { readFileSync } from 'fs';
import { join } from 'path';
require('dotenv').config();

const jsonPath = join(__dirname, '../../hardhat/artifacts/contracts/newCollection.sol/RestrictedCollection.json');
const contractABI = JSON.parse(readFileSync(jsonPath, 'utf-8')).abi;
const JWT = process.env.PINATA_JWT;
const GATEWAY_KEY = process.env.GATEWAY_KEY


@Injectable()
export class BlockchainListenerService implements OnModuleInit {
  private provider: ethers.WebSocketProvider;
  private nftContract: ethers.Contract;

  constructor() {
    this.provider = new ethers.WebSocketProvider(process.env.ALCHEMY_WEBSOCKET_API_KEY);
    this.nftContract = new ethers.Contract(
      process.env.MINT_SECOND_CONTRACT_ADDRESS,
      contractABI,
      this.provider
    );
  }

  async onModuleInit() {
    this.listenToNewMint();
    this.listenToCustomNames();
  }

  private listenToNewMint() {
    this.nftContract.on('TokenMinted', async (mintedCount , owner,  event) => {
      console.log(`NFT #${mintedCount} was minted to ${owner} `);
      const metadataUrl = await this.uploadNewNftToIpfs(mintedCount, owner);
      await this.updateTokenURI(mintedCount, metadataUrl);
    });
  }

  private async uploadNewNftToIpfs(mintedCount: number, owner: string): Promise<string> {
    const metadata = {
      name: `NFT #${mintedCount}`,
      owner: `Owner: ${owner}`
    };
    try{
    const response = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', metadata, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${JWT}`
      }
    });
    const url = `https://coral-used-orca-101.mypinata.cloud/ipfs/${response.data.IpfsHash}?pinataGatewayToken=${GATEWAY_KEY}`;
    console.log('Url: ', url);

    return url; 
  }   catch (error){
        console.error('Errore nel caricamento su Pinata:',error);
        return '';
    }
  }

  private listenToCustomNames() {
    this.nftContract.on('NameChanged', async (tokenId, newName,  event) => {
      console.log(`NFT #${tokenId} has changed its name in ${newName}`);
      const metadataUrl = await this.uploadMetadataToIpfs(tokenId, newName);
      await this.updateTokenURI(tokenId, metadataUrl);
    });
  }

  private async uploadMetadataToIpfs(tokenId: number, newName: string): Promise<string> {
    const metadata = {
      name: `NFT #${newName}`,
      description: `Descrizione dell'NFT #${newName}`,
      image: `url dell'immagine dell'NFT #${newName}`
    };
    try{
    const response = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', metadata, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${JWT}`
      }
    });
    const url = `https://coral-used-orca-101.mypinata.cloud/ipfs/${response.data.IpfsHash}?pinataGatewayToken=${GATEWAY_KEY}`;
    console.log('Url: ', url);
    return url; 
} catch (error){
  console.error('Errore nel caricamento su Pinata:',error);
  return '';
}
  }
  

  private async updateTokenURI(tokenId: number, metadataUrl: string) {
    // Crea un signer con i permessi necessari per chiamare la funzione setTokenURI
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
  
    // Crea un'istanza del contratto con il signer per poter eseguire transazioni
    const nftContractWithSigner = this.nftContract.connect(signer);
  
    try {
      // Formatta l'URL completo dei metadati su Pinata
  
      // Chiama la funzione setTokenURI sullo smart contract
      const tx = await nftContractWithSigner.setTokenURI(tokenId, metadataUrl);
      await tx.wait();
      console.log(`Token URI updated for token #${tokenId}: ${metadataUrl}`);
    } catch (error) {
      console.error('Errore nell\'aggiornamento del Token URI:', error);
    }
  }
  
}

