import { configSwagger } from '@configs/api-docs.config';
import { Logger, RequestMethod, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { pinggy } from '@pinggy/pinggy';
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
    rawBody: true,
  });
  configSwagger(app);
  app.setGlobalPrefix('/api', {
    exclude: [{ path: 'webhook/*', method: RequestMethod.ALL, version: '1' }],
  });
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
  const port = configService.get('app.port') || 3000;
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

  await app.listen(port, () => {
    logger.log(`Application running on port ${port}`);
  });

  if (process.env.ENABLE_PINGGY == 'true') {
    const tunnel = pinggy.createTunnel({
      fullRequestUrl: true,
      forwardTo: `http://localhost:${port}`,
      ssl: true,
      token: process.env.PINGGY_TOKEN,
    });
    await tunnel.start();
    logger.log('Tunnel URLs:', tunnel.urls());
  }
}

void bootstrap();
