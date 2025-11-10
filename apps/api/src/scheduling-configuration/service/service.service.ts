import { Injectable, NotFoundException } from '@nestjs/common';
import { ServiceRepository } from './service.repository';
import { Prisma } from '../../../generated/prisma/client';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServiceService {
  constructor(private readonly serviceRepository: ServiceRepository) {}

  async findAll(organizationId?: number) {
    return this.serviceRepository.findAll(organizationId);
  }

  async findById(id: number) {
    const service = await this.serviceRepository.findById(id);
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return service;
  }

  async findByOrganizationId(organizationId: number) {
    return this.serviceRepository.findByOrganizationId(organizationId);
  }

  async create(createServiceDto: CreateServiceDto) {
    const data: Prisma.ServiceCreateInput = {
      name: createServiceDto.name,
      durationMinutes: createServiceDto.durationMinutes,
      paddingBeforeMinutes: createServiceDto.paddingBeforeMinutes ?? 0,
      paddingAfterMinutes: createServiceDto.paddingAfterMinutes ?? 0,
      isActive: createServiceDto.isActive ?? true,
      organization: {
        connect: { id: createServiceDto.organizationId },
      },
      ...(createServiceDto.categoryId && {
        category: {
          connect: { id: createServiceDto.categoryId },
        },
      }),
      ...(createServiceDto.description && { description: createServiceDto.description }),
      ...(createServiceDto.priceCents !== undefined && { priceCents: createServiceDto.priceCents }),
      ...(createServiceDto.currency && { currency: createServiceDto.currency }),
    };

    return this.serviceRepository.create(data);
  }

  async update(id: number, updateServiceDto: UpdateServiceDto) {
    await this.findById(id); // This will throw NotFoundException if service doesn't exist

    return this.serviceRepository.update(id, updateServiceDto);
  }

  async softDelete(id: number) {
    await this.findById(id); // This will throw NotFoundException if service doesn't exist
    return this.serviceRepository.softDelete(id);
  }
}

