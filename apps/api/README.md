# Scheduler App API

A NestJS-based REST API for the Scheduler application, featuring user management, authentication via Clerk, and PostgreSQL database integration.

## Tech Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk
- **Logging**: Pino
- **API Documentation**: Swagger/OpenAPI
- **Testing**: Jest

## Prerequisites

- Node.js (v18 or higher)
- pnpm (package manager)
- Docker and Docker Compose (for local database)
- Clerk account and API keys

## Installation

1. Install dependencies:

```bash
pnpm install
```

2. Copy `.env.example` to `.env` and fill in your environment variables:

```bash
cp .env.example .env
```

3. Start the PostgreSQL database:

```bash
docker-compose up -d
```

4. Run database migrations:

```bash
pnpm prisma migrate dev
```

5. Generate Prisma client:

```bash
pnpm prisma generate
```

## Environment Variables

Copy `.env.example` to `.env` and fill in your values. See `.env.example` for the required environment variables.

## Running the Application

### Development Mode

```bash
pnpm dev
```

The API will be available at `http://localhost:3000`

### Production Mode

```bash
pnpm build
pnpm start:prod
```

### Debug Mode

```bash
pnpm start:debug
```

## Database Setup

### Using Docker Compose

The project includes a `docker-compose.yml` file for local PostgreSQL development:

```bash
# Start database
docker-compose up -d

# Stop database
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

The database will be available at:

- **Host**: `localhost`
- **Port**: `5434`
- **Database**: `schedulerDb`
- **User**: `testdbuser`
- **Password**: `testdbpass`

### Database Migrations

```bash
# Create a new migration
pnpm prisma migrate dev --name migration_name

# Apply migrations
pnpm prisma migrate deploy

# Reset database (development only)
pnpm prisma migrate reset
```

## API Documentation

Once the application is running, Swagger documentation is available at:

```
http://localhost:3000/api
```

The OpenAPI specification is also generated as `openapi.json` in the project root:

```bash
pnpm openapi:generate
```

## Project Structure

```
src/
├── app.module.ts          # Root application module
├── main.ts                # Application entry point
├── auth/                  # Authentication guards and decorators
│   ├── clerk-auth.guard.ts
│   └── current-user.decorator.ts
├── common/                # Shared modules and utilities
│   └── database/
│       └── prisma/        # Prisma service
├── config/                # Configuration module
├── health/                # Health check endpoints
├── user/                  # User module
│   ├── user.controller.ts
│   ├── user.service.ts
│   ├── user.repository.ts
│   └── dto/              # Data transfer objects
└── webhook/               # Webhook handlers
    └── clerk/            # Clerk webhook integration
```

## API Endpoints

### Health Check

- `GET /health` - Basic health check
- `GET /health/readiness` - Readiness check (includes database connectivity)

### Users

- `GET /user` - Get all users (public)
- `GET /user/auth` - Get all users (authenticated)

### Webhooks

- `POST /webhooks/clerk` - Clerk webhook endpoint for user synchronization

## Development

### Code Formatting

```bash
pnpm format
```

### Linting

```bash
pnpm lint
```

### Testing

```bash
# Unit tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:cov

# E2E tests
pnpm test:e2e
```

## Authentication

The API uses Clerk for authentication. Protected routes use the `ClerkAuthGuard` which validates Clerk session tokens.

### Setting up Clerk Webhooks

1. Go to your Clerk Dashboard
2. Navigate to Webhooks
3. Add a new endpoint: `https://your-domain.com/webhooks/clerk`
4. Subscribe to user events (user.created, user.updated, user.deleted)
5. Copy the webhook secret to your `.env` file

## Database Models

### User

- `id`: Integer (auto-increment)
- `clerkId`: String (unique, Clerk user ID)
- `email`: String (unique)
- `firstName`: String (optional)
- `lastName`: String (optional)
- `status`: UserStatus enum (ACTIVE, DELETED, LOCKED)
- `createdAt`: DateTime
- `updatedAt`: DateTime

## Logging

The application uses Pino for structured logging. In development mode, logs are formatted with `pino-pretty` for readability. Each request is assigned a unique ID for tracing.

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

UNLICENSED
