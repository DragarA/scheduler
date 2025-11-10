import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Service } from '../../../../generated/prisma/client';

export class ServiceResponseDto {
  @ApiProperty({ description: 'Service ID' })
  id: number;

  @ApiProperty({ description: 'Organization ID' })
  organizationId: number;

  @ApiPropertyOptional({ description: 'Category ID' })
  categoryId?: number | null;

  @ApiProperty({ description: 'Service name' })
  name: string;

  @ApiPropertyOptional({ description: 'Service description' })
  description?: string | null;

  @ApiProperty({ description: 'Duration in minutes' })
  durationMinutes: number;

  @ApiProperty({ description: 'Padding before in minutes' })
  paddingBeforeMinutes: number;

  @ApiProperty({ description: 'Padding after in minutes' })
  paddingAfterMinutes: number;

  @ApiPropertyOptional({ description: 'Price in cents' })
  priceCents?: number | null;

  @ApiPropertyOptional({ description: 'Currency code' })
  currency?: string | null;

  @ApiProperty({ description: 'Is service active' })
  isActive: boolean;

  @ApiProperty({ description: 'Created at timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated at timestamp' })
  updatedAt: Date;

  constructor(data: Service) {
    this.id = data.id;
    this.organizationId = data.organizationId;
    this.categoryId = data.categoryId;
    this.name = data.name;
    this.description = data.description;
    this.durationMinutes = data.durationMinutes;
    this.paddingBeforeMinutes = data.paddingBeforeMinutes;
    this.paddingAfterMinutes = data.paddingAfterMinutes;
    this.priceCents = data.priceCents;
    this.currency = data.currency;
    this.isActive = data.isActive;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
