import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { AppointmentRepository, FindAppointmentsOptions } from './appointment.repository';
import { UpdateAppointmentStatusDto } from './dto/update-appointment-status.dto';
import { AppointmentStatus } from '../../generated/prisma/enums';

@Injectable()
export class AppointmentService {
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
  ) {}

  async findByProviderId(options: FindAppointmentsOptions) {
    return this.appointmentRepository.findByProviderId(options);
  }

  async findById(id: number) {
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    return appointment;
  }

  async updateStatus(id: number, updateStatusDto: UpdateAppointmentStatusDto) {
    const appointment = await this.findById(id);

    // Validate status transition
    this.validateStatusTransition(appointment.status, updateStatusDto.status);

    return this.appointmentRepository.updateStatus(id, updateStatusDto.status);
  }

  private validateStatusTransition(
    currentStatus: AppointmentStatus,
    newStatus: AppointmentStatus,
  ): void {
    // Define allowed transitions
    const allowedTransitions: Record<AppointmentStatus, AppointmentStatus[]> = {
      [AppointmentStatus.PENDING]: [
        AppointmentStatus.CONFIRMED,
        AppointmentStatus.CANCELLED,
      ],
      [AppointmentStatus.CONFIRMED]: [
        AppointmentStatus.COMPLETED,
        AppointmentStatus.CANCELLED,
        AppointmentStatus.NO_SHOW,
      ],
      [AppointmentStatus.COMPLETED]: [], // No transitions allowed from COMPLETED
      [AppointmentStatus.CANCELLED]: [], // No transitions allowed from CANCELLED
      [AppointmentStatus.NO_SHOW]: [], // No transitions allowed from NO_SHOW
    };

    // Check if the transition is allowed
    const allowed = allowedTransitions[currentStatus];
    if (!allowed.includes(newStatus)) {
      throw new BadRequestException(
        `Cannot transition from ${currentStatus} to ${newStatus}. ` +
          `Allowed transitions: ${allowed.length > 0 ? allowed.join(', ') : 'none'}`,
      );
    }
  }
}
