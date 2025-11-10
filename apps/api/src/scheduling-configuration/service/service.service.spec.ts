import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceRepository } from './service.repository';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

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

describe('ServiceService', () => {
  let service: ServiceService;
  let repository: ServiceRepository;

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

  const mockRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByOrganizationId: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceService,
        {
          provide: ServiceRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ServiceService>(ServiceService);
    repository = module.get<ServiceRepository>(ServiceRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all services when no organizationId is provided', async () => {
      const mockServices = [mockService];
      mockRepository.findAll.mockResolvedValue(mockServices);

      const result = await service.findAll();

      expect(result).toEqual(mockServices);
      expect(repository.findAll).toHaveBeenCalledWith(undefined);
    });

    it('should return services filtered by organizationId', async () => {
      const mockServices = [mockService];
      mockRepository.findAll.mockResolvedValue(mockServices);

      const result = await service.findAll(1);

      expect(result).toEqual(mockServices);
      expect(repository.findAll).toHaveBeenCalledWith(1);
    });
  });

  describe('findById', () => {
    it('should return a service when found', async () => {
      mockRepository.findById.mockResolvedValue(mockService);

      const result = await service.findById(1);

      expect(result).toEqual(mockService);
      expect(repository.findById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when service is not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
      await expect(service.findById(999)).rejects.toThrow('Service with ID 999 not found');
      expect(repository.findById).toHaveBeenCalledWith(999);
    });
  });

  describe('findByOrganizationId', () => {
    it('should return services for an organization', async () => {
      const mockServices = [mockService];
      mockRepository.findByOrganizationId.mockResolvedValue(mockServices);

      const result = await service.findByOrganizationId(1);

      expect(result).toEqual(mockServices);
      expect(repository.findByOrganizationId).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create a service with all fields', async () => {
      const createDto: CreateServiceDto = {
        organizationId: 1,
        categoryId: 2,
        name: 'New Service',
        description: 'New Description',
        durationMinutes: 30,
        paddingBeforeMinutes: 5,
        paddingAfterMinutes: 10,
        priceCents: 3000,
        currency: 'USD',
        isActive: true,
      };

      mockRepository.create.mockResolvedValue(mockService);

      const result = await service.create(createDto);

      expect(result).toEqual(mockService);
      expect(repository.create).toHaveBeenCalled();
      const createCall = mockRepository.create.mock.calls[0][0];
      expect(createCall.name).toBe(createDto.name);
      expect(createCall.durationMinutes).toBe(createDto.durationMinutes);
      expect(createCall.organization.connect.id).toBe(createDto.organizationId);
    });

    it('should create a service with default values', async () => {
      const createDto: CreateServiceDto = {
        organizationId: 1,
        name: 'New Service',
        durationMinutes: 30,
        paddingBeforeMinutes: 0,
        paddingAfterMinutes: 0,
        isActive: true,
      };

      mockRepository.create.mockResolvedValue(mockService);

      await service.create(createDto);

      const createCall = mockRepository.create.mock.calls[0][0];
      expect(createCall.paddingBeforeMinutes).toBe(0);
      expect(createCall.paddingAfterMinutes).toBe(0);
      expect(createCall.isActive).toBe(true);
    });

    it('should create a service without optional category', async () => {
      const createDto: CreateServiceDto = {
        organizationId: 1,
        name: 'New Service',
        durationMinutes: 30,
        paddingBeforeMinutes: 0,
        paddingAfterMinutes: 0,
        isActive: true,
      };

      mockRepository.create.mockResolvedValue(mockService);

      await service.create(createDto);

      const createCall = mockRepository.create.mock.calls[0][0];
      expect(createCall.category).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update a service when found', async () => {
      const updateDto: UpdateServiceDto = {
        name: 'Updated Service',
        durationMinutes: 45,
      };

      const updatedService = { ...mockService, name: 'Updated Service', durationMinutes: 45 };
      mockRepository.findById.mockResolvedValue(mockService);
      mockRepository.update.mockResolvedValue(updatedService);

      const result = await service.update(1, updateDto);

      expect(repository.findById).toHaveBeenCalledWith(1);
      expect(repository.update).toHaveBeenCalledWith(1, updateDto);
      expect(result.name).toBe(updateDto.name);
      expect(result.durationMinutes).toBe(updateDto.durationMinutes);
    });

    it('should throw NotFoundException when service is not found', async () => {
      const updateDto: UpdateServiceDto = {
        name: 'Updated Service',
      };

      mockRepository.findById.mockResolvedValue(null);

      await expect(service.update(999, updateDto)).rejects.toThrow(NotFoundException);
      expect(repository.findById).toHaveBeenCalledWith(999);
      expect(repository.update).not.toHaveBeenCalled();
    });
  });

  describe('softDelete', () => {
    it('should soft delete a service when found', async () => {
      const deactivatedService = { ...mockService, isActive: false };
      mockRepository.findById.mockResolvedValue(mockService);
      mockRepository.softDelete.mockResolvedValue(deactivatedService);

      const result = await service.softDelete(1);

      expect(result).toEqual(deactivatedService);
      expect(repository.findById).toHaveBeenCalledWith(1);
      expect(repository.softDelete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when service is not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.softDelete(999)).rejects.toThrow(NotFoundException);
      expect(repository.findById).toHaveBeenCalledWith(999);
      expect(repository.softDelete).not.toHaveBeenCalled();
    });
  });
});

