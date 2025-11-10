import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { z } from 'zod';

export const createServiceSchema = z.object({
  organizationId: z.number().int().positive('Organization ID must be a positive integer'),
  categoryId: z.number().int().positive('Category ID must be a positive integer').optional(),
  name: z.string().min(1, 'Service name is required'),
  description: z.string().optional().nullable(),
  durationMinutes: z.number().int().min(1, 'Duration must be at least 1 minute'),
  paddingBeforeMinutes: z.number().int().min(0, 'Padding before must be non-negative').default(0),
  paddingAfterMinutes: z.number().int().min(0, 'Padding after must be non-negative').default(0),
  priceCents: z.number().int().min(0, 'Price must be non-negative').optional().nullable(),
  currency: z.string().length(3, 'Currency must be a 3-letter code (e.g., EUR, USD)').optional().nullable(),
  isActive: z.boolean().default(true),
});

export type CreateServiceDto = z.infer<typeof createServiceSchema>;

// Class for Swagger documentation
export class CreateServiceDtoClass {
  @ApiProperty({ description: 'Organization ID' })
  organizationId: number;

  @ApiPropertyOptional({ description: 'Category ID' })
  categoryId?: number;

  @ApiProperty({ description: 'Service name' })
  name: string;

  @ApiPropertyOptional({ description: 'Service description' })
  description?: string;

  @ApiProperty({ description: 'Duration in minutes' })
  durationMinutes: number;

  @ApiPropertyOptional({ description: 'Padding before in minutes', default: 0 })
  paddingBeforeMinutes?: number;

  @ApiPropertyOptional({ description: 'Padding after in minutes', default: 0 })
  paddingAfterMinutes?: number;

  @ApiPropertyOptional({ description: 'Price in cents' })
  priceCents?: number;

  @ApiPropertyOptional({ description: 'Currency code (e.g., EUR, USD)' })
  currency?: string;

  @ApiPropertyOptional({ description: 'Is service active', default: true })
  isActive?: boolean;
}

