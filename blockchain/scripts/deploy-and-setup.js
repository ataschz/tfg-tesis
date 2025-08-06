const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Deploying EscrowManager contract...");

  // Get the ContractFactory
  const EscrowManager = await ethers.getContractFactory("EscrowManager");

  // Deploy the contract
  const escrowManager = await EscrowManager.deploy();
  await escrowManager.waitForDeployment();

  const contractAddress = await escrowManager.getAddress();
  
  console.log("✅ EscrowManager deployed to:", contractAddress);

  // Get hardhat accounts with their private keys
  const [account0, account1, account2] = await ethers.getSigners();

  // Account 0 despliega el contrato y mantiene los permisos de admin (sin transferencia)
  console.log("✅ Contract deployed by Account 0 (Admin):", account0.address);
  console.log("✅ Admin rights remain with Account 0");
  
  // Hardhat default private keys (deterministic) - Reorganized roles
  const accounts = [
    {
      role: "Admin/Mediator",
      email: "admin@treto.com", 
      address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      privateKey: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
    },
    {
      role: "Company/Buyer",
      email: "company@retrip.io",
      address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", 
      privateKey: "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
    },
    {
      role: "Freelancer/Contractor",
      email: "freelancer@gmail.com",
      address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      privateKey: "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a"
    }
  ];

  // Save deployment info
  const deploymentInfo = {
    contractAddress,
    adminAddress: account0.address, // Account 0 is the admin
    network: "localhost",
    deployedAt: new Date().toISOString(),
    blockNumber: await ethers.provider.getBlockNumber(),
    accounts
  };

  const deploymentPath = path.join(__dirname, "../deployments/localhost.json");
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("📝 Deployment info saved to:", deploymentPath);

  // Create .env.local template
  const envTemplate = `# Configuración automática generada por deploy-and-setup.js
NEXT_PUBLIC_ESCROW_MANAGER_ADDRESS=${contractAddress}

# URLs de blockchain local
HARDHAT_RPC_URL=http://127.0.0.1:8545
ESCROW_MANAGER_ADDRESS=${contractAddress}

# Database (actualiza con tu URL de PostgreSQL)
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# Authentication  
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3001"

# Admin private key para operaciones del contrato
ADMIN_PRIVATE_KEY=${accounts[0].privateKey}
`;

  const envPath = path.join(__dirname, "../../.env.local.template");
  fs.writeFileSync(envPath, envTemplate);
  console.log("📄 Environment template created at:", envPath);

  // Display comprehensive setup information
  console.log("\n" + "=".repeat(80));
  console.log("🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!");
  console.log("=".repeat(80));
  
  console.log("\n🔗 SMART CONTRACT INFORMATION:");
  console.log(`   Contract Address: ${contractAddress}`);
  console.log(`   Network: Hardhat Local (http://127.0.0.1:8545)`);
  console.log(`   Chain ID: 1337`);
  
  console.log("\n🔧 METAMASK NETWORK CONFIGURATION:");
  console.log("   Network Name: Hardhat Local");
  console.log("   RPC URL: http://127.0.0.1:8545");
  console.log("   Chain ID: 1337");
  console.log("   Currency Symbol: ETH");
  
  console.log("\n👥 DEMO ACCOUNTS CONFIGURATION:");
  console.log("   Import these accounts in different browsers for demo:");
  console.log("");
  
  accounts.forEach((account, index) => {
    console.log(`   📱 Browser ${index + 1} - ${account.role}:`);
    console.log(`      Email: ${account.email}`);
    console.log(`      Address: ${account.address}`);
    console.log(`      Private Key: ${account.privateKey}`);
    console.log("");
  });

  console.log("💡 SETUP INSTRUCTIONS:");
  console.log("   1. Update .env.local with new contract address:");
  console.log(`      NEXT_PUBLIC_ESCROW_MANAGER_ADDRESS=${contractAddress}`);
  console.log("");
  console.log("   2. Configure 3 browsers with MetaMask:");
  console.log("      • Browser 1 (Chrome): Import Account 0 for Admin/Mediator");
  console.log("      • Browser 2 (Safari): Import Account 1 for Company/Buyer");  
  console.log("      • Browser 3 (Firefox): Import Account 2 for Freelancer/Contractor");
  console.log("");
  console.log("   3. Add Hardhat Local network to each MetaMask");
  console.log("   4. Start the application: pnpm dev");
  console.log("");
  
  console.log("🚀 READY FOR DEMO!");
  console.log("   Application: http://localhost:3001");
  console.log("   Each account has 10,000 ETH for testing");
  
  console.log("\n" + "=".repeat(80));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });