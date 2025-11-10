import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../../../generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    const isUnitTest = (global as any).__IS_UNIT_TEST__;
    if (!isUnitTest) {
      await this.$connect();
    }
  }
}
