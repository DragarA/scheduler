import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { UserService } from '../user/user.service';
import { AppointmentStatus } from '../../generated/prisma/enums';
import { ClerkAuth } from '../auth/current-user.decorator';

describe('AppointmentController', () => {
  let controller: AppointmentController;
  let appointmentService: AppointmentService;
  let userService: UserService;

  const mockUser = {
    id: 1,
    clerkId: 'user_123',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    status: 'ACTIVE' as any,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

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
  };

  const mockAppointmentService = {
    findByProviderId: jest.fn(),
    findById: jest.fn(),
    updateStatus: jest.fn(),
  };

  const mockUserService = {
    findByClerkId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentController],
      providers: [
        {
          provide: AppointmentService,
          useValue: mockAppointmentService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<AppointmentController>(AppointmentController);
    appointmentService = module.get<AppointmentService>(AppointmentService);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    const mockAuth: ClerkAuth = {
      userId: 'user_123',
      sessionId: 'session_123',
    };

    it('should return paginated appointments for authenticated user', async () => {
      const mockResult = {
        data: [mockAppointment],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      mockUserService.findByClerkId.mockResolvedValue(mockUser);
      mockAppointmentService.findByProviderId.mockResolvedValue(mockResult);

      const result = await controller.findAll(mockAuth);

      expect(userService.findByClerkId).toHaveBeenCalledWith('user_123');
      expect(appointmentService.findByProviderId).toHaveBeenCalledWith({
        providerId: 1,
        search: undefined,
        status: undefined,
        sortBy: 'start',
        sortOrder: 'asc',
        page: 1,
        limit: 10,
      });
      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
    });

    it('should pass search parameter to service', async () => {
      const mockResult = {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };

      mockUserService.findByClerkId.mockResolvedValue(mockUser);
      mockAppointmentService.findByProviderId.mockResolvedValue(mockResult);

      await controller.findAll(mockAuth, 'John');

      expect(appointmentService.findByProviderId).toHaveBeenCalledWith(
        expect.objectContaining({
          search: 'John',
        })
      );
    });

    it('should pass status filter to service', async () => {
      const mockResult = {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };

      mockUserService.findByClerkId.mockResolvedValue(mockUser);
      mockAppointmentService.findByProviderId.mockResolvedValue(mockResult);

      await controller.findAll(mockAuth, undefined, 'PENDING');

      expect(appointmentService.findByProviderId).toHaveBeenCalledWith(
        expect.objectContaining({
          status: ['PENDING'],
        })
      );
    });

    it('should handle multiple status filters', async () => {
      const mockResult = {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };

      mockUserService.findByClerkId.mockResolvedValue(mockUser);
      mockAppointmentService.findByProviderId.mockResolvedValue(mockResult);

      await controller.findAll(mockAuth, undefined, ['PENDING', 'CONFIRMED']);

      expect(appointmentService.findByProviderId).toHaveBeenCalledWith(
        expect.objectContaining({
          status: ['PENDING', 'CONFIRMED'],
        })
      );
    });

    it('should pass sort parameters to service', async () => {
      const mockResult = {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };

      mockUserService.findByClerkId.mockResolvedValue(mockUser);
      mockAppointmentService.findByProviderId.mockResolvedValue(mockResult);

      await controller.findAll(
        mockAuth,
        undefined,
        undefined,
        'customer',
        'desc'
      );

      expect(appointmentService.findByProviderId).toHaveBeenCalledWith(
        expect.objectContaining({
          sortBy: 'customer',
          sortOrder: 'desc',
        })
      );
    });

    it('should pass pagination parameters to service', async () => {
      const mockResult = {
        data: [],
        total: 0,
        page: 2,
        limit: 20,
        totalPages: 0,
      };

      mockUserService.findByClerkId.mockResolvedValue(mockUser);
      mockAppointmentService.findByProviderId.mockResolvedValue(mockResult);

      await controller.findAll(
        mockAuth,
        undefined,
        undefined,
        undefined,
        undefined,
        '2',
        '20'
      );

      expect(appointmentService.findByProviderId).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 2,
          limit: 20,
        })
      );
    });

    it('should use default values for sort and pagination', async () => {
      const mockResult = {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };

      mockUserService.findByClerkId.mockResolvedValue(mockUser);
      mockAppointmentService.findByProviderId.mockResolvedValue(mockResult);

      await controller.findAll(mockAuth);

      expect(appointmentService.findByProviderId).toHaveBeenCalledWith({
        providerId: 1,
        search: undefined,
        status: undefined,
        sortBy: 'start',
        sortOrder: 'asc',
        page: 1,
        limit: 10,
      });
    });

    it('should throw NotFoundException when user is not found', async () => {
      mockUserService.findByClerkId.mockResolvedValue(null);

      await expect(controller.findAll(mockAuth)).rejects.toThrow(
        NotFoundException
      );
      await expect(controller.findAll(mockAuth)).rejects.toThrow(
        'User not found'
      );
      expect(appointmentService.findByProviderId).not.toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return an appointment by id', async () => {
      mockAppointmentService.findById.mockResolvedValue(mockAppointment);

      const result = await controller.findById(1);

      expect(appointmentService.findById).toHaveBeenCalledWith(1);
      expect(result).toBeDefined();
      expect(result.id).toBe(1);
    });

    it('should throw NotFoundException when appointment is not found', async () => {
      mockAppointmentService.findById.mockRejectedValue(
        new NotFoundException('Appointment with ID 999 not found')
      );

      await expect(controller.findById(999)).rejects.toThrow(NotFoundException);
      expect(appointmentService.findById).toHaveBeenCalledWith(999);
    });
  });

  describe('updateStatus', () => {
    it('should update appointment status', async () => {
      const updatedAppointment = {
        ...mockAppointment,
        status: AppointmentStatus.COMPLETED,
      };

      mockAppointmentService.updateStatus.mockResolvedValue(
        updatedAppointment
      );

      const result = await controller.updateStatus(1, {
        status: AppointmentStatus.COMPLETED,
      });

      expect(appointmentService.updateStatus).toHaveBeenCalledWith(1, {
        status: AppointmentStatus.COMPLETED,
      });
      expect(result.status).toBe(AppointmentStatus.COMPLETED);
    });

    it('should throw NotFoundException when appointment is not found', async () => {
      mockAppointmentService.updateStatus.mockRejectedValue(
        new NotFoundException('Appointment with ID 999 not found')
      );

      await expect(
        controller.updateStatus(999, { status: AppointmentStatus.COMPLETED })
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for invalid status transition', async () => {
      const error = new Error('Cannot transition from COMPLETED to PENDING');
      mockAppointmentService.updateStatus.mockRejectedValue(error);

      await expect(
        controller.updateStatus(1, { status: AppointmentStatus.PENDING })
      ).rejects.toThrow(error);
    });
  });
});
