import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ServiceService } from './service.service';
import { createServiceSchema } from './dto/create-service.dto';
import { updateServiceSchema } from './dto/update-service.dto';
import type { CreateServiceDto } from './dto/create-service.dto';
import type { UpdateServiceDto } from './dto/update-service.dto';
import { ServiceResponseDto } from './dto/service-response.dto';
import { ClerkAuthGuard } from '../../auth/clerk-auth.guard';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';

@ApiTags('services')
@Controller('services')
@UseGuards(ClerkAuthGuard)
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Get()
  @ApiOperation({ summary: 'Get all services' })
  @ApiQuery({ name: 'organizationId', required: false, type: Number, description: 'Filter by organization ID' })
  @ApiResponse({ status: 200, description: 'List of services', type: [ServiceResponseDto] })
  async findAll(@Query('organizationId') organizationId?: string): Promise<ServiceResponseDto[]> {
    const orgId = organizationId ? parseInt(organizationId, 10) : undefined;
    const result = await this.serviceService.findAll(orgId);
    return result.map(item => new ServiceResponseDto(item));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get service by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Service ID' })
  @ApiResponse({ status: 200, description: 'Service details', type: ServiceResponseDto })
  @ApiResponse({ status: 404, description: 'Service not found' })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<ServiceResponseDto> {
    const result = await this.serviceService.findById(id);
    return new ServiceResponseDto(result);
  }

  @Get('organization/:organizationId')
  @ApiOperation({ summary: 'Get all services for an organization' })
  @ApiParam({ name: 'organizationId', type: Number, description: 'Organization ID' })
  @ApiResponse({ status: 200, description: 'List of services for the organization', type: [ServiceResponseDto] })
  async findByOrganizationId(@Param('organizationId', ParseIntPipe) organizationId: number): Promise<ServiceResponseDto[]> {
    const result = await this.serviceService.findByOrganizationId(organizationId);
    return result.map(item => new ServiceResponseDto(item));
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createServiceSchema))
  @ApiOperation({ summary: 'Create a new service' })
  @ApiResponse({ status: 201, description: 'Service created successfully', type: ServiceResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createServiceDto: CreateServiceDto): Promise<ServiceResponseDto> {
    const result = await this.serviceService.create(createServiceDto);
    return new ServiceResponseDto(result);
  }

  @Put(':id')
  @UsePipes(new ZodValidationPipe(updateServiceSchema))
  @ApiOperation({ summary: 'Update a service' })
  @ApiParam({ name: 'id', type: Number, description: 'Service ID' })
  @ApiResponse({ status: 200, description: 'Service updated successfully', type: ServiceResponseDto })
  @ApiResponse({ status: 404, description: 'Service not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateServiceDto: UpdateServiceDto,
  ): Promise<ServiceResponseDto> {
    const result = await this.serviceService.update(id, updateServiceDto);
    return new ServiceResponseDto(result);
  }

  @Delete(':id/soft')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft delete a service (deactivate)' })
  @ApiParam({ name: 'id', type: Number, description: 'Service ID' })
  @ApiResponse({ status: 200, description: 'Service deactivated successfully', type: ServiceResponseDto })
  @ApiResponse({ status: 404, description: 'Service not found' })
  async softDelete(@Param('id', ParseIntPipe) id: number): Promise<ServiceResponseDto> {
    const result = await this.serviceService.softDelete(id);
    return new ServiceResponseDto(result);
  }
}

