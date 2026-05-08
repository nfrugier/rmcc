import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Active la validation globale (class-validator)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Supprime les champs non déclarés dans le DTO
      forbidNonWhitelisted: true, // Rejette la requête si des champs non prévus sont envoyés
    }),
  );

  // Active CORS pour que votre futur front-end puisse communiquer avec l'API
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
