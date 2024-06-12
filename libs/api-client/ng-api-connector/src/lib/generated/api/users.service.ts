/* eslint-disable no-control-regex */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-interface */
/**
 * API Documentation
 * API Description.<br/><br/>Download the api docs file in JSON format <a target=\"_blank\" href=\"/api/docs/swagger.json\">here</a>.<br/><br/>Download the api docs file in YAML format <a target=\"_blank\" href=\"/api/docs/swagger.yaml\">here</a>.
 *
 * OpenAPI spec version: 0.0.2
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

import { CreateUserInDto } from '../model/createUserInDto';
import { PaginatedSearchResultDto } from '../model/paginatedSearchResultDto';
import { SearchUsersInDto } from '../model/searchUsersInDto';
import { SetPasswordInDto } from '../model/setPasswordInDto';
import { UpdateUserInDto } from '../model/updateUserInDto';
import { UserOutDto } from '../model/userOutDto';

import { BASE_PATH, COLLECTION_FORMATS } from '../variables';
import { Configuration } from '../configuration';

@Injectable()
export class UsersApiService {
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
  public createUser(
    body: CreateUserInDto,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<UserOutDto>;
  public createUser(
    body: CreateUserInDto,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<UserOutDto>>;
  public createUser(
    body: CreateUserInDto,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<UserOutDto>>;
  public createUser(
    body: CreateUserInDto,
    observe: any = 'body',
    reportProgress = false
  ): Observable<any> {
    if (body === null || body === undefined) {
      throw new Error(
        'Required parameter body was null or undefined when calling createUser.'
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

    return this.httpClient.request<UserOutDto>(
      'post',
      `${this.basePath}/v1/users`,
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
   * @param id
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public findOneUser(
    id: string,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<any>;
  public findOneUser(
    id: string,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<any>>;
  public findOneUser(
    id: string,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<any>>;
  public findOneUser(
    id: string,
    observe: any = 'body',
    reportProgress = false
  ): Observable<any> {
    if (id === null || id === undefined) {
      throw new Error(
        'Required parameter id was null or undefined when calling findOneUser.'
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
    const httpHeaderAccepts: string[] = [];
    const httpHeaderAcceptSelected: string | undefined =
      this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [];

    return this.httpClient.request<any>(
      'get',
      `${this.basePath}/v1/users/${encodeURIComponent(String(id))}`,
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
   * @param id
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public removeUser(
    id: string,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<any>;
  public removeUser(
    id: string,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<any>>;
  public removeUser(
    id: string,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<any>>;
  public removeUser(
    id: string,
    observe: any = 'body',
    reportProgress = false
  ): Observable<any> {
    if (id === null || id === undefined) {
      throw new Error(
        'Required parameter id was null or undefined when calling removeUser.'
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
    const httpHeaderAccepts: string[] = [];
    const httpHeaderAcceptSelected: string | undefined =
      this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [];

    return this.httpClient.request<any>(
      'delete',
      `${this.basePath}/v1/users/${encodeURIComponent(String(id))}`,
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
  public searchPaginated(
    body: SearchUsersInDto,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<PaginatedSearchResultDto>;
  public searchPaginated(
    body: SearchUsersInDto,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<PaginatedSearchResultDto>>;
  public searchPaginated(
    body: SearchUsersInDto,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<PaginatedSearchResultDto>>;
  public searchPaginated(
    body: SearchUsersInDto,
    observe: any = 'body',
    reportProgress = false
  ): Observable<any> {
    if (body === null || body === undefined) {
      throw new Error(
        'Required parameter body was null or undefined when calling searchPaginated.'
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

    return this.httpClient.request<PaginatedSearchResultDto>(
      'post',
      `${this.basePath}/v1/users/search/paginated`,
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
   * @param id
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public setPassword(
    body: SetPasswordInDto,
    id: string,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<any>;
  public setPassword(
    body: SetPasswordInDto,
    id: string,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<any>>;
  public setPassword(
    body: SetPasswordInDto,
    id: string,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<any>>;
  public setPassword(
    body: SetPasswordInDto,
    id: string,
    observe: any = 'body',
    reportProgress = false
  ): Observable<any> {
    if (body === null || body === undefined) {
      throw new Error(
        'Required parameter body was null or undefined when calling setPassword.'
      );
    }

    if (id === null || id === undefined) {
      throw new Error(
        'Required parameter id was null or undefined when calling setPassword.'
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
    const httpHeaderAccepts: string[] = [];
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

    return this.httpClient.request<any>(
      'patch',
      `${this.basePath}/v1/users/${encodeURIComponent(
        String(id)
      )}/set-password`,
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
   * @param id
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public updateUser(
    body: UpdateUserInDto,
    id: string,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<any>;
  public updateUser(
    body: UpdateUserInDto,
    id: string,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<any>>;
  public updateUser(
    body: UpdateUserInDto,
    id: string,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<any>>;
  public updateUser(
    body: UpdateUserInDto,
    id: string,
    observe: any = 'body',
    reportProgress = false
  ): Observable<any> {
    if (body === null || body === undefined) {
      throw new Error(
        'Required parameter body was null or undefined when calling updateUser.'
      );
    }

    if (id === null || id === undefined) {
      throw new Error(
        'Required parameter id was null or undefined when calling updateUser.'
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
    const httpHeaderAccepts: string[] = [];
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

    return this.httpClient.request<any>(
      'patch',
      `${this.basePath}/v1/users/${encodeURIComponent(String(id))}`,
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
