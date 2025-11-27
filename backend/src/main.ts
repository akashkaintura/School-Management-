import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  // Enable CORS
  app.enableCors({
    origin: configService.get('FRONTEND_URL') || 'http://localhost:4200',
    credentials: true,
  });

  // Serve static files (for uploaded logos)
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
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
  const apiPrefix = configService.get('API_PREFIX') || 'api';
  app.setGlobalPrefix(apiPrefix);

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('School Management System API')
    .setDescription('API documentation for the School Management SaaS platform')
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('invitations', 'User invitation management')
    .addTag('schools', 'School management')
    .addTag('users', 'User management')
    .addTag('students', 'Student management')
    .addTag('teachers', 'Teacher management')
    .addTag('classes', 'Class management')
    .addTag('subjects', 'Subject management')
    .addTag('attendance', 'Attendance tracking')
    .addTag('results', 'Results and grades')
    .addTag('finance', 'Financial management')
    .addTag('meetings', 'Meeting management')
    .addTag('notifications', 'Notification system')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  const port = configService.get('PORT') || 3000;
  await app.listen(port);

  console.log(
    `🚀 Application is running on: http://localhost:${port}/${apiPrefix}`,
  );
  console.log(
    `📚 Swagger API Docs available at: http://localhost:${port}/${apiPrefix}/docs`,
  );
}
bootstrap();
