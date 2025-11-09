import { Module } from '@nestjs/common';
import { ClerkWebhookService } from './clerk-webhook.service';
import { ClerkWebhookController } from './clerk-webhook.controller';
import { UserModule } from '../../user/user.module';
import { OrganizationModule } from '../../ogranization/organizaiton.module';
import { OrganizationMembershipModule } from '../../ogranization/organization-membership/organization-membership.module';
@Module({
  imports: [UserModule, OrganizationModule, OrganizationMembershipModule],
  controllers: [ClerkWebhookController],
  providers: [ClerkWebhookService],
})
export class ClerkWebhookModule {}
