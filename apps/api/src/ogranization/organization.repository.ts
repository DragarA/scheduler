import { PrismaService } from '../common/database/prisma/prisma.service';
import { OrganizationStatus, Prisma } from '../../generated/prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrganizationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(organization: Prisma.OrganizationCreateInput) {
    return this.prisma.organization.upsert({
      where: { clerkId: organization.clerkId },
      update: organization,
      create: organization,
    });
  }

  async findByClerkId(clerkId: string) {
    return this.prisma.organization.findUnique({
      where: { clerkId: clerkId },
    });
  }

  async findAll() {
    return this.prisma.organization.findMany();
  }

  async findById(id: number) {
    return this.prisma.organization.findUnique({
      where: { id: id },
    });
  }

  async softDelete(clerkId: string) {
    return this.prisma.organization.update({
      where: { clerkId: clerkId },
      data: {
        status: OrganizationStatus.DELETED,
      },
    });
  }
}
