import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentRepository } from './appointment.repository';
import { PrismaService } from '../common/database/prisma/prisma.service';
import { AppointmentStatus } from '../../generated/prisma/enums';

describe('AppointmentRepository', () => {
  let repository: AppointmentRepository;
  let prismaService: PrismaService;

  const mockAppointment = {
    id: 1,
    organizationId: 1,
    locationId: 1,
    serviceId: 1,
    providerId: 1,
    customerId: 1,
    start: new Date('2024-01-15T10:00:00Z'),
    end: new Date('2024-01-15T11:00:00Z'),
    status: AppointmentStatus.CONFIRMED,
    notes: 'Test appointment',
    createdAt: new Date(),
    updatedAt: new Date(),
    customer: {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      notes: null,
    },
    service: {
      id: 1,
      name: 'Test Service',
      description: 'Test Description',
      durationMinutes: 60,
      priceCents: 5000,
      currency: 'USD',
    },
    location: {
      id: 1,
      name: 'Main Office',
      address: '123 Main St',
      city: 'Test City',
      timezone: 'America/New_York',
    },
    organization: {
      id: 1,
      name: 'Test Organization',
      slug: 'test-org',
    },
  };

  const mockPrismaService = {
    appointment: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<AppointmentRepository>(AppointmentRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findByProviderId', () => {
    it('should return paginated appointments for a provider', async () => {
      mockPrismaService.appointment.findMany.mockResolvedValue([
        mockAppointment,
      ]);
      mockPrismaService.appointment.count.mockResolvedValue(1);

      const result = await repository.findByProviderId({
        providerId: 1,
        page: 1,
        limit: 10,
      });

      expect(result).toEqual({
        data: [mockAppointment],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });

      expect(prismaService.appointment.findMany).toHaveBeenCalledWith({
        where: { providerId: 1 },
        include: {
          customer: true,
          service: true,
          location: true,
          organization: true,
        },
        orderBy: { start: 'asc' },
        skip: 0,
        take: 10,
      });

      expect(prismaService.appointment.count).toHaveBeenCalledWith({
        where: { providerId: 1 },
      });
    });

    it('should filter by customer search (first name)', async () => {
      mockPrismaService.appointment.findMany.mockResolvedValue([]);
      mockPrismaService.appointment.count.mockResolvedValue(0);

      await repository.findByProviderId({
        providerId: 1,
        search: 'John',
        page: 1,
        limit: 10,
      });

      expect(prismaService.appointment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            providerId: 1,
            customer: {
              OR: [
                { firstName: { contains: 'John', mode: 'insensitive' } },
                { lastName: { contains: 'John', mode: 'insensitive' } },
              ],
            },
          },
        })
      );
    });

    it('should filter by single status', async () => {
      mockPrismaService.appointment.findMany.mockResolvedValue([]);
      mockPrismaService.appointment.count.mockResolvedValue(0);

      await repository.findByProviderId({
        providerId: 1,
        status: [AppointmentStatus.PENDING],
        page: 1,
        limit: 10,
      });

      expect(prismaService.appointment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            providerId: 1,
            status: { in: [AppointmentStatus.PENDING] },
          },
        })
      );
    });

    it('should filter by multiple statuses', async () => {
      mockPrismaService.appointment.findMany.mockResolvedValue([]);
      mockPrismaService.appointment.count.mockResolvedValue(0);

      await repository.findByProviderId({
        providerId: 1,
        status: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED],
        page: 1,
        limit: 10,
      });

      expect(prismaService.appointment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            providerId: 1,
            status: {
              in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED],
            },
          },
        })
      );
    });

    it('should not filter by status when empty array is provided', async () => {
      mockPrismaService.appointment.findMany.mockResolvedValue([]);
      mockPrismaService.appointment.count.mockResolvedValue(0);

      await repository.findByProviderId({
        providerId: 1,
        status: [],
        page: 1,
        limit: 10,
      });

      const call = mockPrismaService.appointment.findMany.mock.calls[0][0];
      expect(call.where.status).toBeUndefined();
    });

    it('should sort by customer name', async () => {
      mockPrismaService.appointment.findMany.mockResolvedValue([]);
      mockPrismaService.appointment.count.mockResolvedValue(0);

      await repository.findByProviderId({
        providerId: 1,
        sortBy: 'customer',
        sortOrder: 'desc',
        page: 1,
        limit: 10,
      });

      expect(prismaService.appointment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { customer: { firstName: 'desc' } },
        })
      );
    });

    it('should sort by status', async () => {
      mockPrismaService.appointment.findMany.mockResolvedValue([]);
      mockPrismaService.appointment.count.mockResolvedValue(0);

      await repository.findByProviderId({
        providerId: 1,
        sortBy: 'status',
        sortOrder: 'asc',
        page: 1,
        limit: 10,
      });

      expect(prismaService.appointment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { status: 'asc' },
        })
      );
    });

    it('should calculate pagination correctly', async () => {
      mockPrismaService.appointment.findMany.mockResolvedValue([]);
      mockPrismaService.appointment.count.mockResolvedValue(25);

      const result = await repository.findByProviderId({
        providerId: 1,
        page: 2,
        limit: 10,
      });

      expect(result.totalPages).toBe(3); // 25 items / 10 per page = 3 pages
      expect(prismaService.appointment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10, // (page 2 - 1) * 10 = 10
          take: 10,
        })
      );
    });

    it('should handle combined filters, sort, and pagination', async () => {
      mockPrismaService.appointment.findMany.mockResolvedValue([]);
      mockPrismaService.appointment.count.mockResolvedValue(5);

      await repository.findByProviderId({
        providerId: 1,
        search: 'Jane',
        status: [AppointmentStatus.CONFIRMED],
        sortBy: 'start',
        sortOrder: 'desc',
        page: 2,
        limit: 5,
      });

      expect(prismaService.appointment.findMany).toHaveBeenCalledWith({
        where: {
          providerId: 1,
          customer: {
            OR: [
              { firstName: { contains: 'Jane', mode: 'insensitive' } },
              { lastName: { contains: 'Jane', mode: 'insensitive' } },
            ],
          },
          status: { in: [AppointmentStatus.CONFIRMED] },
        },
        include: {
          customer: true,
          service: true,
          location: true,
          organization: true,
        },
        orderBy: { start: 'desc' },
        skip: 5,
        take: 5,
      });
    });
  });

  describe('findById', () => {
    it('should return an appointment with all relations', async () => {
      const appointmentWithProvider = {
        ...mockAppointment,
        provider: {
          id: 1,
          firstName: 'Provider',
          lastName: 'User',
        },
      };

      mockPrismaService.appointment.findUnique.mockResolvedValue(
        appointmentWithProvider
      );

      const result = await repository.findById(1);

      expect(result).toEqual(appointmentWithProvider);
      expect(prismaService.appointment.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          customer: true,
          service: true,
          location: true,
          organization: true,
          provider: true,
        },
      });
    });

    it('should return null when appointment is not found', async () => {
      mockPrismaService.appointment.findUnique.mockResolvedValue(null);

      const result = await repository.findById(999);

      expect(result).toBeNull();
    });
  });

  describe('updateStatus', () => {
    it('should update appointment status', async () => {
      const updatedAppointment = {
        ...mockAppointment,
        status: AppointmentStatus.COMPLETED,
      };

      mockPrismaService.appointment.update.mockResolvedValue(
        updatedAppointment
      );

      const result = await repository.updateStatus(
        1,
        AppointmentStatus.COMPLETED
      );

      expect(result).toEqual(updatedAppointment);
      expect(prismaService.appointment.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { status: AppointmentStatus.COMPLETED },
        include: {
          customer: true,
          service: true,
          location: true,
          organization: true,
        },
      });
    });

    it('should return updated appointment with all relations', async () => {
      const updatedAppointment = {
        ...mockAppointment,
        status: AppointmentStatus.CANCELLED,
      };

      mockPrismaService.appointment.update.mockResolvedValue(
        updatedAppointment
      );

      const result = await repository.updateStatus(
        1,
        AppointmentStatus.CANCELLED
      );

      expect(result.customer).toBeDefined();
      expect(result.service).toBeDefined();
      expect(result.location).toBeDefined();
      expect(result.organization).toBeDefined();
    });
  });
});
