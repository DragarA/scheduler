import { Prisma } from '../../generated/prisma/client';
import { OrganizationRepository } from './organization.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly organizationRepository: OrganizationRepository
  ) {}

  async upsertOrganization(organization: Prisma.OrganizationCreateInput) {
    return this.organizationRepository.upsert(organization);
  }

  async findByClerkId(clerkId: string) {
    return this.organizationRepository.findByClerkId(clerkId);
  }

  async findAll() {
    return this.organizationRepository.findAll();
  }

  async findById(id: number) {
    return this.organizationRepository.findById(id);
  }

  async softDelete(clerkId: string) {
    return this.organizationRepository.softDelete(clerkId);
  }
}
