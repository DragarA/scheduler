import {
  PipeTransform,
  BadRequestException,
} from '@nestjs/common';
import { ZodType, ZodError } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodType) {}

  transform(value: unknown) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((issue) => {
          const path = issue.path.join('.');
          return path ? `${path}: ${issue.message}` : issue.message;
        });
        throw new BadRequestException({
          message: 'Validation failed',
          errors: errorMessages,
          details: error.issues,
        });
      }
      throw new BadRequestException('Validation failed');
    }
  }
}
