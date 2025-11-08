import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository, private readonly configService: ConfigService) {}
    async getUsers() {
        return this.userRepository.findAll();
    }
}
