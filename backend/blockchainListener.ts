import { Injectable, OnModuleInit } from '@nestjs/common';
import { ethers, Contract } from 'ethers';
import axios from 'axios';
import { readFileSync } from 'fs';
import { join } from 'path';
import { EtherscanProvider } from '@ethersproject/providers';
require('dotenv').config();

const jsonPath = join(__dirname, '../../hardhat/artifacts/contracts/newCollection.sol/RestrictedCollection.json');
const contractABI = JSON.parse(readFileSync(jsonPath, 'utf-8')).abi;

const JWT = process.env.PINATA_JWT;  
const GATEWAY_KEY = process.env.GATEWAY_KEY;

@Injectable()
export class BlockchainListenerService implements OnModuleInit {
  private txProvider: ethers.JsonRpcProvider;
  private provider: ethers.WebSocketProvider;
  private nftContract: ethers.Contract;
  private nftContractTx: ethers.Contract;
  private wallet: ethers.Wallet;

  constructor() {
    this.txProvider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL); // Set transaction provider
    this.provider = new ethers.WebSocketProvider(process.env.ALCHEMY_WEBSOCKET_API_KEY); // Set WebSocket provider
    this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.txProvider); // Set your wallet

    this.nftContract = new ethers.Contract(       // Set smart contrcat you want interact with
      process.env.MINT_SECOND_CONTRACT_ADDRESS,
      contractABI,
      this.provider
    );
    this.nftContractTx = new ethers.Contract(    // Set smart contrcat you want interact with
      process.env.MINT_SECOND_CONTRACT_ADDRESS,
      contractABI,
      this.wallet
    );
  }

  async onModuleInit() {
    this.listenToNewMint(); // Listen to new mint events
    this.listenToCustomNames(); // Listen to custom names events
  }

  private listenToNewMint() {            // it catches 'TokenMinted' events emitted from smart contract
    this.nftContract.on('TokenMinted', async (mintedCount , owner,  event) => {
      console.log(`NFT #${mintedCount} was minted to ${owner}`);
      const metadataUrl = await this.uploadNewNftToIpfs(mintedCount, owner);  //it create its metadata URL
      await this.updateTokenURI(mintedCount, metadataUrl);
    });
  }
  private listenToCustomNames() {         // it catches 'NameChanged' events emitted from smart contract
    this.nftContract.on('NameChanged', async (tokenId, newName,  event) => {  
      console.log(`NFT #${tokenId} has changed its name in ${newName}`);
      const metadataUrl = await this.uploadMetadataToIpfs(tokenId, newName);  //it updates its metadata URL

      await this.updateTokenURI(tokenId, metadataUrl);
    });
  }

  private async uploadNewNftToIpfs(mintedCount: number, owner: string): Promise<string> {
    const metadata = {                  // metadata will be uploaded on IPFS
      name: `NFT #${mintedCount}`,
      owner: `Owner: ${owner}`
    };
    try {
      const response = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', metadata, {   //it calls the endpoint which let you upload metadata on IPFS
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${JWT}`
        }
      });
      const url = `https://coral-used-orca-101.mypinata.cloud/ipfs/${response.data.IpfsHash}?pinataGatewayToken=${GATEWAY_KEY}`;  // it's the url where you will find your NFT's metadata
      console.log('Url: ', url);
      return url;
    } catch (error) {
      console.error('Error uploading to Pinata:', error);
      return '';
    }
  }
}