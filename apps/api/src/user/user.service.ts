import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { ConfigService } from '@nestjs/config';
import { Prisma, User } from '../../generated/prisma/client';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository, private readonly configService: ConfigService) {}
    async getUsers() {
        return this.userRepository.findAll();
    }

    async upsertUser(user: Prisma.UserCreateInput) {
        return this.userRepository.upsert(user);
    }

    async softDeleteUserByClerkId(clerkId: string) {
        return this.userRepository.softDelete(clerkId);
    }
}
