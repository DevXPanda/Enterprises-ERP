// Application entrypoint — boots the NestJS API.
import 'dotenv/config';
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const REQUIRED_ENV = ['DATABASE_URL', 'PORT', 'TENANT_ID'];

async function bootstrap() {
  const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error(`Missing required variables in backend/.env: ${missing.join(', ')}`);
    console.error('Copy backend/.env.example to backend/.env and fill them in.');
    process.exit(1);
  }

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({ origin: true, credentials: true });

  const port = Number(process.env.PORT);
  await app.listen(port);
  console.log(`\nNKTech ERP API   -> http://localhost:${port}/api`);
  console.log(`Health           -> http://localhost:${port}/api/health`);
  console.log(`Resource catalog -> http://localhost:${port}/api/resources\n`);
}

bootstrap();
