# Techical Test

This project involves the creation of two smart contracts on the Sepolia network along with a Node.js (TypeScript) backend, following the specified requirements.

## Smart Contract 1 - Mint NFT:

- Single NFT per wallet.
- No associated cost for minting.
- Total supply: 100 NFTs.
- Transaction fees will be handled by the backend.

## Smart Contract 2 - Mint NFT with Additional Rules:

- Minting allowed only for holders of an NFT from the first smart contract.
- Maximum 5 NFTs per transaction.
- Total supply: 40 NFTs.
- Minting cost:
  - First 15 NFTs: 0.00000005 ETH each.
  - Remaining NFTs: 0.0006 ETH each.
- Option to purchase a customized name for your NFT at a cost of 0.0004 ETH.

## Backend in Node.js (TypeScript):

- Exposes an API for minting NFTs from the first smart contract.
- Manages transaction fees from the backend.
- Listens to on-chain events from the second smart contract to update metadata on Pinata and the smart contract.

## Additional Requirements:

- Integration with Pinata for uploading new JSON.
- Interception and management of NFT name change request events.
- Preferred use of Hardhat, NestJs, and well-commented clean code.

# Environment Setup

1. Clone this repo and run `npm install` (in both directories) to install the dependencies. 
2. Set enviromental variables and populate `.env.example` file and rename it in `.env`. In order to populate your file, you can move to backend directory e run `generateWallet.js` script which will create a public and a private key for your backend. 
3. Create API keys from providers like Alchemy or Infura to be able of interacting with Sepolia testnet.
4. Move to hardhat directory and run `npx hardhat compile` to generate your contractABI to interact with.
5. Run `npx hardhat run scripts/deploy.ts --network sepolia` and your contracts will be deployed on Sepolia testnet.
6. Move to backend directory and run `nest start` to start your backend server.

# Usage

1. Once the project is set up, you can start interacting with first smart contract through this endpoint using `POST` method: `http://localhost:3000/nft/mint`
- Headers: `Content-Type: application/json`
- Body: `{"userAddress": "0x000000000000000000000000000000000"}`
In this way your backend will be triggered from that request and it will send a transaction to your smart contract which will mint one NFT to address you specified in Body.

MORE INSTRUCTIONS ARRIVE SOON