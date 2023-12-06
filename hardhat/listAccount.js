const { ethers } = require("hardhat");

// Inizializzazione del provider
const provider = ethers.getDefaultProvider("ropsten"); // Cambia con la rete Ethereum che stai utilizzando

// Utilizzo del provider
async function main() {
  const accounts = await provider.listAccounts();
  console.log(accounts);
}

main();
