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
 */
import { PaginationInDto } from './paginationInDto';
import { SortInDto } from './sortInDto';

export interface SearchUsersInDto {
  pagination?: PaginationInDto;
  sort?: SortInDto;
  filter?: any;
  meta?: any;
}
