const { ethers } = require('ethers');
const fs = require('fs');

function generateWallet() {
    const wallet = ethers.Wallet.createRandom();
    console.log(`Chiave Privata: ${wallet.privateKey}`);
    console.log(`Indirizzo (Chiave Pubblica): ${wallet.address}`);
    /* const envVariables = `
    NEW_PRIVATE=${wallet.privateKey}
`; 
    const envFilePath = './.env';

     fs.writeFileSync(envFilePath, envVariables);  */     
}

generateWallet();

