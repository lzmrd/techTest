const { ethers } = require('ethers');
const fs = require('fs');

function generateWallet() {
    const wallet = ethers.Wallet.createRandom();
    console.log(`Chiave Privata: ${wallet.privateKey}`);
    console.log(`Indirizzo (Chiave Pubblica): ${wallet.address}`);   
}

generateWallet();

