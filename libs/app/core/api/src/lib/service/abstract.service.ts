/* eslint-disable @typescript-eslint/no-explicit-any */

import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { marker as _i18n } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { LoggerUtilService } from '@project/app-core-util-logger';
import { Observable, throwError } from 'rxjs';

export abstract class AbstractService {
  // ----------------------------------------------------------

  protected readonly __classname: string;

  // ----------------------------------------------------------

  protected readonly logger: LoggerUtilService =
    inject<LoggerUtilService>(LoggerUtilService);

  protected readonly store: Store = inject<Store>(Store);

  protected readonly translate: TranslateService =
    inject<TranslateService>(TranslateService);

  // ----------------------------------------------------------

  protected readonly __cached: Map<string, any> = new Map<string, any>();

  // ----------------------------------------------------------

  constructor() {
    this.__classname = this.constructor.name;
  }

  // ----------------------------------------------------------

  protected handleError(error: HttpErrorResponse | Error): Observable<any> {
    this.logger.console.error(this.__classname, 'error', error);

    let errorMsg: string | null = null;

    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 100:
        case 101:
        case 200:
        case 201:
        case 202:
        case 204:
        case 300:
        case 301:
        case 302:
        case 304:
        case 400:
        case 401:
        case 403:
        case 404:
        case 405:
        case 406:
        case 500:
        case 501:
        case 502:
        case 503:
        case 504:
        case 505:
          errorMsg = this.translate.instant('error.' + error.status);
          break;
        default:
          errorMsg = this.translate.instant(_i18n('error.unknown'));
          break;
      }
    } else {
      errorMsg = this.translate.instant(_i18n('error.unknown'));
    }

    this.logger.console.error(this.__classname, 'errorMsg', errorMsg);

    return throwError(
      () =>
        new Error(
          error instanceof HttpErrorResponse && error.error?.message
            ? error.error?.message
            : error instanceof Error
            ? error.message
            : (errorMsg as string)
        )
    );
  }

  // ----------------------------------------------------------

  protected isCached(prefix: string, key: string): boolean {
    return this.__cached.has((prefix + ':' + key).toLocaleLowerCase());
  }

  protected getCached(prefix: string, key: string): any {
    if (this.__cached.has((prefix + ':' + key).toLocaleLowerCase())) {
      return this.__cached.get((prefix + ':' + key).toLocaleLowerCase());
    }
    return null;
  }

  protected setCached(prefix: string, key: string, value: any): void {
    this.__cached.set((prefix + ':' + key).toLocaleLowerCase(), value);
  }

  protected removeCached(prefix: string, key: string): void {
    if (this.__cached.has((prefix + ':' + key).toLocaleLowerCase())) {
      this.__cached.delete((prefix + ':' + key).toLocaleLowerCase());
    }
  }

  // ----------------------------------------------------------
}
