import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Realtime ELO Ranker')
    .setDescription('API de classement ELO en temps réel')
    .setVersion('1.0')
    .addTag('players', 'Gestion des joueurs')
    .addTag('matches', 'Gestion des matchs')
    .addTag('ranking', 'Classement et flux temps réel')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3333);
}
bootstrap();
