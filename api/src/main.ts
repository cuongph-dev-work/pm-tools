import { configSwagger } from '@configs/api-docs.config';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ValidationErrorFactory } from '@shared/validation.factory';
import { useContainer } from 'class-validator';
import compression from 'compression';
import helmet from 'helmet';
import { I18nService } from 'nestjs-i18n';
import 'reflect-metadata';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger(bootstrap.name);
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: ['error', 'warn', 'debug', 'log'],
  });
  configSwagger(app);
  app.setGlobalPrefix('/api');
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: '*',
    // credentials: true,
  });
  app.use(compression());
  app.use(helmet());
  app.useLogger(app.get(Logger));
  app.enableVersioning({
    type: VersioningType.HEADER,
    header: 'version',
    defaultVersion: '1',
  });

  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: ValidationErrorFactory,
      whitelist: true,
      stopAtFirstError: true,
      errorHttpStatusCode: 422,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter(app.get(ConfigService), app.get(I18nService)));

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(configService.get('app.port') || 3000, () => {
    logger.log(`Application running on port ${configService.get('app.port')}`);
  });
}

void bootstrap();
