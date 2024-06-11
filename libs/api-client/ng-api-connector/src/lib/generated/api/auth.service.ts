/* eslint-disable no-control-regex */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-interface */
/**
 * API Documentation
 * API Description
 *
 * OpenAPI spec version: 0.0.1
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */ /* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
  HttpEvent
} from '@angular/common/http';
import { CustomHttpUrlEncodingCodec } from '../encoder';

import { Observable } from 'rxjs';

import { AuthTokensResultDto } from '../model/authTokensResultDto';
import { ChangePasswordInDto } from '../model/changePasswordInDto';
import { ChangePasswordResultDto } from '../model/changePasswordResultDto';
import { ProfileResultDto } from '../model/profileResultDto';
import { RefreshTokenInDto } from '../model/refreshTokenInDto';
import { ResetPasswordConfirmInDto } from '../model/resetPasswordConfirmInDto';
import { ResetPasswordRequestInDto } from '../model/resetPasswordRequestInDto';
import { ResetPasswordRequestResultDto } from '../model/resetPasswordRequestResultDto';
import { SignInDto } from '../model/signInDto';

import { BASE_PATH, COLLECTION_FORMATS } from '../variables';
import { Configuration } from '../configuration';

@Injectable()
export class AuthApiService {
  protected basePath = '/api';
  public defaultHeaders = new HttpHeaders();
  public configuration = new Configuration();

  constructor(
    protected httpClient: HttpClient,
    @Optional() @Inject(BASE_PATH) basePath: string,
    @Optional() configuration: Configuration
  ) {
    if (basePath) {
      this.basePath = basePath;
    }
    if (configuration) {
      this.configuration = configuration;
      this.basePath = basePath || configuration.basePath || this.basePath;
    }
  }

  /**
   * @param consumes string[] mime-types
   * @return true: consumes contains 'multipart/form-data', false: otherwise
   */
  private canConsumeForm(consumes: string[]): boolean {
    const form = 'multipart/form-data';
    for (const consume of consumes) {
      if (form === consume) {
        return true;
      }
    }
    return false;
  }

  /**
   *
   *
   * @param body
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public changePassword(
    body: ChangePasswordInDto,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<ChangePasswordResultDto>;
  public changePassword(
    body: ChangePasswordInDto,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<ChangePasswordResultDto>>;
  public changePassword(
    body: ChangePasswordInDto,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<ChangePasswordResultDto>>;
  public changePassword(
    body: ChangePasswordInDto,
    observe: any = 'body',
    reportProgress = false
  ): Observable<any> {
    if (body === null || body === undefined) {
      throw new Error(
        'Required parameter body was null or undefined when calling changePassword.'
      );
    }

    let headers = this.defaultHeaders;

    // authentication (bearer) required
    if (this.configuration.accessToken) {
      const accessToken =
        typeof this.configuration.accessToken === 'function'
          ? this.configuration.accessToken()
          : this.configuration.accessToken;
      headers = headers.set('Authorization', 'Bearer ' + accessToken);
    }
    // to determine the Accept header
    const httpHeaderAccepts: string[] = ['application/json'];
    const httpHeaderAcceptSelected: string | undefined =
      this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = ['application/json'];
    const httpContentTypeSelected: string | undefined =
      this.configuration.selectHeaderContentType(consumes);
    if (httpContentTypeSelected != undefined) {
      headers = headers.set('Content-Type', httpContentTypeSelected);
    }

    return this.httpClient.request<ChangePasswordResultDto>(
      'post',
      `${this.basePath}/auth/change-password`,
      {
        body: body,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  /**
   *
   *
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getProfileInfo(
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<ProfileResultDto>;
  public getProfileInfo(
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<ProfileResultDto>>;
  public getProfileInfo(
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<ProfileResultDto>>;
  public getProfileInfo(
    observe: any = 'body',
    reportProgress = false
  ): Observable<any> {
    let headers = this.defaultHeaders;

    // authentication (bearer) required
    if (this.configuration.accessToken) {
      const accessToken =
        typeof this.configuration.accessToken === 'function'
          ? this.configuration.accessToken()
          : this.configuration.accessToken;
      headers = headers.set('Authorization', 'Bearer ' + accessToken);
    }
    // to determine the Accept header
    const httpHeaderAccepts: string[] = ['application/json'];
    const httpHeaderAcceptSelected: string | undefined =
      this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [];

    return this.httpClient.request<ProfileResultDto>(
      'get',
      `${this.basePath}/auth/profile`,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  /**
   *
   *
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public logout(
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<boolean>;
  public logout(
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<boolean>>;
  public logout(
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<boolean>>;
  public logout(
    observe: any = 'body',
    reportProgress = false
  ): Observable<any> {
    let headers = this.defaultHeaders;

    // authentication (bearer) required
    if (this.configuration.accessToken) {
      const accessToken =
        typeof this.configuration.accessToken === 'function'
          ? this.configuration.accessToken()
          : this.configuration.accessToken;
      headers = headers.set('Authorization', 'Bearer ' + accessToken);
    }
    // to determine the Accept header
    const httpHeaderAccepts: string[] = ['application/json'];
    const httpHeaderAcceptSelected: string | undefined =
      this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [];

    return this.httpClient.request<boolean>(
      'get',
      `${this.basePath}/auth/logout`,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  /**
   *
   *
   * @param body
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public refreshToken(
    body: RefreshTokenInDto,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<AuthTokensResultDto>;
  public refreshToken(
    body: RefreshTokenInDto,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<AuthTokensResultDto>>;
  public refreshToken(
    body: RefreshTokenInDto,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<AuthTokensResultDto>>;
  public refreshToken(
    body: RefreshTokenInDto,
    observe: any = 'body',
    reportProgress = false
  ): Observable<any> {
    if (body === null || body === undefined) {
      throw new Error(
        'Required parameter body was null or undefined when calling refreshToken.'
      );
    }

    let headers = this.defaultHeaders;

    // authentication (bearer) required
    if (this.configuration.accessToken) {
      const accessToken =
        typeof this.configuration.accessToken === 'function'
          ? this.configuration.accessToken()
          : this.configuration.accessToken;
      headers = headers.set('Authorization', 'Bearer ' + accessToken);
    }
    // to determine the Accept header
    const httpHeaderAccepts: string[] = ['application/json'];
    const httpHeaderAcceptSelected: string | undefined =
      this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = ['application/json'];
    const httpContentTypeSelected: string | undefined =
      this.configuration.selectHeaderContentType(consumes);
    if (httpContentTypeSelected != undefined) {
      headers = headers.set('Content-Type', httpContentTypeSelected);
    }

    return this.httpClient.request<AuthTokensResultDto>(
      'post',
      `${this.basePath}/auth/refresh-token`,
      {
        body: body,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  /**
   *
   *
   * @param body
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public resetPasswordConfirm(
    body: ResetPasswordConfirmInDto,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<ResetPasswordRequestResultDto>;
  public resetPasswordConfirm(
    body: ResetPasswordConfirmInDto,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<ResetPasswordRequestResultDto>>;
  public resetPasswordConfirm(
    body: ResetPasswordConfirmInDto,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<ResetPasswordRequestResultDto>>;
  public resetPasswordConfirm(
    body: ResetPasswordConfirmInDto,
    observe: any = 'body',
    reportProgress = false
  ): Observable<any> {
    if (body === null || body === undefined) {
      throw new Error(
        'Required parameter body was null or undefined when calling resetPasswordConfirm.'
      );
    }

    let headers = this.defaultHeaders;

    // authentication (bearer) required
    if (this.configuration.accessToken) {
      const accessToken =
        typeof this.configuration.accessToken === 'function'
          ? this.configuration.accessToken()
          : this.configuration.accessToken;
      headers = headers.set('Authorization', 'Bearer ' + accessToken);
    }
    // to determine the Accept header
    const httpHeaderAccepts: string[] = ['application/json'];
    const httpHeaderAcceptSelected: string | undefined =
      this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = ['application/json'];
    const httpContentTypeSelected: string | undefined =
      this.configuration.selectHeaderContentType(consumes);
    if (httpContentTypeSelected != undefined) {
      headers = headers.set('Content-Type', httpContentTypeSelected);
    }

    return this.httpClient.request<ResetPasswordRequestResultDto>(
      'post',
      `${this.basePath}/auth/reset-password/confirm`,
      {
        body: body,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  /**
   *
   *
   * @param body
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public resetPasswordRequest(
    body: ResetPasswordRequestInDto,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<ResetPasswordRequestResultDto>;
  public resetPasswordRequest(
    body: ResetPasswordRequestInDto,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<ResetPasswordRequestResultDto>>;
  public resetPasswordRequest(
    body: ResetPasswordRequestInDto,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<ResetPasswordRequestResultDto>>;
  public resetPasswordRequest(
    body: ResetPasswordRequestInDto,
    observe: any = 'body',
    reportProgress = false
  ): Observable<any> {
    if (body === null || body === undefined) {
      throw new Error(
        'Required parameter body was null or undefined when calling resetPasswordRequest.'
      );
    }

    let headers = this.defaultHeaders;

    // to determine the Accept header
    const httpHeaderAccepts: string[] = ['application/json'];
    const httpHeaderAcceptSelected: string | undefined =
      this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = ['application/json'];
    const httpContentTypeSelected: string | undefined =
      this.configuration.selectHeaderContentType(consumes);
    if (httpContentTypeSelected != undefined) {
      headers = headers.set('Content-Type', httpContentTypeSelected);
    }

    return this.httpClient.request<ResetPasswordRequestResultDto>(
      'post',
      `${this.basePath}/auth/reset-password/request`,
      {
        body: body,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  /**
   *
   *
   * @param body
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public signIn(
    body: SignInDto,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<AuthTokensResultDto>;
  public signIn(
    body: SignInDto,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<AuthTokensResultDto>>;
  public signIn(
    body: SignInDto,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<AuthTokensResultDto>>;
  public signIn(
    body: SignInDto,
    observe: any = 'body',
    reportProgress = false
  ): Observable<any> {
    if (body === null || body === undefined) {
      throw new Error(
        'Required parameter body was null or undefined when calling signIn.'
      );
    }

    let headers = this.defaultHeaders;

    // to determine the Accept header
    const httpHeaderAccepts: string[] = ['application/json'];
    const httpHeaderAcceptSelected: string | undefined =
      this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = ['application/json'];
    const httpContentTypeSelected: string | undefined =
      this.configuration.selectHeaderContentType(consumes);
    if (httpContentTypeSelected != undefined) {
      headers = headers.set('Content-Type', httpContentTypeSelected);
    }

    return this.httpClient.request<AuthTokensResultDto>(
      'post',
      `${this.basePath}/auth/login`,
      {
        body: body,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }
}
