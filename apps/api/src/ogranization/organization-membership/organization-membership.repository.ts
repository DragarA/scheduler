import { Prisma } from "../../../generated/prisma/client";
import { PrismaService } from "../../common/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OrganizationMembershipRepository {
    constructor(private readonly prisma: PrismaService) {}

    async upsert(organizationMembership: Prisma.OrganizationMembershipCreateInput) {
        return this.prisma.organizationMembership.upsert({
            where: { userId_organizationId: { userId: organizationMembership.userId, organizationId: organizationMembership.organizationId } },
            update: organizationMembership,
            create: organizationMembership,
        });
    }

    async delete(userId: number, organizationId: number) {
        return this.prisma.organizationMembership.delete({
            where: { userId_organizationId: { userId: userId, organizationId: organizationId } },
        });
    }
}