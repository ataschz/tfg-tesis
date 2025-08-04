const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying EscrowManager contract...");

  // Get the ContractFactory
  const EscrowManager = await ethers.getContractFactory("EscrowManager");

  // Deploy the contract
  const escrowManager = await EscrowManager.deploy();

  // Wait for the contract to be deployed
  await escrowManager.waitForDeployment();

  const address = await escrowManager.getAddress();
  
  console.log("EscrowManager deployed to:", address);
  console.log("Administrator:", await escrowManager.administrator());

  // Save deployment info
  const fs = require('fs');
  const deploymentInfo = {
    address: address,
    network: "localhost",
    deployedAt: new Date().toISOString(),
  };

  fs.writeFileSync(
    './blockchain/deployments/escrow-manager.json',
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("Deployment info saved to ./blockchain/deployments/escrow-manager.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });