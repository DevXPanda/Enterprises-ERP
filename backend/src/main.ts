// Application entrypoint — boots the NestJS API on port 4000.
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({ origin: true, credentials: true });

  const port = Number(process.env.PORT) || 4000;
  await app.listen(port);
  console.log(`\nNKTech ERP API   -> http://localhost:${port}/api`);
  console.log(`Health           -> http://localhost:${port}/api/health`);
  console.log(`Resource catalog -> http://localhost:${port}/api/resources\n`);
}

bootstrap();
