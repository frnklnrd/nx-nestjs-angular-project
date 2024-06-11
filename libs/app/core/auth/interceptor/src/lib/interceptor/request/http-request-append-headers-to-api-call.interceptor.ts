/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable, filter, switchMap } from 'rxjs';

@Injectable()
export class HttpRequestAppendHeadersToApiCallInterceptor
  implements HttpInterceptor
{
  protected readonly store: Store = inject<Store>(Store);

  constructor() {
    //
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const apisPrefixes = this.store.selectSnapshot(
      (state: any) => state?.config?.api?.prefixes
    );

    if (!apisPrefixes || apisPrefixes.length === 0) {
      return next.handle(request);
    }

    const find = apisPrefixes.find(
      (prefix: string) => request.url.indexOf(prefix) !== -1
    );

    if (!find) {
      return next.handle(request);
    }

    if (request.url.includes(find + '/auth/')) {
      request = this.appendHeaders(request, find);
      return next.handle(request);
    }

    return this.store
      .select((state) => state?.auth?.checkingAuthTokenValid)
      .pipe(
        filter((checking) => !checking),
        switchMap(() => {
          request = this.appendHeaders(request, find);
          return next.handle(request);
        })
      );
  }

  private appendHeaders(
    request: HttpRequest<unknown>,
    find: string
  ): HttpRequest<unknown> {
    if (
      !request.headers.has('Content-Type') &&
      !request.headers.has('enctype')
    ) {
      if (request.url.includes(find + '/uploads/')) {
        // not apply 'application/json',
        request = request.clone({
          setHeaders: {
            enctype: 'multipart/form-data'
          }
        });
      } else {
        request = request.clone({
          setHeaders: {
            'Content-Type': 'application/json'
          }
        });
      }
    }

    if (!request.headers.has('Accept-Language')) {
      request = request.clone({
        setHeaders: {
          'Accept-Language': this.store.selectSnapshot(
            (state: any) => state?.i18n?.currentLanguage
          )
        }
      });
    }

    if (!request.headers.has('Access-Control-Allow-Origin')) {
      request = request.clone({
        setHeaders: {
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    if (!request.headers.has('Authorization')) {
      if (!request.url.includes(find + '/auth/login')) {
        const accessToken: string = this.store.selectSnapshot(
          (state: any) => state?.auth?.accessToken?.tokenValue
        ) as string;

        if (accessToken) {
          const authorization = `Bearer ${accessToken}`;

          request = request.clone({
            setHeaders: {
              Authorization: authorization
            }
          });
        }
      }
    }
    return request;
  }
}
