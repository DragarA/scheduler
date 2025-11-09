import { Module } from "@nestjs/common";
import { OrganizationService } from "./organization.service";
import { PrismaModule } from "../common/database/prisma/prisma.module";
import { OrganizationRepository } from "./organization.repository";

@Module({
  imports: [PrismaModule],
  providers: [OrganizationService, OrganizationRepository],
  exports: [OrganizationService, OrganizationRepository],
})
export class OrganizationModule {}