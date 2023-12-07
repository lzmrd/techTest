import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from 'dotenv';
import "@nomiclabs/hardhat-ethers";
import "@nomicfoundation/hardhat-verify";


dotenv.config();

const { ETHERSCAN_API_KEY , PRIVATE_KEY,  ALCHEMY_API_KEY } = process.env;
if (!PRIVATE_KEY) {
  throw new Error('Please define the PRIVATE_KEY in your .env file');
}

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  },
  networks: {
    sepolia: {
      url:`https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [PRIVATE_KEY]
    }
  }
};

export default config;
