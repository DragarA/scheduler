import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TestResDto } from './dto/test-res.dto';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, description: 'The list of users', type: [String] })
    async getUsers(): Promise<TestResDto[]> {
        const result = await this.userService.getUsers();
        return result.map(item => new TestResDto(item));
    }

    @UseGuards(ClerkAuthGuard)
    @Get('/auth')
    async getUsersAuth() {
        const result = await this.userService.getUsers();
        return result.map(item => new TestResDto(item));

    }
}
