// src/config/config.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development','test','production']),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string(),
  SWAGGER_USERNAME: z.string(),
  SWAGGER_PASSWORD: z.string(),
  CLERK_SECRET_KEY: z.string(),
  CLERK_PUBLISHABLE_KEY: z.string(),
  CLERK_WEBHOOK_SECRET: z.string(),
  CORS_ORIGIN: z.string().optional(),
});

export type AppConfig = z.infer<typeof schema>;

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      validate: (cfg) => schema.parse(cfg),
    }),
  ],
})
export class ConfigModule {}
