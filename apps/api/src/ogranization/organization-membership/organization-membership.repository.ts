import {
  OrganizationMembershipRole,
  Prisma,
} from '../../../generated/prisma/client';
import { PrismaService } from '../../common/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

export interface IOrganizationMembershipCreateInput {
  userId: number;
  organizationId: number;
  role: OrganizationMembershipRole;
}

@Injectable()
export class OrganizationMembershipRepository {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(organizationMembership: IOrganizationMembershipCreateInput) {
    return this.prisma.organizationMembership.upsert({
      where: {
        userId_organizationId: {
          userId: organizationMembership.userId,
          organizationId: organizationMembership.organizationId,
        },
      },
      update: {
        role: organizationMembership.role,
      },
      create: {
        userId: organizationMembership.userId,
        organizationId: organizationMembership.organizationId,
        role: organizationMembership.role,
      },
    });
  }

  async delete(userId: number, organizationId: number) {
    return this.prisma.organizationMembership.delete({
      where: {
        userId_organizationId: {
          userId: userId,
          organizationId: organizationId,
        },
      },
    });
  }
}
