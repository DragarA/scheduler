import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/database/prisma/prisma.service';
import { Prisma, User, UserStatus } from '../../generated/prisma/client';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async findByClerkId(clerkId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        clerkId: clerkId,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  async upsert(user: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.upsert({
      where: {
        clerkId: user.clerkId,
      },
      update: user,
      create: user,
    });
  }

  async softDelete(clerkId: string): Promise<User> {
    return this.prisma.user.update({
      where: {
        clerkId: clerkId,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });
  }
}
