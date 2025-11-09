import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Webhook } from "svix";
import {
  OrganizationMembershipRole,
  User,
  UserStatus,
} from "../../../generated/prisma/client";
import { UserService } from "../../user/user.service";
import { OrganizationService } from "../../ogranization/organization.service";
import { OrganizationMembershipService } from "../../ogranization/organization-membership/organization-membership.service";
import { ClerkPermission } from "../../common/enums/clerk-permission.enum";

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
      this.configService.get("CLERK_WEBHOOK_SECRET") ?? ""
    );
  }

  verifyAndParse(payload: string, headers: Record<string, string>) {
    const svixId = headers["svix-id"];
    const svixTimestamp = headers["svix-timestamp"];
    const svixSignature = headers["svix-signature"];

    if (!svixId || !svixTimestamp || !svixSignature) {
      this.logger.warn("Missing Svix headers on Clerk webhook");
      throw new UnauthorizedException("Missing Svix headers");
    }

    try {
      const event = this.webhook.verify(payload, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      });

      return event as {
        type: string;
        data: any;
      };
    } catch (err) {
      this.logger.error("Failed to verify Clerk webhook", err as any);
      throw new UnauthorizedException("Invalid webhook signature");
    }
  }

  async handleEvent(event: { type: string; data: any }) {
    this.logger.log(`Received Clerk event: ${event.type}`);

    switch (event.type) {
      case "user.created":
      case "user.updated":
        await this.handleUserUpsert(event.data);
        break;
      case "user.deleted":
        await this.handleUserDeleted(event.data);
        break;
      case "organization.created":
      case "organization.updated":
        await this.handleOrganizationUpsert(event.data);
        break;
      case "organization.deleted":
        await this.handleOrganizationDeleted(event.data);
        break;
      case "organization_membership.created":
      case "organization_membership.updated":
        await this.handleOrganizationMembershipUpsert(event.data);
        break;
      case "organization_membership.deleted":
        await this.handleOrganizationMembershipDeleted(event.data);
        break;
      default:
        this.logger.log(`Unhandled Clerk event type: ${event.type}`);
    }
  }

  async handleUserUpsert(data: any) {
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

  async handleOrganizationUpsert(data: any) {
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

  async handleOrganizationDeleted(data: any) {
    const { id: clerkOrganizationId } = data;

    await this.organizationService.softDelete(clerkOrganizationId);

    this.logger.log(`Organization deleted in Clerk: ${clerkOrganizationId}`);
  }

  async handleOrganizationMembershipUpsert(data: any) {
    const { organization, public_user_data, role } = data;

    const dbRole =
      role === ClerkPermission.ADMIN
        ? OrganizationMembershipRole.ADMIN
        : OrganizationMembershipRole.MEMBER;

    await this.organizationMembershipService.upsertOrganizationMembership({
      userId: public_user_data.id,
      organizationId: organization.id,
      role: dbRole,
    });

    this.logger.log(
      `Organization membership created in Clerk: ${public_user_data.id} (${organization.id})`
    );
  }

  async handleOrganizationMembershipDeleted(data: any) {
    const { organization, public_user_data } = data;

    await this.organizationMembershipService.deleteOrganizationMembership(
      public_user_data.id,
      organization.id
    );

    this.logger.log(
      `Organization membership deleted in Clerk: ${public_user_data.id} (${organization.id})`
    );
  }

  async handleUserDeleted(data: any) {
    const { id: clerkUserId } = data;

    await this.userService.softDeleteUserByClerkId(clerkUserId);

    this.logger.log(`User deleted in Clerk: ${clerkUserId}`);
  }
}
