import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppFactory } from './AppFactory';

async function bootstrap() {
  const { appPromise } = AppFactory.create();
  const app = await appPromise;

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS', 'PUT'],
    credentials: true,
    allowedHeaders: '*'
  });

  const config = new DocumentBuilder()
    .setTitle('Feria Gamer API')
    .setDescription('The Feria Gamer API description')
    .setVersion('0.2')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
