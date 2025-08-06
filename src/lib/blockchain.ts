import { ethers } from "ethers";

// Configuration
const ESCROW_MANAGER_ADDRESS =
  process.env.ESCROW_MANAGER_ADDRESS ||
  "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
const HARDHAT_RPC_URL = process.env.HARDHAT_RPC_URL || "http://127.0.0.1:8545";
const ADMIN_PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY || "";

// EscrowManager ABI
const EscrowManagerABI = [
  "function createEscrow(string contractId, address buyer, address seller, uint256 endDate, string description)",
  "function deposit(string contractId) payable",
  "function releaseFunds(string contractId)",
  "function refundToBuyer(string contractId)",
  "function releaseToSeller(string contractId)",
  "function setDisputed(string contractId)",
  "function resolveDispute(string contractId, bool favorBuyer)",
  "function getContractInfo(string contractId) view returns (address, address, address, uint256, uint256, uint256, string, uint8, bool)",
  "function doesContractExist(string contractId) view returns (bool)",
  "function getBalance(string contractId) view returns (uint256)",
  "event ContractCreated(string indexed contractId, address indexed buyer, address indexed seller, uint256 endDate)",
  "event FundsDeposited(string indexed contractId, address indexed buyer, uint256 amount, uint256 timestamp)",
  "event FundsReleasedToSeller(string indexed contractId, address indexed buyer, uint256 amount, uint256 timestamp)",
  "event FundsRefundedToBuyer(string indexed contractId, address indexed admin, uint256 amount, uint256 timestamp)",
  "event FundsReleasedByAdmin(string indexed contractId, address indexed admin, address indexed recipient, uint256 amount, uint256 timestamp)",
  "event ContractStateChanged(string indexed contractId, uint8 previousState, uint8 newState, uint256 timestamp)",
];

// Contract state enum (matches Solidity)
enum ContractState {
  AWAITING_PAYMENT = 0,
  AWAITING_DELIVERY = 1,
  COMPLETE = 2,
  DISPUTED = 3,
}

interface ContractInfo {
  buyer: string;
  seller: string;
  administrator: string;
  contractAmount: string;
  startDate: number;
  endDate: number;
  description: string;
  currentState: ContractState;
  isExpired: boolean;
}

class BlockchainService {
  private provider: ethers.JsonRpcProvider;
  private contract: ethers.Contract;
  private adminWallet: ethers.Wallet;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(HARDHAT_RPC_URL);
    this.adminWallet = new ethers.Wallet(ADMIN_PRIVATE_KEY, this.provider);
    this.contract = new ethers.Contract(
      ESCROW_MANAGER_ADDRESS,
      EscrowManagerABI,
      this.adminWallet
    );
  }

  async createEscrow(
    contractId: string,
    buyerAddress: string,
    sellerAddress: string,
    endDate: Date,
    description: string
  ): Promise<void> {
    try {
      // Verificar si el contrato ya existe
      const exists = await this.contract.doesContractExist(contractId);
      if (exists) {
        console.log(`Contract ${contractId} already exists, skipping creation`);
        return; // No es un error, simplemente ya existe
      }

      const endTimestamp = Math.floor(endDate.getTime() / 1000);
      const tx = await this.contract.createEscrow(
        contractId,
        buyerAddress,
        sellerAddress,
        endTimestamp,
        description
      );
      await tx.wait();
    } catch (error) {
      console.error("Error creating escrow:", error);
      throw new Error("Failed to create escrow contract");
    }
  }

  async getContractInfo(contractId: string): Promise<ContractInfo | null> {
    try {
      const exists = await this.contract.doesContractExist(contractId);
      if (!exists) {
        return null;
      }

      const [
        buyer,
        seller,
        administrator,
        contractAmount,
        startDate,
        endDate,
        description,
        currentState,
        isExpired,
      ] = await this.contract.getContractInfo(contractId);

      return {
        buyer,
        seller,
        administrator,
        contractAmount: ethers.formatEther(contractAmount),
        startDate: Number(startDate),
        endDate: Number(endDate),
        description,
        currentState: Number(currentState) as ContractState,
        isExpired,
      };
    } catch (error) {
      console.error("Error getting contract info:", error);
      return null;
    }
  }

  async hasDeposit(contractId: string): Promise<boolean> {
    try {
      const contractInfo = await this.getContractInfo(contractId);
      return (
        contractInfo !== null &&
        contractInfo.currentState === ContractState.AWAITING_DELIVERY &&
        parseFloat(contractInfo.contractAmount) > 0
      );
    } catch (error) {
      console.error("Error checking deposit:", error);
      return false;
    }
  }

  async getContractBalance(contractId: string): Promise<string> {
    try {
      const balance = await this.contract.getBalance(contractId);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error("Error getting contract balance:", error);
      return "0";
    }
  }

  async releaseFunds(contractId: string): Promise<void> {
    try {
      const tx = await this.contract.releaseFunds(contractId);
      await tx.wait();
    } catch (error) {
      console.error("Error releasing funds:", error);
      throw new Error("Failed to release funds");
    }
  }

  async refundToBuyer(contractId: string): Promise<void> {
    try {
      const tx = await this.contract.refundToBuyer(contractId);
      await tx.wait();
    } catch (error) {
      console.error("Error refunding to buyer:", error);
      throw new Error("Failed to refund to buyer");
    }
  }

  async releaseToSeller(contractId: string): Promise<void> {
    try {
      const tx = await this.contract.releaseToSeller(contractId);
      await tx.wait();
    } catch (error) {
      console.error("Error releasing to seller:", error);
      throw new Error("Failed to release to seller");
    }
  }

  async setDisputed(contractId: string): Promise<void> {
    try {
      const tx = await this.contract.setDisputed(contractId);
      await tx.wait();
    } catch (error) {
      console.error("Error setting dispute:", error);
      throw new Error("Failed to set contract as disputed");
    }
  }

  async resolveDispute(contractId: string, favorBuyer: boolean): Promise<void> {
    try {
      const tx = await this.contract.resolveDispute(contractId, favorBuyer);
      await tx.wait();
    } catch (error) {
      console.error("Error resolving dispute:", error);
      throw new Error("Failed to resolve dispute");
    }
  }

  getEscrowManagerAddress(): string {
    return ESCROW_MANAGER_ADDRESS;
  }

  async isValidAddress(address: string): Promise<boolean> {
    try {
      return ethers.isAddress(address);
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const blockchainService = new BlockchainService();

// Export types and enums
export { ContractState, type ContractInfo };
