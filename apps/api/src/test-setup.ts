// Mock Prisma client to avoid import issues in tests
jest.mock('../../generated/prisma/client', () => {
  const mockPrismaClient = {
    service: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      upsert: jest.fn(),
    },
    organization: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      upsert: jest.fn(),
    },
    organizationMembership: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      upsert: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    $queryRaw: jest.fn(),
  };

  return {
    PrismaClient: jest.fn().mockImplementation(() => mockPrismaClient),
    ...mockPrismaClient,
  };
});

// Mock internal Prisma modules to avoid import errors
jest.mock('../../generated/prisma/internal/class.js', () => ({}));
jest.mock('../../generated/prisma/internal/prismaNamespace.js', () => ({}));
jest.mock('../../generated/prisma/enums.js', () => ({}));

// Note: PrismaServiceFake will be automatically provided via test-utils.ts
// when using createTestModule() helper, or manually in test files.
// This allows tests to have full control over the PrismaService mock.

