# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is "getcontract" - a modern contract and payment management platform for remote teams. It's built with Next.js 13 using the App Router pattern and provides functionality for companies and contractors to manage contracts, secure payments, and resolve disputes.

## Development Commands

- `npm run dev` or `pnpm dev` - Start development server
- `npm run build` or `pnpm build` - Build for production  
- `npm run start` or `pnpm start` - Start production server
- `npm run lint` or `pnpm lint` - Run ESLint

Note: This project uses pnpm as the preferred package manager (see packageManager field in package.json).

## Architecture Overview

### App Structure (Next.js App Router)
- `app/(admin)/` - Admin panel routes for dispute management
- `app/(auth)/` - Authentication routes (signin/signup)  
- `app/dashboard/` - Main application dashboard with role-based views
- Route groups use parentheses for organization without affecting URL structure

### Component Organization
- `components/admin/` - Admin-specific components for dispute management
- `components/auth/` - Authentication forms and components
- `components/company/` - Company dashboard and contract management components
- `components/contractor/` - Contractor dashboard and profile components  
- `components/unified/` - Shared components used across user types
- `components/ui/` - Base UI components (shadcn/ui based)

### Data Layer
- `lib/data/` - Mock data files (JSON) for development
- `lib/types/` - TypeScript type definitions
- `lib/actions/` - Next.js Server Actions for data operations
- Uses mock data structure with separate files for companies, contractors, contracts, disputes, and payments

### User Types & Roles
The application supports two primary user types:
1. **Companies** - Create contracts, manage payments, hire contractors
2. **Contractors** - Accept contracts, receive payments, manage profiles

Admin functionality exists for dispute resolution and platform management.

## Key Technologies & Patterns

- **UI Framework**: shadcn/ui components with Radix UI primitives
- **Forms**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with custom component styling
- **State Management**: React Context and Server Actions (no external state library)
- **Rich Text**: TipTap editor for contract content
- **Date Handling**: date-fns library
- **Icons**: Lucide React

## Development Notes

- Uses TypeScript throughout with strict typing
- Components follow the shadcn/ui naming and structure conventions
- Server Actions are used for data mutations instead of API routes
- Mock data is stored in JSON files under `lib/data/`
- The app supports dark/light themes via next-themes
- Mobile-first responsive design approach