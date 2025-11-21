import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/database/prisma/prisma.service';
import { Appointment, AppointmentStatus, Customer, Location, Organization, Prisma, Service } from '../../generated/prisma/client';

export interface FindAppointmentsOptions {
  providerId: number;
  search?: string;
  status?: AppointmentStatus[];
  sortBy?: 'start' | 'customer' | 'status';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface AppointmentWithRelations extends Appointment {
  customer?: Customer;
  service?: Service;
  location: Location | null;
  organization?: Organization;
}

export interface PaginatedAppointments {
  data: AppointmentWithRelations[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class AppointmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByProviderId(
    options: FindAppointmentsOptions,
  ): Promise<PaginatedAppointments> {
    const {
      providerId,
      search,
      status,
      sortBy = 'start',
      sortOrder = 'asc',
      page = 1,
      limit = 10,
    } = options;

    const where: Prisma.AppointmentWhereInput = {
      providerId,
    };

    // Add search filter for customer name
    if (search) {
      where.customer = {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
        ],
      };
    }

    // Add status filter (support multiple statuses)
    if (status && status.length > 0) {
      where.status = { in: status };
    }

    // Build orderBy based on sortBy
    let orderBy: Prisma.AppointmentOrderByWithRelationInput = {};
    switch (sortBy) {
      case 'start':
        orderBy = { start: sortOrder };
        break;
      case 'customer':
        orderBy = { customer: { firstName: sortOrder } };
        break;
      case 'status':
        orderBy = { status: sortOrder };
        break;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute queries in parallel
    const [data, total] = await Promise.all([
      this.prisma.appointment.findMany({
        where,
        include: {
          customer: true,
          service: true,
          location: true,
          organization: true,
        },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.appointment.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: number): Promise<AppointmentWithRelations | null> {
    return this.prisma.appointment.findUnique({
      where: { id },
      include: {
        customer: true,
        service: true,
        location: true,
        organization: true,
        provider: true,
      },
    });
  }

  async updateStatus(
    id: number,
    status: AppointmentStatus,
  ): Promise<AppointmentWithRelations> {
    return this.prisma.appointment.update({
      where: { id },
      data: { status },
      include: {
        customer: true,
        service: true,
        location: true,
        organization: true,
      },
    });
  }
}
