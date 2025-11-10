// test/prisma.mock.ts
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaService } from './prisma.service';

export type PrismaServiceFake = DeepMockProxy<PrismaService>;

export const createPrismaServiceFake = (): PrismaServiceFake => {
  return mockDeep<PrismaService>();
};
