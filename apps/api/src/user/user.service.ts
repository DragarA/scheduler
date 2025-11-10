import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { ConfigService } from '@nestjs/config';
import { Prisma, User } from '../../generated/prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async getUsers() {
    return this.userRepository.findAll();
  }

  async findByClerkId(clerkId: string) {
    return this.userRepository.findByClerkId(clerkId);
  }

  async upsertUser(user: Prisma.UserCreateInput) {
    return this.userRepository.upsert(user);
  }

  async softDeleteUserByClerkId(clerkId: string) {
    return this.userRepository.softDelete(clerkId);
  }
}
