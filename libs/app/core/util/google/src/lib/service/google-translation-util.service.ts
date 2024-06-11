/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AbstractService } from '@project/app-core-api';
import { ConfigUtilService } from '@project/app-core-util-config';
import { Observable, catchError, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { GoogleTranslationRequestDto } from '../model/google-translation-request.dto';
import { GoogleTranslationResultDto } from '../model/google-translation-result.dto';

@Injectable()
export class GoogleTranslationUtilService extends AbstractService {
  protected readonly _http: HttpClient = inject<HttpClient>(HttpClient);

  protected readonly configService: ConfigUtilService =
    inject<ConfigUtilService>(ConfigUtilService);

  private get googleTranslationApiKey(): string {
    return this.configService.get<string>(
      'google.translation.api_key'
    ) as string;
  }

  private get googleTranslationApiUrl(): string {
    return this.configService.get<string>(
      'google.translation.api_url'
    ) as string;
  }

  translateText(
    translationRequest: GoogleTranslationRequestDto
  ): Observable<GoogleTranslationResultDto> {
    const headers = new HttpHeaders({
      accept: 'application/json'
    });

    return this._http
      .post<any>(
        this.googleTranslationApiUrl + '?key=' + this.googleTranslationApiKey,
        translationRequest,
        {
          headers
        }
      )
      .pipe(
        map((response: any) => response.data),
        catchError((error) => throwError(() => error))
      );
  }
}
