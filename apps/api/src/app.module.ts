import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './common/database/prisma/prisma.module';
import { ConfigModule } from './config/config.module';
import { LoggerModule } from 'nestjs-pino';
import { HealthController } from './health/health.controller';
import { ClerkWebhookModule } from './webhook/clerk/clerk-webhook.module';
  
@Module({
  imports: [UserModule, PrismaModule, ConfigModule, ClerkWebhookModule, LoggerModule.forRoot({
    pinoHttp: {
      transport: process.env.NODE_ENV === 'development'
        ? { target: 'pino-pretty', options: { singleLine: true } }
        : undefined,
      customProps: (req) => ({ reqId: req.id }),
    },
  })],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
