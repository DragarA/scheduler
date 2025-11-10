import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';
import { ServiceResponseDto } from './dto/service-response.dto';

// Mock Service type to avoid Prisma import issues in tests
type Service = {
  id: number;
  organizationId: number;
  categoryId: number | null;
  name: string;
  description: string | null;
  durationMinutes: number;
  paddingBeforeMinutes: number;
  paddingAfterMinutes: number;
  priceCents: number | null;
  currency: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

describe('ServiceController', () => {
  let controller: ServiceController;
  let service: ServiceService;

  const mockService: Service = {
    id: 1,
    organizationId: 1,
    categoryId: null,
    name: 'Test Service',
    description: 'Test Description',
    durationMinutes: 60,
    paddingBeforeMinutes: 0,
    paddingAfterMinutes: 0,
    priceCents: 5000,
    currency: 'EUR',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockServiceService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByOrganizationId: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceController],
      providers: [
        {
          provide: ServiceService,
          useValue: mockServiceService,
        },
      ],
    }).compile();

    controller = module.get<ServiceController>(ServiceController);
    service = module.get<ServiceService>(ServiceService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of ServiceResponseDto', async () => {
      const mockServices = [mockService];
      mockServiceService.findAll.mockResolvedValue(mockServices);

      const result = await controller.findAll();

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(ServiceResponseDto);
      expect(result[0].id).toBe(mockService.id);
      expect(service.findAll).toHaveBeenCalledWith(undefined);
    });

    it('should filter by organizationId when provided', async () => {
      const mockServices = [mockService];
      mockServiceService.findAll.mockResolvedValue(mockServices);

      const result = await controller.findAll('1');

      expect(result).toHaveLength(1);
      expect(service.findAll).toHaveBeenCalledWith(1);
    });
  });

  describe('findById', () => {
    it('should return a ServiceResponseDto', async () => {
      mockServiceService.findById.mockResolvedValue(mockService);

      const result = await controller.findById(1);

      expect(result).toBeInstanceOf(ServiceResponseDto);
      expect(result.id).toBe(mockService.id);
      expect(result.name).toBe(mockService.name);
      expect(service.findById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when service is not found', async () => {
      mockServiceService.findById.mockRejectedValue(
        new NotFoundException('Service with ID 999 not found'),
      );

      await expect(controller.findById(999)).rejects.toThrow(NotFoundException);
      expect(service.findById).toHaveBeenCalledWith(999);
    });
  });

  describe('findByOrganizationId', () => {
    it('should return an array of ServiceResponseDto for an organization', async () => {
      const mockServices = [mockService];
      mockServiceService.findByOrganizationId.mockResolvedValue(mockServices);

      const result = await controller.findByOrganizationId(1);

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(ServiceResponseDto);
      expect(service.findByOrganizationId).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create a service and return ServiceResponseDto', async () => {
      const createDto = {
        organizationId: 1,
        name: 'New Service',
        durationMinutes: 30,
        paddingBeforeMinutes: 0,
        paddingAfterMinutes: 0,
        isActive: true,
      };

      mockServiceService.create.mockResolvedValue(mockService);

      const result = await controller.create(createDto);

      expect(result).toBeInstanceOf(ServiceResponseDto);
      expect(result.id).toBe(mockService.id);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should update a service and return ServiceResponseDto', async () => {
      const updateDto = {
        name: 'Updated Service',
        durationMinutes: 45,
      };

      const updatedService = { ...mockService, ...updateDto };
      mockServiceService.update.mockResolvedValue(updatedService);

      const result = await controller.update(1, updateDto);

      expect(result).toBeInstanceOf(ServiceResponseDto);
      expect(result.name).toBe(updateDto.name);
      expect(service.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should throw NotFoundException when service is not found', async () => {
      const updateDto = {
        name: 'Updated Service',
      };

      mockServiceService.update.mockRejectedValue(
        new NotFoundException('Service with ID 999 not found'),
      );

      await expect(controller.update(999, updateDto)).rejects.toThrow(NotFoundException);
      expect(service.update).toHaveBeenCalledWith(999, updateDto);
    });
  });

  describe('softDelete', () => {
    it('should soft delete a service and return ServiceResponseDto', async () => {
      const deactivatedService = { ...mockService, isActive: false };
      mockServiceService.softDelete.mockResolvedValue(deactivatedService);

      const result = await controller.softDelete(1);

      expect(result).toBeInstanceOf(ServiceResponseDto);
      expect(result.isActive).toBe(false);
      expect(service.softDelete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when service is not found', async () => {
      mockServiceService.softDelete.mockRejectedValue(
        new NotFoundException('Service with ID 999 not found'),
      );

      await expect(controller.softDelete(999)).rejects.toThrow(NotFoundException);
      expect(service.softDelete).toHaveBeenCalledWith(999);
    });
  });
});

