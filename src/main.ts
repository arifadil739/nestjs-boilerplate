import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { UserModule } from './user/user.module';
import { useContainer } from 'class-validator';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    },
  });

  const userOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      authAction: {
        defaultBearerAuth: {
          name: 'defaultBearerAuth',
          schema: {
            description: 'User',
            type: 'http',
            in: 'header',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
          value: '',
        },
      },
    },
  };

  const userConfig = new DocumentBuilder()
    .setTitle('Nest JS Boiler Plate')
    .setDescription(`Nest API's`)
    .setVersion('1.0')
    .addBearerAuth(undefined, 'defaulBearerAuth')
    .build();

  const userDocuments = SwaggerModule.createDocument(app, userConfig, {
    include: [UserModule],
  });
  SwaggerModule.setup('swagger/user', app, userDocuments, userOptions);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
      transform: true,
      forbidUnknownValues: false,
      whitelist: false,
    }),
  );

  const PORT = process.env.PORT;
  await app.listen(PORT);
}
bootstrap();
