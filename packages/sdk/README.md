# @scheduler/sdk

TypeScript SDK for the Scheduler App API, automatically generated from the OpenAPI specification.

## Overview

This package provides a type-safe TypeScript client for interacting with the Scheduler App API. It is automatically generated from the API's OpenAPI specification using `openapi-typescript-codegen`.

## Installation

This package is part of the monorepo workspace and is automatically available to other packages. If you need to install it separately:

```bash
pnpm add @scheduler/sdk
```

## Usage

### Basic Usage

```typescript
import { SchedulerApiClient } from '@scheduler/sdk';

const client = new SchedulerApiClient({
  BASE: 'http://localhost:3000',
  TOKEN: async () => 'your-auth-token',
});

// Use the client
const users = await client.user.userControllerGetUsers();
```

### With Authentication Token

```typescript
import { SchedulerApiClient } from '@scheduler/sdk';

function createApiClient(token?: string | null) {
  return new SchedulerApiClient({
    BASE: process.env.NEXT_PUBLIC_API_URL!,
    TOKEN: token ? async () => token : undefined,
  });
}

const client = createApiClient(authToken);
const users = await client.user.userControllerGetUsersAuth();
```

### Available Services

The SDK provides services organized by API resource:

- `client.app` - App service endpoints
- `client.health` - Health check endpoints
- `client.user` - User management endpoints

### Type Exports

The SDK also exports TypeScript types for request/response models:

```typescript
import type { UserResDto } from '@scheduler/sdk';

function handleUser(user: UserResDto) {
  // Type-safe user object
}
```

## Regenerating the SDK

The SDK is generated from the OpenAPI specification located at `apps/api/openapi.json`.

### From the Root

```bash
pnpm sdk:generate
```

This command:

1. Builds the SDK package
2. Generates the TypeScript client from the OpenAPI spec

### Manual Generation

```bash
cd packages/sdk
pnpm generate
```

The generation script uses `openapi-typescript-codegen` to create the client from `../../apps/api/openapi.json`.

## Development

### Building

```bash
pnpm build
```

This compiles TypeScript source files to the `dist/` directory.

### Cleaning

```bash
pnpm clean
```

Removes both the `dist/` directory and the `src/generated/` directory.

## Generated Files

⚠️ **Important**: All files in `src/generated/` are automatically generated and should not be edited manually. Any changes will be overwritten when the SDK is regenerated.

### Structure

```
src/generated/
├── core/              # Core HTTP request handling
├── models/            # TypeScript types for API models
├── services/          # Service classes for each API resource
├── SchedulerApiClient.ts  # Main client class
└── index.ts           # Public exports
```

## Configuration

The SDK uses the following configuration options:

- `BASE` - Base URL of the API server
- `VERSION` - API version
- `TOKEN` - Authentication token provider (function that returns a token)
- `WITH_CREDENTIALS` - Whether to include credentials in requests
- `CREDENTIALS` - Credentials mode ('include', 'omit', 'same-origin')
- `HEADERS` - Additional headers to include in requests

## Notes

- The SDK is generated from the OpenAPI spec, which is automatically created when the API server runs
- Always regenerate the SDK after making changes to the API that affect the OpenAPI specification
- The generated code follows the OpenAPI specification structure, so service and method names match the API endpoints

## License

UNLICENSED
