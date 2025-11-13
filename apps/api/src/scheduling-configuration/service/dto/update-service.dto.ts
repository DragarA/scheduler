import { ApiPropertyOptional } from '@nestjs/swagger';
import { z } from 'zod';

export const updateServiceSchema = z.object({
  categoryId: z
    .number()
    .int()
    .positive('Category ID must be a positive integer')
    .nullable()
    .optional(),
  name: z.string().min(1, 'Service name cannot be empty').optional(),
  description: z.string().optional(),
  durationMinutes: z
    .number()
    .int()
    .min(1, 'Duration must be at least 1 minute')
    .optional(),
  paddingBeforeMinutes: z
    .number()
    .int()
    .min(0, 'Padding before must be non-negative')
    .optional(),
  paddingAfterMinutes: z
    .number()
    .int()
    .min(0, 'Padding after must be non-negative')
    .optional(),
  priceCents: z.number().int().min(0, 'Price must be non-negative').optional(),
  currency: z
    .string()
    .length(3, 'Currency must be a 3-letter code (e.g., EUR, USD)')
    .optional(),
  isActive: z.boolean().optional(),
});

export type UpdateServiceDto = z.infer<typeof updateServiceSchema>;

// Class for Swagger documentation
export class UpdateServiceDtoClass {
  @ApiPropertyOptional({ description: 'Category ID' })
  categoryId?: number;

  @ApiPropertyOptional({ description: 'Service name' })
  name?: string;

  @ApiPropertyOptional({ description: 'Service description' })
  description?: string;

  @ApiPropertyOptional({ description: 'Duration in minutes' })
  durationMinutes?: number;

  @ApiPropertyOptional({ description: 'Padding before in minutes' })
  paddingBeforeMinutes?: number;

  @ApiPropertyOptional({ description: 'Padding after in minutes' })
  paddingAfterMinutes?: number;

  @ApiPropertyOptional({ description: 'Price in cents' })
  priceCents?: number;

  @ApiPropertyOptional({ description: 'Currency code (e.g., EUR, USD)' })
  currency?: string;

  @ApiPropertyOptional({ description: 'Is service active' })
  isActive?: boolean;
}
