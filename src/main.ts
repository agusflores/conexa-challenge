import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import 'reflect-metadata';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Conexa - Backend NEST Challenge')
    .setDescription(
      'API RESTful para la gestión de películas de Star Wars.\n\n' +
        '- 🔑 Usuario Admin: admin / admin12345\n' +
        '- 🔐 Autenticación JWT\n' +
        '- 📡 Integración con SWAPI',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth', 'Endpoints de autenticación (register, login)')
    .addTag('Films', 'Gestión de películas (CRUD + sync con SWAPI)')
    .addTag('Users', 'Gestión de usuarios (solo ADMIN)')
    .build();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalFilters(new PrismaExceptionFilter());
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
}

bootstrap();
