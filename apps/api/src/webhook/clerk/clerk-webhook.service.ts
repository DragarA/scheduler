import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Webhook } from 'svix';
import {
  OrganizationMembershipRole,
  UserStatus,
} from '../../../generated/prisma/client';
import { UserService } from '../../user/user.service';
import { OrganizationService } from '../../ogranization/organization.service';
import { OrganizationMembershipService } from '../../ogranization/organization-membership/organization-membership.service';
import { ClerkUserRoleEnum } from '../../common/enums/clerk-user-role.enum';

interface ClerkUserEventData {
  id: string;
  email_addresses: { id: string; email_address: string }[];
  first_name: string;
  last_name: string;
  locked: boolean;
  primary_email_address_id: string;
}

interface ClerkOrganizationEventData {
  id: string;
  name: string;
  slug: string;
}

interface ClerkUserDeletedEventData {
  id: string;
}

interface ClerkOrganizationDeletedEventData {
  id: string;
}

interface ClerkOrganizationMembershipEventData {
  organization: { id: string };
  public_user_data: { id: string };
  role: ClerkUserRoleEnum;
}

interface ClerkEvent {
  type: string;
  data:
    | ClerkUserEventData
    | ClerkOrganizationEventData
    | ClerkOrganizationMembershipEventData
    | ClerkUserDeletedEventData
    | ClerkOrganizationDeletedEventData
}

@Injectable()
export class ClerkWebhookService {
  private readonly logger = new Logger(ClerkWebhookService.name);
  private readonly webhook: Webhook;

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly organizationService: OrganizationService,
    private readonly organizationMembershipService: OrganizationMembershipService
  ) {
    this.webhook = new Webhook(
      this.configService.get('CLERK_WEBHOOK_SECRET') ?? ''
    );
  }

  verifyAndParse(payload: string, headers: Record<string, string>) {
    const svixId = headers['svix-id'];
    const svixTimestamp = headers['svix-timestamp'];
    const svixSignature = headers['svix-signature'];

    if (!svixId || !svixTimestamp || !svixSignature) {
      this.logger.warn('Missing Svix headers on Clerk webhook');
      throw new UnauthorizedException('Missing Svix headers');
    }

    try {
      const event = this.webhook.verify(payload, {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      });

      return event as {
        type: string;
        data: any;
      };
    } catch (err) {
      this.logger.error('Failed to verify Clerk webhook', err);
      throw new UnauthorizedException('Invalid webhook signature');
    }
  }

  async handleEvent(event: ClerkEvent) {
    this.logger.log(`Received Clerk event: ${event.type}`);

    switch (event.type) {
      case 'user.created':
      case 'user.updated':
        await this.handleUserUpsert(event.data as ClerkUserEventData);
        break;
      case 'user.deleted':
        await this.handleUserDeleted(event.data as ClerkUserDeletedEventData);
        break;
      case 'organization.created':
      case 'organization.updated':
        await this.handleOrganizationUpsert(event.data as ClerkOrganizationEventData);
        break;
      case 'organization.deleted':
        await this.handleOrganizationDeleted(event.data as ClerkOrganizationDeletedEventData);
        break;
      case 'organization_membership.created':
      case 'organization_membership.updated':
        await this.handleOrganizationMembershipUpsert(event.data as ClerkOrganizationMembershipEventData);
        break;
      case 'organization_membership.deleted':
        await this.handleOrganizationMembershipDeleted(event.data as ClerkOrganizationMembershipEventData);
        break;
      default:
        this.logger.log(`Unhandled Clerk event type: ${event.type}`);
    }
  }

  async handleUserUpsert(data: ClerkUserEventData) {
    // Extract the fields you care about from Clerk
    const {
      id: clerkUserId,
      email_addresses,
      first_name,
      last_name,
      locked,
    } = data;

    const primaryEmail =
      email_addresses?.find((e) => e.id === data.primary_email_address_id)
        ?.email_address ?? email_addresses?.[0]?.email_address;

    const user = {
      clerkId: clerkUserId,
      email: primaryEmail,
      firstName: first_name,
      lastName: last_name,
      status: locked ? UserStatus.LOCKED : UserStatus.ACTIVE,
    };

    await this.userService.upsertUser(user);

    this.logger.log(`User created in Clerk: ${clerkUserId} (${primaryEmail})`);
  }

  async handleOrganizationUpsert(data: ClerkOrganizationEventData) {
    // Extract the fields you care about from Clerk
    const { id: clerkOrganizationId, name, slug } = data;

    const organization = {
      clerkId: clerkOrganizationId,
      name: name,
      slug: slug,
    };

    await this.organizationService.upsertOrganization(organization);

    this.logger.log(
      `Organization created in Clerk: ${clerkOrganizationId} (${name})`
    );
  }

  async handleOrganizationDeleted(data: ClerkOrganizationDeletedEventData) {
    const { id: clerkOrganizationId } = data;

    await this.organizationService.softDelete(clerkOrganizationId);

    this.logger.log(`Organization deleted in Clerk: ${clerkOrganizationId}`);
  }

  async handleOrganizationMembershipUpsert(data: ClerkOrganizationMembershipEventData) {
    const { organization, public_user_data, role } = data;

    const dbRole =
      role === ClerkUserRoleEnum.ADMIN
        ? OrganizationMembershipRole.ADMIN
        : OrganizationMembershipRole.MEMBER;

    const user = await this.userService.findByClerkId(public_user_data.id);
    if (!user) {
      this.logger.error(`User not found in Clerk: ${public_user_data.id}`);
      throw new NotFoundException(
        `User not found in Clerk: ${public_user_data.id}`
      );
    }

    const dbOrganization = await this.organizationService.findByClerkId(
      organization.id
    );

    if (!dbOrganization) {
      this.logger.error(`Organization not found in Clerk: ${organization.id}`);
      throw new NotFoundException(
        `Organization not found in Clerk: ${organization.id}`
      );
    }

    await this.organizationMembershipService.upsertOrganizationMembership({
      userId: user.id,
      organizationId: dbOrganization.id,
      role: dbRole,
    });

    this.logger.log(
      `Organization membership created in Clerk: ${public_user_data.id} (${organization.id})`
    );
  }

  async handleOrganizationMembershipDeleted(data: ClerkOrganizationMembershipEventData) {
    const { organization, public_user_data } = data;

    const user = await this.userService.findByClerkId(public_user_data.id);
    if (!user) {
      this.logger.error(`User not found in Clerk: ${public_user_data.id}`);
      throw new NotFoundException(
        `User not found in Clerk: ${public_user_data.id}`
      );
    }

    const dbOrganization = await this.organizationService.findByClerkId(
      organization.id
    );

    if (!dbOrganization) {
      this.logger.error(`Organization not found in Clerk: ${organization.id}`);
      throw new NotFoundException(
        `Organization not found in Clerk: ${organization.id}`
      );
    }

    await this.organizationMembershipService.deleteOrganizationMembership(
      user.id,
      dbOrganization.id
    );

    this.logger.log(
      `Organization membership deleted in Clerk: ${public_user_data.id} (${organization.id})`
    );
  }

  async handleUserDeleted(data: ClerkUserDeletedEventData) {
    const { id: clerkUserId } = data;

    await this.userService.softDeleteUserByClerkId(clerkUserId);

    this.logger.log(`User deleted in Clerk: ${clerkUserId}`);
  }
}
