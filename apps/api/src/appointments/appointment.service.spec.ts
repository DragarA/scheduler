import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentRepository } from './appointment.repository';
import { AppointmentStatus } from '../../generated/prisma/enums';

// Mock Appointment type
type MockAppointment = {
  id: number;
  organizationId: number;
  locationId: number | null;
  serviceId: number;
  providerId: number;
  customerId: number;
  start: Date;
  end: Date;
  status: AppointmentStatus;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

describe('AppointmentService', () => {
  let service: AppointmentService;
  let repository: AppointmentRepository;

  const mockAppointment: MockAppointment = {
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
  };

  const mockRepository = {
    findByProviderId: jest.fn(),
    findById: jest.fn(),
    updateStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentService,
        {
          provide: AppointmentRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AppointmentService>(AppointmentService);
    repository = module.get<AppointmentRepository>(AppointmentRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByProviderId', () => {
    it('should return paginated appointments for a provider', async () => {
      const mockResult = {
        data: [mockAppointment],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };
      mockRepository.findByProviderId.mockResolvedValue(mockResult);

      const options = {
        providerId: 1,
        page: 1,
        limit: 10,
      };

      const result = await service.findByProviderId(options);

      expect(result).toEqual(mockResult);
      expect(repository.findByProviderId).toHaveBeenCalledWith(options);
    });

    it('should pass search filter to repository', async () => {
      const mockResult = {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };
      mockRepository.findByProviderId.mockResolvedValue(mockResult);

      const options = {
        providerId: 1,
        search: 'John',
        page: 1,
        limit: 10,
      };

      await service.findByProviderId(options);

      expect(repository.findByProviderId).toHaveBeenCalledWith(options);
    });

    it('should pass status filter to repository', async () => {
      const mockResult = {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };
      mockRepository.findByProviderId.mockResolvedValue(mockResult);

      const options = {
        providerId: 1,
        status: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED],
        page: 1,
        limit: 10,
      };

      await service.findByProviderId(options);

      expect(repository.findByProviderId).toHaveBeenCalledWith(options);
    });
  });

  describe('findById', () => {
    it('should return an appointment when found', async () => {
      mockRepository.findById.mockResolvedValue(mockAppointment);

      const result = await service.findById(1);

      expect(result).toEqual(mockAppointment);
      expect(repository.findById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when appointment is not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
      await expect(service.findById(999)).rejects.toThrow(
        'Appointment with ID 999 not found'
      );
      expect(repository.findById).toHaveBeenCalledWith(999);
    });
  });

  describe('updateStatus', () => {
    describe('valid status transitions', () => {
      it('should allow PENDING -> CONFIRMED', async () => {
        const pendingAppointment = {
          ...mockAppointment,
          status: AppointmentStatus.PENDING,
        };
        const confirmedAppointment = {
          ...mockAppointment,
          status: AppointmentStatus.CONFIRMED,
        };

        mockRepository.findById.mockResolvedValue(pendingAppointment);
        mockRepository.updateStatus.mockResolvedValue(confirmedAppointment);

        const result = await service.updateStatus(1, {
          status: AppointmentStatus.CONFIRMED,
        });

        expect(result).toEqual(confirmedAppointment);
        expect(repository.findById).toHaveBeenCalledWith(1);
        expect(repository.updateStatus).toHaveBeenCalledWith(
          1,
          AppointmentStatus.CONFIRMED
        );
      });

      it('should allow PENDING -> CANCELLED', async () => {
        const pendingAppointment = {
          ...mockAppointment,
          status: AppointmentStatus.PENDING,
        };
        const cancelledAppointment = {
          ...mockAppointment,
          status: AppointmentStatus.CANCELLED,
        };

        mockRepository.findById.mockResolvedValue(pendingAppointment);
        mockRepository.updateStatus.mockResolvedValue(cancelledAppointment);

        const result = await service.updateStatus(1, {
          status: AppointmentStatus.CANCELLED,
        });

        expect(result).toEqual(cancelledAppointment);
      });

      it('should allow CONFIRMED -> COMPLETED', async () => {
        const confirmedAppointment = {
          ...mockAppointment,
          status: AppointmentStatus.CONFIRMED,
        };
        const completedAppointment = {
          ...mockAppointment,
          status: AppointmentStatus.COMPLETED,
        };

        mockRepository.findById.mockResolvedValue(confirmedAppointment);
        mockRepository.updateStatus.mockResolvedValue(completedAppointment);

        const result = await service.updateStatus(1, {
          status: AppointmentStatus.COMPLETED,
        });

        expect(result).toEqual(completedAppointment);
      });

      it('should allow CONFIRMED -> CANCELLED', async () => {
        const confirmedAppointment = {
          ...mockAppointment,
          status: AppointmentStatus.CONFIRMED,
        };
        const cancelledAppointment = {
          ...mockAppointment,
          status: AppointmentStatus.CANCELLED,
        };

        mockRepository.findById.mockResolvedValue(confirmedAppointment);
        mockRepository.updateStatus.mockResolvedValue(cancelledAppointment);

        const result = await service.updateStatus(1, {
          status: AppointmentStatus.CANCELLED,
        });

        expect(result).toEqual(cancelledAppointment);
      });

      it('should allow CONFIRMED -> NO_SHOW', async () => {
        const confirmedAppointment = {
          ...mockAppointment,
          status: AppointmentStatus.CONFIRMED,
        };
        const noShowAppointment = {
          ...mockAppointment,
          status: AppointmentStatus.NO_SHOW,
        };

        mockRepository.findById.mockResolvedValue(confirmedAppointment);
        mockRepository.updateStatus.mockResolvedValue(noShowAppointment);

        const result = await service.updateStatus(1, {
          status: AppointmentStatus.NO_SHOW,
        });

        expect(result).toEqual(noShowAppointment);
      });
    });

    describe('invalid status transitions', () => {
      it('should reject PENDING -> COMPLETED', async () => {
        const pendingAppointment = {
          ...mockAppointment,
          status: AppointmentStatus.PENDING,
        };

        mockRepository.findById.mockResolvedValue(pendingAppointment);

        await expect(
          service.updateStatus(1, { status: AppointmentStatus.COMPLETED })
        ).rejects.toThrow(BadRequestException);

        await expect(
          service.updateStatus(1, { status: AppointmentStatus.COMPLETED })
        ).rejects.toThrow('Cannot transition from PENDING to COMPLETED');

        expect(repository.updateStatus).not.toHaveBeenCalled();
      });

      it('should reject PENDING -> NO_SHOW', async () => {
        const pendingAppointment = {
          ...mockAppointment,
          status: AppointmentStatus.PENDING,
        };

        mockRepository.findById.mockResolvedValue(pendingAppointment);

        await expect(
          service.updateStatus(1, { status: AppointmentStatus.NO_SHOW })
        ).rejects.toThrow(BadRequestException);

        expect(repository.updateStatus).not.toHaveBeenCalled();
      });

      it('should reject CONFIRMED -> PENDING', async () => {
        const confirmedAppointment = {
          ...mockAppointment,
          status: AppointmentStatus.CONFIRMED,
        };

        mockRepository.findById.mockResolvedValue(confirmedAppointment);

        await expect(
          service.updateStatus(1, { status: AppointmentStatus.PENDING })
        ).rejects.toThrow(BadRequestException);

        expect(repository.updateStatus).not.toHaveBeenCalled();
      });

      it('should reject any transition from COMPLETED', async () => {
        const completedAppointment = {
          ...mockAppointment,
          status: AppointmentStatus.COMPLETED,
        };

        mockRepository.findById.mockResolvedValue(completedAppointment);

        await expect(
          service.updateStatus(1, { status: AppointmentStatus.PENDING })
        ).rejects.toThrow(BadRequestException);

        await expect(
          service.updateStatus(1, { status: AppointmentStatus.CONFIRMED })
        ).rejects.toThrow(BadRequestException);

        await expect(
          service.updateStatus(1, { status: AppointmentStatus.CANCELLED })
        ).rejects.toThrow(BadRequestException);

        expect(repository.updateStatus).not.toHaveBeenCalled();
      });

      it('should reject any transition from CANCELLED', async () => {
        const cancelledAppointment = {
          ...mockAppointment,
          status: AppointmentStatus.CANCELLED,
        };

        mockRepository.findById.mockResolvedValue(cancelledAppointment);

        await expect(
          service.updateStatus(1, { status: AppointmentStatus.PENDING })
        ).rejects.toThrow(BadRequestException);

        await expect(
          service.updateStatus(1, { status: AppointmentStatus.CONFIRMED })
        ).rejects.toThrow(BadRequestException);

        await expect(
          service.updateStatus(1, { status: AppointmentStatus.COMPLETED })
        ).rejects.toThrow(BadRequestException);

        expect(repository.updateStatus).not.toHaveBeenCalled();
      });

      it('should reject any transition from NO_SHOW', async () => {
        const noShowAppointment = {
          ...mockAppointment,
          status: AppointmentStatus.NO_SHOW,
        };

        mockRepository.findById.mockResolvedValue(noShowAppointment);

        await expect(
          service.updateStatus(1, { status: AppointmentStatus.PENDING })
        ).rejects.toThrow(BadRequestException);

        await expect(
          service.updateStatus(1, { status: AppointmentStatus.CONFIRMED })
        ).rejects.toThrow(BadRequestException);

        await expect(
          service.updateStatus(1, { status: AppointmentStatus.COMPLETED })
        ).rejects.toThrow(BadRequestException);

        expect(repository.updateStatus).not.toHaveBeenCalled();
      });

      it('should provide helpful error message with allowed transitions', async () => {
        const pendingAppointment = {
          ...mockAppointment,
          status: AppointmentStatus.PENDING,
        };

        mockRepository.findById.mockResolvedValue(pendingAppointment);

        await expect(
          service.updateStatus(1, { status: AppointmentStatus.COMPLETED })
        ).rejects.toThrow('Allowed transitions: CONFIRMED, CANCELLED');
      });

      it('should indicate when no transitions are allowed', async () => {
        const completedAppointment = {
          ...mockAppointment,
          status: AppointmentStatus.COMPLETED,
        };

        mockRepository.findById.mockResolvedValue(completedAppointment);

        await expect(
          service.updateStatus(1, { status: AppointmentStatus.PENDING })
        ).rejects.toThrow('Allowed transitions: none');
      });
    });

    it('should throw NotFoundException when appointment is not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(
        service.updateStatus(999, { status: AppointmentStatus.CONFIRMED })
      ).rejects.toThrow(NotFoundException);

      expect(repository.updateStatus).not.toHaveBeenCalled();
    });
  });
});
