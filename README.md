# Scheduler App

A full-stack monorepo application for scheduling management, built with NestJS, Next.js, and TypeScript.

## Overview

This monorepo contains:

- **API** (`apps/api`) - NestJS REST API with PostgreSQL, Prisma, and Clerk authentication
- **Web** (`apps/web`) - Next.js frontend application with React Query and Tailwind CSS
- **SDK** (`packages/sdk`) - TypeScript SDK generated from OpenAPI specification
- **Schemas** (`packages/schemas`) - Shared schemas and types

## Tech Stack

### Monorepo Tools
- **Package Manager**: pnpm workspaces
- **Build System**: Turbo
- **Language**: TypeScript

### Backend (API)
- NestJS
- PostgreSQL with Prisma ORM
- Clerk for authentication
- Swagger/OpenAPI documentation
- Pino for logging

### Frontend (Web)
- Next.js 16
- React 19
- Tailwind CSS 4
- TanStack React Query
- Clerk for authentication

## Prerequisites

- Node.js (v18 or higher)
- pnpm (v10.20.0 or higher)
- Docker and Docker Compose (for local database)
- Clerk account and API keys

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Environment Variables

#### API Environment Variables

```bash
cd apps/api
cp .env.example .env
# Edit .env with your values
```

#### Web Environment Variables

```bash
cd apps/web
cp .env.example .env
# Edit .env with your values
```

### 3. Start the Database

```bash
cd apps/api
docker-compose up -d
```

### 4. Run Database Migrations

```bash
pnpm prisma:migrate
```

### 5. Generate Prisma Client

```bash
pnpm prisma:generate
```

### 6. Generate SDK (Optional)

If you've made changes to the API that affect the OpenAPI spec:

```bash
pnpm sdk:generate
```

### 7. Start Development Servers

```bash
pnpm dev
```

This will start both the API and Web applications in parallel:
- API: `http://localhost:3000`
- Web: `http://localhost:3001` (or as configured)

## Available Scripts

### Development

```bash
# Start all apps in development mode
pnpm dev

# Start specific app
cd apps/api && pnpm dev
cd apps/web && pnpm dev
```

### Building

```bash
# Build all apps and packages
pnpm build

# Build specific app
cd apps/api && pnpm build
cd apps/web && pnpm build
```

### Linting

```bash
# Lint all apps
pnpm lint

# Lint specific app
cd apps/api && pnpm lint
cd apps/web && pnpm lint
```

### Database (Prisma)

```bash
# Generate Prisma client
pnpm prisma:generate

# Create a new migration
pnpm prisma:new-migration migration_name

# Run migrations
pnpm prisma:migrate
```

### SDK Generation

```bash
# Generate SDK from OpenAPI spec
pnpm sdk:generate
```

This command:
1. Builds the SDK package
2. Generates TypeScript client from `apps/api/openapi.json`

## Project Structure

```
scheduler-app/
├── apps/
│   ├── api/              # NestJS REST API
│   │   ├── src/          # Source code
│   │   ├── prisma/       # Prisma schema and migrations
│   │   └── docker-compose.yml
│   └── web/              # Next.js frontend
│       ├── app/          # Next.js app directory
│       ├── hooks/        # React Query hooks
│       └── lib/          # Utilities and API client
├── packages/
│   ├── sdk/              # Generated API client SDK
│   └── schemas/          # Shared schemas
├── pnpm-workspace.yaml   # pnpm workspace configuration
├── turbo.json            # Turbo build configuration
└── package.json          # Root package.json with scripts
```

## Development Workflow

### Making API Changes

1. Make changes to the API in `apps/api/src/`
2. The OpenAPI spec is automatically generated when the API runs
3. Regenerate the SDK: `pnpm sdk:generate`
4. The web app will use the updated SDK types

### Making Frontend Changes

1. Make changes to the web app in `apps/web/`
2. Changes are hot-reloaded automatically in development mode
3. Use the generated SDK for type-safe API calls

### Adding a New Package

1. Create a new directory in `packages/`
2. Add a `package.json` with the package name following `@scheduler-app/*` or `@scheduler/*`
3. Install dependencies from the root: `pnpm install`
4. The package will be available to all apps via workspace protocol

## Workspace Packages

### `@scheduler/sdk`

TypeScript SDK generated from the API's OpenAPI specification. Used by the web app for type-safe API calls.

**Usage:**
```typescript
import { SchedulerApiClient } from '@scheduler/sdk';
```

### `@scheduler-app/schemas`

Shared schemas and types used across the monorepo.

## Environment Setup

### Required Environment Variables

#### API (`apps/api/.env`)
- `DATABASE_URL` - PostgreSQL connection string
- `CLERK_PUBLISHABLE_KEY` - Clerk publishable key
- `CLERK_SECRET_KEY` - Clerk secret key
- `CLERK_WEBHOOK_SECRET` - Clerk webhook secret
- `CORS_ORIGIN` - Allowed CORS origins
- `PORT` - API server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

#### Web (`apps/web/.env`)
- `NEXT_PUBLIC_API_URL` - API server URL
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk publishable key
- `CLERK_SECRET_KEY` - Clerk secret key

See individual app READMEs for detailed environment variable documentation.

## Documentation

- [API Documentation](./apps/api/README.md) - Detailed API setup and usage
- [Web Documentation](./apps/web/README.md) - Detailed web app setup and usage

## Testing

### API Tests

```bash
cd apps/api
pnpm test          # Unit tests
pnpm test:watch    # Watch mode
pnpm test:cov      # Coverage
pnpm test:e2e      # E2E tests
```

### Web Tests

```bash
cd apps/web
pnpm test          # Run tests
```

## Deployment

### API Deployment

1. Build the API: `cd apps/api && pnpm build`
2. Run migrations: `pnpm prisma:migrate deploy`
3. Start the server: `pnpm start:prod`

### Web Deployment

1. Build the web app: `cd apps/web && pnpm build`
2. Start the server: `pnpm start`

Or deploy to platforms like Vercel (recommended for Next.js).

## Contributing

1. Create a feature branch
2. Make your changes
3. Run linting and tests
4. Submit a pull request

## License

UNLICENSED

