# Scheduler App Web

A Next.js web application for the Scheduler app, featuring authentication via Clerk, React Query for data fetching, and Tailwind CSS for styling.

## Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Authentication**: Clerk
- **Data Fetching**: TanStack React Query
- **API Client**: Generated SDK from OpenAPI specification

## Prerequisites

- Node.js (v18 or higher)
- pnpm (package manager)
- Clerk account and API keys
- Running API server (see `apps/api/README.md`)

## Installation

1. Install dependencies:
```bash
pnpm install
```

2. Copy `.env.example` to `.env` and fill in your environment variables:
```bash
cp .env.example .env
```

## Environment Variables

Copy `.env.example` to `.env` and fill in your values. See `.env.example` for the required environment variables.

## Running the Application

### Development Mode
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

### Production Build
```bash
pnpm build
pnpm start
```

### Linting
```bash
pnpm lint
```

## Project Structure

```
app/
├── layout.tsx              # Root layout with Clerk provider and React Query setup
├── page.tsx                 # Home page
├── globals.css              # Global styles
├── react-query-provider.tsx # React Query provider configuration
└── test/                    # Test pages

hooks/
└── users/                   # React Query hooks for user data
    ├── get-users-query.ts
    └── get-users-query-auth.ts

lib/
├── api-client.ts            # API client factory function
└── errors.ts               # Error handling utilities

proxy.ts                     # Clerk middleware configuration
```

## Features

### Authentication

The app uses Clerk for authentication. The root layout includes:
- `ClerkProvider` wrapper for authentication context
- Sign in/Sign up buttons for unauthenticated users
- User button for authenticated users

### API Integration

The app uses a generated SDK (`@scheduler/sdk`) from the OpenAPI specification. The API client is configured in `lib/api-client.ts` and automatically includes authentication tokens when available.

Example usage:
```typescript
import { createApiClient } from '@/lib/api-client';

const apiClient = createApiClient(token);
const users = await apiClient.user.userControllerGetUsers();
```

### Data Fetching with React Query

The app uses TanStack React Query for server state management. Custom hooks are available in the `hooks/` directory.

Example:
```typescript
import { useGetUsersQuery } from '@/hooks/users/get-users-query';

function UsersList() {
  const { data, isLoading, error } = useGetUsersQuery();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading users</div>;
  
  return <div>{/* render users */}</div>;
}
```

### Styling

The app uses Tailwind CSS 4 for styling with:
- Dark mode support
- Responsive design utilities
- Custom font configuration (Geist Sans and Geist Mono)

## Development

### Code Formatting

The project uses ESLint for code quality. Run:
```bash
pnpm lint
```

### TypeScript

The project is fully typed with TypeScript. Type checking happens during build:
```bash
pnpm build
```

## API Integration

The web app communicates with the API server. Make sure the API server is running and configured correctly (see `apps/api/README.md`).

The API URL is configured via the `NEXT_PUBLIC_API_URL` environment variable.

## Authentication Flow

1. Users can sign up or sign in using Clerk's authentication UI
2. Once authenticated, Clerk provides a session token
3. The token is automatically included in API requests via the API client
4. Protected routes can use Clerk's `auth()` function to check authentication status

## React Query Configuration

The React Query provider is configured with:
- Default stale time: 30 seconds
- Retry attempts: 1
- React Query Devtools enabled in development

## Contributing

1. Create a feature branch
2. Make your changes
3. Run linting
4. Submit a pull request

## License

UNLICENSED

