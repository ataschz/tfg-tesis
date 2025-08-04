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

  // Get admin address (deployer)
  const [admin] = await ethers.getSigners();
  console.log("👤 Admin address:", admin.address);

  // Save deployment info
  const deploymentInfo = {
    contractAddress,
    adminAddress: admin.address,
    network: "localhost",
    deployedAt: new Date().toISOString(),
    blockNumber: await ethers.provider.getBlockNumber()
  };

  const deploymentPath = path.join(__dirname, "../deployments/localhost.json");
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("📝 Deployment info saved to:", deploymentPath);

  // Create .env.local template
  const envTemplate = `# Database
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# Authentication  
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3001"

# Blockchain Configuration
HARDHAT_RPC_URL="http://127.0.0.1:8545"
ESCROW_MANAGER_ADDRESS="${contractAddress}"
ADMIN_PRIVATE_KEY="${process.env.HARDHAT_PRIVATE_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"}"

# Development accounts (DO NOT use in production):
# Admin Account: ${admin.address}
`;

  const envPath = path.join(__dirname, "../../.env.local.template");
  fs.writeFileSync(envPath, envTemplate);
  console.log("📄 Environment template created at:", envPath);

  console.log("\n🎉 Deployment completed successfully!");
  console.log("\n📋 Next steps:");
  console.log("1. Copy .env.local.template to .env.local");
  console.log("2. Update DATABASE_URL with your PostgreSQL connection");
  console.log("3. Run 'pnpm db:push' to apply database schema changes");
  console.log("4. Start the application with 'pnpm dev'");
  console.log("\n🔗 Contract Address:", contractAddress);
  console.log("🔑 Admin Address:", admin.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });