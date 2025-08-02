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