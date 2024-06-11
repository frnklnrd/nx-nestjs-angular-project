/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Store } from '@ngxs/store';
import { AuthLogoutOkStoreAction } from '@project/app-core-auth-store';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class HttpResponseAuthorizationErrorInterceptor
  implements HttpInterceptor
{
  protected readonly store: Store = inject<Store>(Store);

  constructor() {
    //
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if (err.status === 401 || err.status === 403) {
          // logout if 401 or 403 response returned from api
          this.store.dispatch(new AuthLogoutOkStoreAction(true));
          const error =
            err?.error?.message || err?.error?.error || err.statusText;
          return throwError(() => new Error(error));
        }
        return next.handle(request);
      })
    );
  }
}
