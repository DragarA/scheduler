import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { createPrismaServiceFake } from '../common/database/prisma/prisma.service.fake';
import { PrismaService } from '../common/database/prisma/prisma.service';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: PrismaService,
          useValue: createPrismaServiceFake(),
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
