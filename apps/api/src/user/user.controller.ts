import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserResDto } from './dto/test-res.dto';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'The list of users',
    type: [UserResDto],
  })
  async getUsers(): Promise<UserResDto[]> {
    const result = await this.userService.getUsers();
    return result.map((item) => new UserResDto(item));
  }

  @UseGuards(ClerkAuthGuard)
  @Get('/auth')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'The list of users',
    type: [UserResDto],
  })
  async getUsersAuth(): Promise<UserResDto[]> {
    const result = await this.userService.getUsers();
    return result.map((item) => new UserResDto(item));
  }
}
