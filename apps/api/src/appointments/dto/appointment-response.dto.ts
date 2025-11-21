import { ApiProperty } from '@nestjs/swagger';
import { AppointmentStatus } from '../../../generated/prisma/enums';
import { Location, Customer, Service } from '../../../generated/prisma/client';
import { AppointmentWithRelations } from '../appointment.repository';

class CustomerResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  firstName: string;

  @ApiProperty({ required: false })
  lastName?: string;

  @ApiProperty({ required: false })
  email?: string;

  @ApiProperty({ required: false })
  phone?: string;

  @ApiProperty({ required: false })
  notes?: string;

  constructor(customer: Customer) {
    this.id = customer.id;
    this.firstName = customer.firstName;
    this.lastName = customer.lastName ?? undefined;
    this.email = customer.email ?? undefined;
    this.phone = customer.phone ?? undefined;
    this.notes = customer.notes ?? undefined;
  }
}

class ServiceResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  durationMinutes: number;

  @ApiProperty()
  priceCents?: number;

  @ApiProperty()
  currency?: string;

  constructor(service: Service) {
    this.id = service.id;
    this.name = service.name;
    this.description = service.description ?? undefined;
    this.durationMinutes = service.durationMinutes;
    this.priceCents = service.priceCents ?? undefined;
    this.currency = service.currency ?? undefined;
  }
}

class LocationResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  address?: string;

  @ApiProperty({ required: false })
  city?: string;

  @ApiProperty({ required: false })
  timezone?: string;

  constructor(location: Location) {
    this.id = location.id;
    this.name = location.name;
    this.address = `${location.addressLine1 ?? ''} ${location.addressLine2 ?? ''}`.trim() || undefined;
    this.city = location.city ?? undefined;
    this.timezone = location.timezone ?? undefined;
  }
}

export class AppointmentResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  organizationId: number;

  @ApiProperty()
  start: Date;

  @ApiProperty()
  end: Date;

  @ApiProperty({ enum: AppointmentStatus })
  status: AppointmentStatus;

  @ApiProperty({ required: false })
  notes?: string;

  @ApiProperty({ type: CustomerResponseDto })
  customer: CustomerResponseDto;

  @ApiProperty({ type: ServiceResponseDto })
  service: ServiceResponseDto;

  @ApiProperty({ type: LocationResponseDto, required: false })
  location?: LocationResponseDto;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(
    appointment: AppointmentWithRelations,
  ) {
    this.id = appointment.id;
    this.organizationId = appointment.organizationId;
    this.start = appointment.start;
    this.end = appointment.end;
    this.status = appointment.status;
    this.notes = appointment.notes ?? undefined;
    this.customer = new CustomerResponseDto(appointment.customer!);
    this.service = new ServiceResponseDto(appointment.service!);
    this.location = appointment.location
      ? new LocationResponseDto(appointment.location)
      : undefined;
    this.createdAt = appointment.createdAt;
    this.updatedAt = appointment.updatedAt;
  }
}
