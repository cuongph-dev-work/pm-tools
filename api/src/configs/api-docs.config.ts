import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NextFunction, Request, Response } from 'express';

const api_documentation_credentials = {
  name: 'admin',
  pass: 'admin',
};

export function configSwagger(app: INestApplication) {
  const apiEndpoint = app.get(ConfigService).get('app.backendUrl');
  const config = new DocumentBuilder()
    .setTitle('APP project')
    .setDescription(
      '## The APP API description\n\n### API Versioning\nAPI version is controlled via the `version` header. Default version is `1`.',
    )
    .setVersion('1.0')
    .addServer(`${apiEndpoint}/api`)
    // .addSecurity('token', { type: 'http', scheme: 'bearer' })
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'bearer',
    )
    .addGlobalParameters({
      name: 'version',
      in: 'header',
      description: 'API version',
      required: false,
      schema: {
        type: 'string',
        default: '1',
      },
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const httpAdapter = app.getHttpAdapter();
  httpAdapter.use('/api-docs', (req: Request, res: Response, next: NextFunction) => {
    function parseAuthHeader(input: string): { name: string; pass: string } {
      const [, encodedPart] = input.split(' ');

      const buff = Buffer.from(encodedPart, 'base64');
      const text = buff.toString('ascii');
      const [name, pass] = text.split(':');

      return { name, pass };
    }

    function unauthorizedResponse(): void {
      if (httpAdapter.getType() === 'fastify') {
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic');
      } else {
        res.status(401);
        res.set('WWW-Authenticate', 'Basic');
      }

      next();
    }

    if (!req.headers.authorization) {
      return unauthorizedResponse();
    }

    const credentials = parseAuthHeader(req.headers.authorization);

    if (
      credentials?.name !== api_documentation_credentials.name ||
      credentials?.pass !== api_documentation_credentials.pass
    ) {
      return unauthorizedResponse();
    }

    next();
  });
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
    customJs: '/swagger-custom.js',
    customSiteTitle: 'App Documentation',
    customfavIcon: '/swagger.ico',
  });
}
