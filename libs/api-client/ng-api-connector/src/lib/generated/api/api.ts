/* eslint-disable no-control-regex */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-interface */
export * from './auth.service';
import { AuthApiService } from './auth.service';
export * from './users.service';
import { UsersApiService } from './users.service';
export const APIS = [AuthApiService, UsersApiService];
