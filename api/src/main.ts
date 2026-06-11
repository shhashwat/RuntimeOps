import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { Request, Response } from 'express';

import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const expressApp = app.getHttpAdapter().getInstance();

    expressApp.get('/', (_req: Request, res: Response) => {
        res.redirect('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    });

    app.setGlobalPrefix('api');

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    app.enableCors();

    const config = new DocumentBuilder()
        .setTitle('RuntimeOps API')
        .setDescription(
            'Production-oriented deployment operations dashboard API',
        )
        .setVersion('1.0')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Enter JWT access token',
                in: 'header',
            },
            'access-token',
        )
        .addTag('auth')
        .addTag('projects')
        .addTag('deployments')
        .addTag('health')
        .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, documentFactory);

    await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
}
bootstrap();
