/**
 * This is not a production server yet!
 * This is only a minimal project to get started.
 */

import { Logger, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';

import * as packageJson from '../package.json';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  app.enableVersioning({
    type: VersioningType.URI,
  });

  const port = process.env.PORT || 3000;

  const globalPrefix = 'api';

  const apiDocsSwaggerUiUrl =
    '/' + globalPrefix + '/docs/swagger-ui/index.html';

  const apiDocsSwaggerJsonUrl = '/' + globalPrefix + '/docs/swagger.json';

  const apiDocsSwaggerYamlUrl = '/' + globalPrefix + '/docs/swagger.yaml';

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('API Documentation')
    .setDescription('API Description')
    .setExternalDoc('Open Api Specification file', apiDocsSwaggerJsonUrl)
    .setVersion(packageJson?.version ?? '1.0')
    .addServer('/' + globalPrefix)
    //.setBasePath('/' + globalPrefix)
    .build();

  const options: SwaggerDocumentOptions = {
    ignoreGlobalPrefix: true,
    operationIdFactory: (controllerKey: string, methodKey: string) => {
      switch (methodKey) {
        case 'create':
        case 'findOne':
        case 'update':
        case 'remove':
          return methodKey + controllerKey.replace('sController', '');
        case 'findAll':
          return methodKey + controllerKey.replace('Controller', '');
        default:
          return methodKey;
      }
      return methodKey;
    },
  };

  const document = SwaggerModule.createDocument(app, config, options);

  const custom: SwaggerCustomOptions = {
    swaggerUrl: apiDocsSwaggerJsonUrl,
    jsonDocumentUrl: apiDocsSwaggerJsonUrl,
    yamlDocumentUrl: apiDocsSwaggerYamlUrl,
    explorer: true,
    swaggerOptions: {
      displayOperationId: false,
      persistAuthorization: true,
    },
    customCssUrl: '/assets/swagger/custom.css',
    customJs: '/assets/swagger/custom.js',
  };

  SwaggerModule.setup(apiDocsSwaggerUiUrl, app, document, custom);

  app.setGlobalPrefix(globalPrefix);

  await app.listen(port);

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );

  Logger.log(
    `🚀 Api Docs is accesible on: http://localhost:${port}${apiDocsSwaggerUiUrl}`
  );

  Logger.log(
    `🚀 Api Docs inJSON format is accesible on: http://localhost:${port}${apiDocsSwaggerJsonUrl}`
  );
}

bootstrap();
