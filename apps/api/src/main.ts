import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { v4 as uuid } from "uuid";
import { Logger } from "nestjs-pino";
import { clerkMiddleware } from "@clerk/express";
import { writeFileSync } from "fs";
import { join } from "path";
import { json, urlencoded } from "body-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    clerkMiddleware({
      publishableKey: process.env.CLERK_PUBLISHABLE_KEY!,
      secretKey: process.env.CLERK_SECRET_KEY!,
    })
  );

  app.use(
    "/webhooks/clerk",
    json({
      verify: (req: any, res, buf: Buffer) => {
        req.rawBody = buf.toString("utf8");
      },
    })
  );

  app.use(
    urlencoded({
      extended: true,
    })
  );

  app.useLogger(app.get(Logger));
  app.use((req, _res, next) => {
    req.id = req.id || uuid();
    next();
  });

  const config = new DocumentBuilder()
    .setTitle("Scheduler App API")
    .setDescription("Scheduler App API description")
    .setVersion("1.0")
    .addTag("scheduler")
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, documentFactory);

  // Write OpenAPI document as JSON to root of project
  const openApiJson = JSON.stringify(documentFactory(), null, 2);
  const openApiPath = join(process.cwd(), "openapi.json");
  writeFileSync(openApiPath, openApiJson);

  const corsOrigin = process.env.CORS_ORIGIN?.split(",");
  console.log(corsOrigin);
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
