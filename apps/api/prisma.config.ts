import { defineConfig } from "prisma/config";
import { ConfigService } from "@nestjs/config";

const configService = new ConfigService();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: configService.get<string>("DATABASE_URL") ?? '',
  },
});
