/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class HttpResponseInternalServerErrorInterceptor
  implements HttpInterceptor
{
  constructor() {
    //
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        // TODO: handle error codes
        if (err.status === 500) {
          const error = err.message || err.statusText;
          return throwError(() => new Error(error));
        }
        return next.handle(request);
      })
    );
  }
}
