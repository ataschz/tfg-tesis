<div align="center">
  <img src="public/trato.svg" alt="Trato Logo" width="200" />
</div>

# Trato - Escrow Platform with Blockchain Integration

**Trato** is a modern escrow platform that facilitates secure transactions between freelancers and companies, built with blockchain technology for transparent and trustless payments.

## 🌟 Key Features

- **🔒 Blockchain Escrow**: ETH-based smart contracts for secure fund management
- **👥 Multi-Role System**: Companies, Freelancers, and Admin/Mediators
- **⚖️ Dispute Resolution**: Integrated mediation system with MetaMask integration
- **💰 ETH Payments**: Native Ethereum payments with MetaMask integration
- **📱 Modern UI**: Clean and intuitive interface built with Next.js and TailwindCSS
- **🔐 Secure Authentication**: Better Auth with role-based access control

## 🛠 Tech Stack

### Frontend & Backend

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS + Shadcn UI
- **Forms**: React Hook Form + Zod validation
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth

### Blockchain

- **Smart Contracts**: Solidity
- **Development**: Hardhat
- **Integration**: Ethers.js + MetaMask
- **Network**: Hardhat Local (for development)

## 🚀 Quick Start for Demo

### Prerequisites

- Node.js 22+
- pnpm
- MetaMask browser extension

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Setup Environment

```bash
# Copy environment template
cp .env.example .env.local

# Update .env.local with your database URL
DATABASE_URL="your_postgresql_connection_string"
```

### 3. Setup Database

```bash
# Push schema to database
pnpm db:push

# Optional: Seed with test data
pnpm db:seed
```

### 4. Start Blockchain & Deploy Contract

**Terminal 1 - Start Blockchain:**

```bash
# This will auto-clean and start fresh Hardhat blockchain on port 8545
# All accounts will have 10,000 ETH each time
pnpm blockchain:node
```

**Terminal 2 - Deploy Contract:**

```bash
# Deploy EscrowManager contract and get address
pnpm blockchain:deploy
```

**Copy the contract address from the output and update your `.env.local`:**

```bash
NEXT_PUBLIC_ESCROW_MANAGER_ADDRESS=0xYourContractAddressHere
```

### 5. Start Application

```bash
# Start Next.js development server
pnpm dev
```

Your app will be available at **http://localhost:3001**

## 🎭 Demo Setup Guide

### 🔧 MetaMask Configuration

#### Add Hardhat Local Network:

1. Open MetaMask → Networks → Add Network Manually
2. **Network Name**: `Hardhat Local`
3. **RPC URL**: `http://127.0.0.1:8545`
4. **Chain ID**: `1337`
5. **Currency Symbol**: `ETH`

### 👥 Test Accounts & Private Keys

Import these accounts in **3 different browsers** for the full demo:

#### 🏢 Account 0 - Company/Buyer

- **Address**: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
- **Private Key**: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
- **Email**: `ata@retrip.io`
- **Role**: Creates contracts and deposits ETH

#### 👨‍💻 Account 1 - Freelancer/Contractor

- **Address**: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`
- **Private Key**: `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d`
- **Email**: `gahs94@gmail.com`
- **Role**: Receives contracts and completes work

#### ⚖️ Account 2 - Admin/Mediator

- **Address**: `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC`
- **Private Key**: `0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a`
- **Email**: `ata@trato.com`
- **Role**: Resolves disputes and mediates conflicts

### 📱 Multi-Browser Demo Setup

**Browser 1 (Chrome) - Company:**

1. Install MetaMask → Add Hardhat Local network
2. Import Account 0 using private key
3. Go to http://localhost:3001 → Sign in with `ata@retrip.io`

**Browser 2 (Safari) - Freelancer:**

1. Install MetaMask → Add Hardhat Local network
2. Import Account 1 using private key
3. Go to http://localhost:3001 → Sign in with `gahs94@gmail.com`

**Browser 3 (Firefox) - Admin:**

1. Install MetaMask → Add Hardhat Local network
2. Import Account 2 using private key
3. Go to http://localhost:3001 → Sign in with `ata@trato.com`

## 🎯 Demo Flow

### 1. 🏢 Company Creates Contract

1. **Browser 1 (Company)**: Login → Dashboard → "New Contract"
2. Fill contract details (amount in ETH, dates, description)
3. Select freelancer from list
4. Create contract → Redirected to deposit page
5. **MetaMask**: Connect wallet → Deposit ETH to escrow
6. Contract status: `awaiting_deposit` → `pending_acceptance`

### 2. 👨‍💻 Freelancer Accepts Contract

1. **Browser 2 (Freelancer)**: Check dashboard for new contract
2. Click "View Details" → See contract information
3. Click "Accept Contract" → Provide wallet address
4. **MetaMask**: Sign acceptance transaction
5. Contract status: `pending_acceptance` → `accepted`

### 3. 💰 Payment Release Options

#### Option A: Normal Completion

1. **Browser 1 (Company)**: Go to contract details
2. When satisfied with work: "Release Funds" button
3. **MetaMask**: Sign transaction to release funds to freelancer
4. Contract status: `accepted` → `completed`

#### Option B: Dispute Resolution

1. **Either party**: Click "Initiate Dispute"
2. Provide reason for dispute
3. Contract status: `accepted` → `in_dispute`
4. **Browser 3 (Admin)**: Login → Admin Dashboard → View dispute
5. Review evidence and decide winner
6. **MetaMask**: Sign dispute resolution transaction
7. Funds automatically released to winner

## 📋 Available Scripts

```bash
# Development
pnpm dev                 # Start Next.js development server
pnpm build              # Build for production
pnpm start              # Start production server

# Database
pnpm db:push            # Push schema changes to database
pnpm db:studio          # Open Drizzle Studio
pnpm db:seed            # Seed database with test data

# Blockchain
pnpm blockchain:node    # Start Hardhat local blockchain
pnpm blockchain:deploy  # Deploy contracts to local network
pnpm blockchain:compile # Compile smart contracts
pnpm blockchain:clean   # Clean build artifacts

# Linting & Type Checking
pnpm lint               # Run ESLint
pnpm typecheck          # Run TypeScript checks
```

## 🔄 Restarting Demo

When you restart the blockchain (`pnpm blockchain:node`):

✅ **Stays the same:**

- Private keys and wallet addresses
- Account order (0, 1, 2...)

🔄 **Gets reset:**

- All accounts return to 10,000 ETH
- Contract deployments are cleared
- Transaction history is wiped clean

**To restart completely:**

1. Stop current blockchain (Ctrl+C)
2. `pnpm blockchain:node` (in terminal 1)
3. `pnpm blockchain:deploy` (in terminal 2)
4. Update `.env.local` with new contract address
5. Restart Next.js: `pnpm dev`

## 🗃️ Database Schema

### Key Tables

- **users**: Authentication and basic user info
- **user_profiles**: Extended profile information per role
- **contracts**: Contract details and status
- **payments**: Payment tracking and escrow status
- **disputes**: Dispute management and resolution
- **reviews**: Bilateral review system

### Contract Status Flow

```
sent → awaiting_deposit → pending_acceptance → accepted → completed
                                           ↘ in_dispute → resolved
                                           ↘ rejected
```

## 🔐 Security Features

- **Smart Contract Escrow**: Funds locked in blockchain until resolution
- **Role-Based Access**: Different permissions for companies, freelancers, and admins
- **MetaMask Integration**: Secure wallet-based transactions
- **Dispute Resolution**: Fair mediation system with blockchain enforcement
- **Session Management**: Secure authentication with Better Auth

## 📚 Smart Contract Details

### EscrowManager.sol

- **Multi-contract management**: One contract handles multiple escrows
- **Role-based permissions**: Buyer, Seller, Administrator functions
- **State management**: Tracks contract progression and fund status
- **Dispute resolution**: Admin can resolve disputes and release funds
- **Event logging**: Complete transaction history on-chain

### Key Functions

- `createEscrow()`: Initialize new escrow contract
- `deposit()`: Buyer deposits ETH into escrow
- `releaseFunds()`: Buyer releases payment to seller
- `setDisputed()`: Mark contract as disputed
- `resolveDispute()`: Admin resolves dispute and distributes funds

## 🛠️ Development Notes

- **Port Configuration**: Next.js runs on port 3001, Hardhat on 8545
- **Hot Reload**: Both frontend and blockchain support development workflows
- **TypeScript**: Fully typed including smart contract interactions
- **Error Handling**: Comprehensive error states and user feedback
- **Responsive Design**: Works across desktop and mobile devices

## 🐛 Troubleshooting

### Blockchain Issues

```bash
# If blockchain won't start
lsof -ti:8545 | xargs kill -9
pnpm blockchain:node

# If contract deployment fails
pnpm blockchain:clean
pnpm blockchain:compile
pnpm blockchain:deploy
```

### MetaMask Issues

- **Reset Account**: MetaMask Settings → Advanced → Reset Account
- **Network Issues**: Ensure Chain ID is exactly 1337
- **Gas Issues**: Make sure you have sufficient ETH (10,000 per account)

### Database Issues

```bash
# Reset database schema
pnpm db:push --force-reset

# Check connection
pnpm db:studio
```

## 📄 License

This project is for demonstration purposes and educational use.

---

**🎉 Ready for Demo!** Follow the setup guide above and you'll have a fully functional blockchain-based escrow platform running locally.
