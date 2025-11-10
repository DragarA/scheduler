import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { createPrismaServiceFake } from '../common/database/prisma/prisma.service.fake';
import { PrismaService } from '../common/database/prisma/prisma.service';
describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, UserRepository, {
        provide: PrismaService,
        useValue: createPrismaServiceFake(),
      }],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
