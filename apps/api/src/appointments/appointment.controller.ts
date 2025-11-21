import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { AppointmentService } from './appointment.service';
import { AppointmentResponseDto } from './dto/appointment-response.dto';
import {
  UpdateAppointmentStatusDtoClass,
  updateAppointmentStatusSchema,
} from './dto/update-appointment-status.dto';
import type {UpdateAppointmentStatusDto } from './dto/update-appointment-status.dto';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';
import { CurrentAuth } from '../auth/current-user.decorator';
import type { ClerkAuth } from '../auth/current-user.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { UserService } from '../user/user.service';

@ApiTags('appointments')
@Controller('appointments')
@UseGuards(ClerkAuthGuard)
export class AppointmentController {
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly userService: UserService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all appointments for the logged-in user (as provider)',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search by customer name',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW'],
    description: 'Filter by appointment status (can be specified multiple times)',
    isArray: true,
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['start', 'customer', 'status'],
    description: 'Sort by field',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Sort order',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of appointments',
    schema: {
      type: 'object',
      properties: {
        data: { type: 'array', items: { $ref: '#/components/schemas/AppointmentResponseDto' } },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
        totalPages: { type: 'number' },
      },
    },
  })
  async findAll(
    @CurrentAuth() auth: ClerkAuth,
    @Query('search') search?: string,
    @Query('status') status?: string | string[],
    @Query('sortBy') sortBy?: 'start' | 'customer' | 'status',
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    // Get the internal user ID from Clerk ID
    const user = await this.userService.findByClerkId(auth.userId!);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Convert status to array if it's a single value
    const statusArray = status
      ? (Array.isArray(status) ? status : [status]) as any[]
      : undefined;

    const result = await this.appointmentService.findByProviderId({
      providerId: user.id,
      search,
      status: statusArray,
      sortBy: sortBy ?? 'start',
      sortOrder: sortOrder ?? 'asc',
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
    });

    return {
      ...result,
      data: result.data.map((item) => new AppointmentResponseDto(item)),
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get appointment by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Appointment ID' })
  @ApiResponse({
    status: 200,
    description: 'Appointment details',
    type: AppointmentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<AppointmentResponseDto> {
    const result = await this.appointmentService.findById(id);
    return new AppointmentResponseDto(result);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update appointment status' })
  @ApiParam({ name: 'id', type: Number, description: 'Appointment ID' })
  @ApiBody({ type: UpdateAppointmentStatusDtoClass })
  @ApiResponse({
    status: 200,
    description: 'Appointment status updated successfully',
    type: AppointmentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  @ApiResponse({ status: 400, description: 'Invalid status transition' })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateAppointmentStatusSchema))
    updateStatusDto: UpdateAppointmentStatusDto,
  ): Promise<AppointmentResponseDto> {
    const result = await this.appointmentService.updateStatus(
      id,
      updateStatusDto,
    );
    return new AppointmentResponseDto(result);
  }
}
