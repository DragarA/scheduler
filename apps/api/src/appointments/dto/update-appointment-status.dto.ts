import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';
import { AppointmentStatus } from '../../../generated/prisma/enums';

export const updateAppointmentStatusSchema = z.object({
  status: z.enum(AppointmentStatus, {
    error: 'Invalid status value',
  }),
});

export type UpdateAppointmentStatusDto = z.infer<
  typeof updateAppointmentStatusSchema
>;

export class UpdateAppointmentStatusDtoClass {
  @ApiProperty({
    enum: AppointmentStatus,
    description: 'New appointment status',
    example: AppointmentStatus.CONFIRMED,
  })
  status: AppointmentStatus;
}
