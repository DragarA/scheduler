import { Module } from "@nestjs/common";
import { OrganizationMembershipService } from "./organization-membership.service";
import { OrganizationMembershipRepository } from "./organization-membership.repository";
import { PrismaModule } from "../../common/database/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  providers: [OrganizationMembershipService, OrganizationMembershipRepository],
  exports: [OrganizationMembershipService, OrganizationMembershipRepository],
})
export class OrganizationMembershipModule {}