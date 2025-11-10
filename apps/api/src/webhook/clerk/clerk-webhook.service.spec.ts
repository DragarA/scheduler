import { Test, TestingModule } from '@nestjs/testing';
import { ClerkWebhookService } from './clerk-webhook.service';
import { OrganizationMembershipModule } from '../../ogranization/organization-membership/organization-membership.module';
import { UserModule } from '../../user/user.module';
import { OrganizationModule } from '../../ogranization/organizaiton.module';
import { ConfigModule } from '../../config/config.module';
import { createPrismaServiceFake } from '../../common/database/prisma/prisma.service.fake';
import { PrismaService } from '../../common/database/prisma/prisma.service';

// Mock svix Webhook
jest.mock('svix', () => {
  return {
    Webhook: jest.fn().mockImplementation(() => ({
      verify: jest.fn().mockReturnValue({ type: 'test', data: {} }),
    })),
  };
});

describe('ClerkWebhookService', () => {
  let service: ClerkWebhookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClerkWebhookService, {
        provide: PrismaService,
        useValue: createPrismaServiceFake(),
      }],
      imports: [ConfigModule, UserModule, OrganizationModule, OrganizationMembershipModule],
    }).compile();

    service = module.get<ClerkWebhookService>(ClerkWebhookService);
    
    // Spy on service methods
    jest.spyOn(service, 'handleUserUpsert').mockResolvedValue(undefined);
    jest.spyOn(service, 'handleUserDeleted').mockResolvedValue(undefined);
    jest.spyOn(service, 'handleOrganizationUpsert').mockResolvedValue(undefined);
    jest.spyOn(service, 'handleOrganizationDeleted').mockResolvedValue(undefined);
    jest.spyOn(service, 'handleOrganizationMembershipUpsert').mockResolvedValue(undefined);
    jest.spyOn(service, 'handleOrganizationMembershipDeleted').mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should handle user created event', async () => {
    const event = {
      type: 'user.created',
      data: {
        id: '123',
      },
    };
    await service.handleEvent(event);
    expect(service.handleUserUpsert).toHaveBeenCalledWith(event.data);
  });

  it('should handle user updated event', async () => {
    const event = {
      type: 'user.updated',
      data: {
        id: '123',
      },
    };
    await service.handleEvent(event);
    expect(service.handleUserUpsert).toHaveBeenCalledWith(event.data);
  });

  it('should handle user deleted event', async () => {
    const event = {
      type: 'user.deleted',
      data: {
        id: '123',
      },
    };
    await service.handleEvent(event);
    expect(service.handleUserDeleted).toHaveBeenCalledWith(event.data);
  });

  it('should handle organization created event', async () => {
    const event = {
      type: 'organization.created',
      data: {
        id: '123',
      },
    };
    await service.handleEvent(event);
    expect(service.handleOrganizationUpsert).toHaveBeenCalledWith(event.data);
  });

  it('should handle organization updated event', async () => {
    const event = {
      type: 'organization.updated',
      data: {
        id: '123',
      },
    };
    await service.handleEvent(event);
    expect(service.handleOrganizationUpsert).toHaveBeenCalledWith(event.data);
  });

  it('should handle organization deleted event', async () => {
    const event = {
      type: 'organization.deleted',
      data: {
        id: '123',
      },
    };
    await service.handleEvent(event);
    expect(service.handleOrganizationDeleted).toHaveBeenCalledWith(event.data);
  });

  it('should handle organization membership created event', async () => {
    const event = {
      type: 'organization_membership.created',
      data: {
        organization: { id: '123' },
        public_user_data: { user_id: '123' },
        role: 'org:admin',
      },
    };
    await service.handleEvent(event);
    expect(service.handleOrganizationMembershipUpsert).toHaveBeenCalledWith(event.data);
  });

  it('should handle organization membership updated event', async () => {
    const event = {
      type: 'organization_membership.updated',
      data: {
        organization: { id: '123' },
        public_user_data: { user_id: '123' },
        role: 'org:admin',
      },
    };
    await service.handleEvent(event);
    expect(service.handleOrganizationMembershipUpsert).toHaveBeenCalledWith(event.data);
  });

  it('should handle organization membership deleted event', async () => {
    const event = {
      type: 'organization_membership.deleted',
      data: {
        organization: { id: '123' },
        public_user_data: { user_id: '123' },
      },
    };
    await service.handleEvent(event);
    expect(service.handleOrganizationMembershipDeleted).toHaveBeenCalledWith(event.data);
  });
});
