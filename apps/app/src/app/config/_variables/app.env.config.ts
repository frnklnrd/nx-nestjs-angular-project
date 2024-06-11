import { isDevMode } from '@angular/core';
import { NgxLoggerLevel } from 'ngx-logger';
import * as packageJson from '../../../../package.json';
import { environment } from '../../../environments/environment';

export const APP_ENV_CONFIG = {
  env: {
    production: environment.production,
    name: environment.name === '' ? 'dev' : environment.name
  },
  app: {
    name: 'app',
    version: packageJson.version,
    versionName:
      packageJson.version +
      (environment.name === 'prod'
        ? ''
        : '-' + environment.name.toUpperCase() + '')
  },
  logger: {
    level: environment.logger_level, // TRACE = 0, DEBUG = 1, INFO = 2, LOG = 3, WARN = 4, ERROR = 5, FATAL = 6, OFF = 7
    server_level: NgxLoggerLevel.OFF
  },
  api: {
    base_path: environment.api_base_path,
    prefixes: [environment.api_base_path]
  },
  crypto: {
    secret: '[' + environment.name + ']' // TODO: load from .env
  },
  storage: {
    prefixKey: 'app',
    useCryptoForKeys: !isDevMode(),
    useCryptoForValues: !isDevMode()
  }
};
