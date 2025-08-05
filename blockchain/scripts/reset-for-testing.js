const { ethers } = require("hardhat");

async function main() {
  console.log("🧹 Resetting blockchain state for fresh testing...");

  // Stop and restart the node (this clears all state)
  console.log("💡 To completely reset:");
  console.log("1. Stop the blockchain: Ctrl+C in the blockchain terminal");
  console.log("2. Restart with: pnpm blockchain:node");
  console.log("3. Redeploy with: pnpm blockchain:deploy");
  console.log("4. Update ESCROW_MANAGER_ADDRESS in .env.local");
  
  console.log("\n✅ This will give you a fresh blockchain state for testing!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });