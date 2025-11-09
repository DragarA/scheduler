import { OrganizationMembershipRole, Prisma } from "../../../generated/prisma/client";
import { OrganizationMembershipRepository } from "./organization-membership.repository";

export class OrganizationMembershipService {
    constructor(private readonly organizationMembershipRepository: OrganizationMembershipRepository) {}

    async upsertOrganizationMembership(organizationMembership: Prisma.OrganizationMembershipCreateInput) {
        return this.organizationMembershipRepository.upsert(organizationMembership);
    }

    async deleteOrganizationMembership(userId: number, organizationId: number) {
        return this.organizationMembershipRepository.delete(userId, organizationId);
    }
}