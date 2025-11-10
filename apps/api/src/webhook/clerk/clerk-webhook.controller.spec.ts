import { Test, TestingModule } from "@nestjs/testing";
import { ClerkWebhookController } from "./clerk-webhook.controller";
import { ClerkWebhookService } from "./clerk-webhook.service";
import { ConfigModule } from "../../config/config.module";
import { UserModule } from "../../user/user.module";
import { OrganizationModule } from "../../ogranization/organizaiton.module";
import { OrganizationMembershipModule } from "../../ogranization/organization-membership/organization-membership.module";
import { createPrismaServiceFake } from "../../common/database/prisma/prisma.service.fake";
import { PrismaService } from "../../common/database/prisma/prisma.service";

// Mock svix Webhook - must be at top level for hoisting
jest.mock("svix", () => {
  return {
    Webhook: jest.fn().mockImplementation(() => ({
      verify: jest.fn().mockReturnValue({ type: "test", data: {} }),
    })),
  };
});

describe("ClerkWebhookController", () => {
  let controller: ClerkWebhookController;
  let service: ClerkWebhookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClerkWebhookController],
      providers: [
        ClerkWebhookService,
        {
          provide: PrismaService,
          useValue: createPrismaServiceFake(),
        },
      ],
      imports: [
        ConfigModule,
        UserModule,
        OrganizationModule,
        OrganizationMembershipModule,
      ],
    }).compile();

    controller = module.get<ClerkWebhookController>(ClerkWebhookController);
    service = module.get<ClerkWebhookService>(ClerkWebhookService);
    
    // Spy on service methods
    jest.spyOn(service, 'verifyAndParse').mockReturnValue({
      type: "user.created",
      data: { id: "123" },
    });
    jest.spyOn(service, 'handleEvent').mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
  
  it("should handle clerk webhook", async () => {
    const event = {
      type: "user.created",
      data: {
        id: "123",
      },
    };
    const req = {
      headers: {
        "svix-id": "123",
        "svix-timestamp": "123",
        "svix-signature": "123",
      },
    };
    const res = {
      json: jest.fn(),
    };
    await controller.handleClerkWebhook(req as any, res as any);
    expect(res.json).toHaveBeenCalledWith({ received: true });
  });
});
