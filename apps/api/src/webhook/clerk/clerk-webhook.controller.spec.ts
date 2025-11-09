import { Test, TestingModule } from '@nestjs/testing';
import { ClerkWebhookController } from './clerk-webhook.controller';
import { ClerkWebhookService } from './clerk-webhook.service';
import { ConfigModule } from '../../config/config.module';
import { UserModule } from '../../user/user.module';
import { OrganizationModule } from '../../ogranization/organizaiton.module';
import { OrganizationMembershipModule } from '../../ogranization/organization-membership/organization-membership.module';
import { Request } from 'express';
import { UnauthorizedException } from '@nestjs/common';
describe('ClerkWebhookController', () => {
  let controller: ClerkWebhookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClerkWebhookController],
      providers: [ClerkWebhookService],
      imports: [ConfigModule, UserModule, OrganizationModule, OrganizationMembershipModule],
    }).compile();

    controller = module.get<ClerkWebhookController>(ClerkWebhookController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should handle clerk webhook', async () => {
    const event = {
      type: 'user.created',
      data: {
        id: '123',
      },
    };
    const req = {
      headers: {
        'svix-id': '123',
        'svix-timestamp': '123',
        'svix-signature': '123',
      },
    };
    const res = {
      json: jest.fn(),
    };
    await controller.handleClerkWebhook(req as any, res as any);
    expect(res.json).toHaveBeenCalledWith({ received: true });
  });
});
