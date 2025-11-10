import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma/prisma.service';
import { Prisma, Service } from '../../../generated/prisma/client';

@Injectable()
export class ServiceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(organizationId?: number): Promise<Service[]> {
    return this.prisma.service.findMany({
      where: organizationId ? { organizationId } : undefined,
      include: {
        category: true,
        organization: true,
      },
    });
  }

  async findById(id: number): Promise<Service | null> {
    return this.prisma.service.findUnique({
      where: { id },
      include: {
        category: true,
        organization: true,
      },
    });
  }

  async findByOrganizationId(organizationId: number): Promise<Service[]> {
    return this.prisma.service.findMany({
      where: { organizationId },
      include: {
        category: true,
      },
    });
  }

  async create(data: Prisma.ServiceCreateInput): Promise<Service> {
    return this.prisma.service.create({
      data,
      include: {
        category: true,
        organization: true,
      },
    });
  }

  async update(id: number, data: Prisma.ServiceUpdateInput): Promise<Service> {
    return this.prisma.service.update({
      where: { id },
      data,
      include: {
        category: true,
        organization: true,
      },
    });
  }

  async softDelete(id: number): Promise<Service> {
    return this.prisma.service.update({
      where: { id },
      data: {
        isActive: false,
      },
    });
  }
}

