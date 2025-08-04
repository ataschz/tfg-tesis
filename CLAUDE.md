# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Development Server
- `pnpm dev` - Start development server on port 3001 (with turbopack)
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run linting

### Database Operations
- `pnpm db:generate` - Generate database migrations
- `pnpm db:migrate` - Run migrations using tsx src/lib/db/migrate.ts
- `pnpm db:push` - Push schema changes to database
- `pnpm db:studio` - Open Drizzle Studio
- `pnpm db:check` - Check migration status
- `pnpm db:pull` - Pull schema from database

### Supabase/Database Sync
- `pnpm db:backup` - Create backup using supabase cli
- `pnpm db:restore` - Restore from backup.sql
- `pnpm db:sync` - Backup and restore in sequence
- `pnpm db:sync-fresh` - Reset database and restore

## Project Architecture

### Tech Stack
- **Frontend**: Next.js 15 with App Router and TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth with Drizzle adapter
- **UI**: Tailwind CSS + shadcn/ui components
- **Forms**: React Hook Form + Zod validation
- **Editor**: TipTap for rich text editing

### Directory Structure
The project uses Next.js App Router with route groups:
- `src/app/(app)/(auth)/` - Authentication pages (sign-in, sign-up)
- `src/app/(app)/(admin)/` - Admin dashboard for dispute management
- `src/app/(app)/(dashboard)/` - Main user dashboards and contract management
- `src/components/` - Organized by feature (admin, company, contractor, ui)
- `src/lib/db/` - Database schema, queries, and migrations
- `src/lib/actions/` - Server actions for data mutations

### Database Schema
Located in `src/lib/db/schema/`:
- Authentication schema in `auth.ts` (users, sessions, accounts)
- Platform schema in `platform.ts` (contracts, payments, disputes, reviews)
- Main export in `index.ts`

### Authentication System
Uses Better Auth with:
- Email/password authentication
- UUID generation for IDs
- Cookie-based sessions with 5-minute cache
- Admin plugin for elevated permissions
- Trusted origins for localhost development

### Key Business Logic
This is an escrow platform for contractor-client relationships with:
- Contract creation and management
- Escrow payment system
- Dispute resolution with mediator role
- Bilateral review system
- Multi-role user support (client, contractor, mediator)

### Component Organization
- `components/ui/` - Base shadcn/ui components
- `components/company/` - Client/company-specific components
- `components/contractor/` - Contractor-specific components
- `components/admin/` - Admin/mediator dispute management
- `components/unified/` - Shared components across roles

### Development Notes
- Uses strict TypeScript configuration
- Path alias `@/*` maps to `./src/*`
- Requires Node.js 22+ and pnpm package manager
- Database migrations are managed through Drizzle Kit
- Development server runs on port 3001 by default

### Testing Credentials (from README)
- Company: company@example.com / test123
- Contractor: contractor@example.com / test123

### Environment Requirements
- `DATABASE_URL` - PostgreSQL connection string
- Better Auth configuration in `src/lib/auth.ts`
- Supabase integration for additional services

## Blockchain Integration ⛓️

### Smart Contract EscrowManager
- **Un solo contrato** gestiona múltiples escrows independientes
- **Mapping de contractId** a datos de escrow individuales
- **Administrador único** para todos los contratos

### Roles:
- **Buyer**: Contratante que deposita fondos ETH
- **Seller**: Contratista que recibe pagos
- **Administrator**: Gestiona disputas y controla flujos de todos los contratos

### Estados por contrato:
- `AWAITING_PAYMENT`: Esperando depósito inicial
- `AWAITING_DELIVERY`: Fondos depositados, trabajo en progreso
- `COMPLETE`: Contrato completado
- `DISPUTED`: En disputa, requiere intervención

### Funciones principales:
- `createEscrow(contractId, buyer, seller, endDate, description)`: Crear nuevo escrow
- `deposit(contractId)`: Buyer deposita fondos ETH
- `releaseFunds(contractId)`: Buyer libera pago voluntariamente  
- `refundToBuyer(contractId)`: Admin devuelve fondos al buyer
- `releaseToSeller(contractId)`: Admin libera fondos al seller
- `setDisputed(contractId)`: Marcar contrato en disputa
- `resolveDispute(contractId, favorBuyer)`: Admin resuelve disputa
- `getContractInfo(contractId)`: Información completa del escrow específico

## Scripts de Desarrollo

### Blockchain:
```bash
pnpm blockchain:node          # Iniciar blockchain local
pnpm blockchain:compile       # Compilar contratos
pnpm blockchain:deploy        # Desplegar EscrowManager
pnpm blockchain:clean         # Limpiar artifacts
# Deployment específico:
npx hardhat run blockchain/scripts/deploy-and-setup.js --network localhost
```

## Flujo de Usuario Implementado ✅

### 1. Creación de Contrato:
1. Usuario crea contrato en DB (estado: 'sent')
2. Sistema redirige a página de depósito `/new/deposit/[contractId]`
3. Sistema despliega escrow en blockchain vía `initializeBlockchainContract()`
4. Muestra instrucciones de depósito al buyer (dirección + monto ETH)
5. Estado cambia a 'awaiting_deposit'

### 2. Depósito ETH:
1. Buyer transfiere ETH manualmente al EscrowManager contract
2. Buyer presiona "Verificar Depósito" en la UI
3. Sistema detecta depósito via API `/api/contracts/[id]/check-deposit`
4. Estado cambia automáticamente a 'pending_acceptance'
5. Seller recibe notificación para aceptar/rechazar

### 3. Aceptación del Seller:
1. Seller accede a página `/accept/[contractId]`
2. Ve detalles completos del contrato
3. Ingresa su wallet address para recibir pagos
4. **Acepta**: API `/api/contracts/[id]/accept` → estado 'accepted' 
5. **Rechaza**: API `/api/contracts/[id]/reject` → `refundToBuyer()` → estado 'rejected'

### 4. Gestión Activa de Contratos:
- **Buyer**: `/api/contracts/[id]/release-funds` → `releaseFunds()` → paga al seller
- **Participantes**: `/api/contracts/[id]/dispute` → `setDisputed()` → estado 'in_dispute'
- **Admin**: `/api/contracts/[id]/resolve-dispute` → `resolveDispute(favorBuyer)` → libera a winner

### 5. Estados del Contrato:
- `sent` → `awaiting_deposit` → `pending_acceptance` → `accepted` → `completed`
- Alternativos: `rejected`, `cancelled`, `in_dispute`

## Archivos Implementados ✅

### Backend/Blockchain:
- `src/lib/blockchain.ts` - Servicio de integración con EscrowManager
- `src/lib/actions/contracts.ts` - Actions con `initializeBlockchainContract()`
- `blockchain/contracts/EscrowManager.sol` - Smart contract multi-escrow
- `blockchain/scripts/deploy-and-setup.js` - Deploy automatizado

### Frontend:
- `src/app/(app)/new/deposit/[contractId]/page.tsx` - Página de depósito
- `src/app/(app)/accept/[contractId]/page.tsx` - Página de aceptación seller

### APIs:
- `src/app/api/contracts/[contractId]/check-deposit/route.ts`
- `src/app/api/contracts/[contractId]/accept/route.ts`
- `src/app/api/contracts/[contractId]/reject/route.ts`
- `src/app/api/contracts/[contractId]/release-funds/route.ts`
- `src/app/api/contracts/[contractId]/dispute/route.ts`
- `src/app/api/contracts/[contractId]/resolve-dispute/route.ts`

### Schema Updates:
- `src/lib/db/schema/auth.ts` - Campo `walletAddress` en users
- `src/lib/db/schema/platform.ts` - Estados blockchain + `blockchainContractId`

## Setup Instructions

1. **Configurar Database**: Actualizar `DATABASE_URL` en `.env.local`
2. **Aplicar Schema**: `pnpm db:push`
3. **Iniciar Blockchain**: `pnpm blockchain:node` (en terminal separada)
4. **Deploy Contract**: `npx hardhat run blockchain/scripts/deploy-and-setup.js --network localhost`
5. **Configurar .env.local**: Copiar address del contrato desplegado
6. **Start App**: `pnpm dev`

**El sistema está listo para usar ETH nativo con flujo completo de depósito y aceptación!** 🚀