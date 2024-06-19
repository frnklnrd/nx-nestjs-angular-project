/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

@Injectable()
export class LoggerUtilService {
  protected readonly __logger: NGXLogger = inject<NGXLogger>(NGXLogger);

  public get console(): NGXLogger {
    return this.__logger;
  }
}
