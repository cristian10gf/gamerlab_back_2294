import { ExpressAdapter } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import express, { Request, Response } from 'express';
import { Express } from 'express';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export class AppFactory {
  static create(): {
    appPromise: Promise<INestApplication<any>>;
    expressApp: Express;
  } {
    const expressApp = express();
    const adapter = new ExpressAdapter(expressApp);
    const appPromise = NestFactory.create(AppModule, adapter);

    appPromise
      .then((app) => {
        // You can add all required app configurations here

        /**
         * Enable cross-origin resource sharing (CORS) to allow resources to be requested from another domain.
         * @see {@link https://docs.nestjs.com/security/cors}
         */

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
            allowedHeaders: '*',
            exposedHeaders: '*',
        });

        const config = new DocumentBuilder()
            .setTitle('Feria Gamer API')
            .setDescription('The Feria Gamer API description')
            .setVersion('0.2')
            .build();
        const documentFactory = () => SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('docs', app, documentFactory);

        app.init();
      })
      .catch((err) => {
        throw err;
      });

    // IMPORTANT This express application-level middleware makes sure the NestJS app is fully initialized
    expressApp.use((req: Request, res: Response, next) => {
      appPromise
        .then(async (app) => {
          await app.init();
          next();
        })
        .catch((err) => next(err));
    });

    return { appPromise, expressApp };
  }
}