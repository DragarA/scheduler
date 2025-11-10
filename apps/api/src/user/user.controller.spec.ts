import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { createPrismaServiceFake } from '../common/database/prisma/prisma.service.fake';
import { PrismaService } from '../common/database/prisma/prisma.service';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        UserRepository,
        {
          provide: PrismaService,
          useValue: createPrismaServiceFake(),
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
