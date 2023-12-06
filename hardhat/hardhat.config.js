"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("@nomicfoundation/hardhat-toolbox");
const dotenv_1 = __importDefault(require("dotenv"));
require("@nomiclabs/hardhat-ethers");
require("@nomicfoundation/hardhat-verify");
dotenv_1.default.config();
const { ETHERSCAN_API_KEY, PRIVATE_KEY, ALCHEMY_API_KEY } = process.env;
const config = {
    solidity: "0.8.20",
    etherscan: {
        apiKey: ETHERSCAN_API_KEY
    },
    networks: {
        sepolia: {
            url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
            accounts: [PRIVATE_KEY]
        }
    }
};
exports.default = config;
