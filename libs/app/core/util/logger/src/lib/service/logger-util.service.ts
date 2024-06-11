/* eslint-disable @typescript-eslint/no-explicit-any */
import { NGXLogger } from 'ngx-logger';
import { inject, Injectable } from '@angular/core';

@Injectable()
export class LoggerUtilService {
  protected readonly __logger: NGXLogger = inject<NGXLogger>(NGXLogger);

  public get console(): NGXLogger {
    return this.__logger;
  }
}
