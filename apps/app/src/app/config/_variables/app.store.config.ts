/* eslint-disable @typescript-eslint/no-explicit-any */
// import { AuthStoreState } from '@afinancegroup/atemporal-crm-core-auth';
// import { CachedStoreState } from '@afinancegroup/atemporal-crm-core-cached';
// import { ListStoreState } from '@afinancegroup/atemporal-crm-core-list';
import { Injectable } from '@angular/core';

import { State } from '@ngxs/store';
import { AuthStoreState } from '@project/app-core-auth-store';
import { CachedStoreState } from '@project/app-core-util-cached';
import { ConfigStoreState } from '@project/app-core-util-config';
import { I18nStoreState } from '@project/app-core-util-i18n';
import { ListStoreState } from '@project/app-core-util-list';

@State<any>({
  name: 'app',
  defaults: {},
  children: []
})
@Injectable()
export class AppStoreState {}

export const APP_STATE_ALL_CONFIG = [
  AppStoreState,
  // ---------------------
  ConfigStoreState,
  // ---------------------
  AuthStoreState,
  // ---------------------
  I18nStoreState,
  // ---------------------
  ListStoreState,
  // ---------------------
  CachedStoreState
  // ---------------------
].reverse();

export const APP_STATE_KEYS_TO_STORAGE_CONFIG = [
  // ---------------------
  'auth.logged',
  'auth.loggedAt',
  // 'auth.loadedFromStore',
  'auth.accessToken',
  'auth.refreshToken',
  'auth.userData',
  'auth.userPermissions',
  // ---------------------
  'i18n.defaultLanguage',
  'i18n.currentLanguage',
  // 'i18n.dateFormat',
  // 'i18n.textDirection',
  // 'i18n.textDirectionInverted',
  // ---------------------
  // 'list.es',
  // 'list.en',
  // 'list.ca',
  // ---------------------
  'cached'
  // ---------------------
];
