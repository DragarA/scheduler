import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '../common/database/prisma/prisma.service';

@Controller('health')
export class HealthController {
    constructor(private readonly prisma: PrismaService) {}
    @Get()
    @ApiOperation({ summary: 'Get health status' })
    @ApiResponse({ status: 200, description: 'The health status' })
    async getHealth(): Promise<{ status: string }> {
        return { status: 'ok' };
    }

    @Get('/readiness')
    @ApiOperation({ summary: 'Get readiness status' })
    @ApiResponse({ status: 200, description: 'The readiness status' })
    async getReadiness(): Promise<{ status: string }> {
        await this.prisma.$queryRaw`SELECT 1`;
        return { status: 'ready' };
    }
}
