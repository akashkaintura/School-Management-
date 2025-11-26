import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import express from 'express';

const server = express();

async function createServer() {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(server),
    { logger: ['error', 'warn', 'log'] }
  );

  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Set global prefix
  app.setGlobalPrefix('api');

  await app.init();
  return server;
}

let serverInstance: express.Express;

export default async (req: any, res: any) => {
  if (!serverInstance) {
    serverInstance = await createServer();
  }
  return serverInstance(req, res);
};

