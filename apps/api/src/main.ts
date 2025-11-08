import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { v4 as uuid } from 'uuid';
import { Logger } from 'nestjs-pino';
import { clerkMiddleware } from '@clerk/express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(clerkMiddleware({
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY!,
    secretKey: process.env.CLERK_SECRET_KEY!,
  }))

  app.useLogger(app.get(Logger));
  app.use((req, _res, next) => { req.id = req.id || uuid(); next(); });

  const config = new DocumentBuilder()
    .setTitle('Scheduler App API')
    .setDescription('Scheduler App API description')
    .setVersion('1.0')
    .addTag('scheduler')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
