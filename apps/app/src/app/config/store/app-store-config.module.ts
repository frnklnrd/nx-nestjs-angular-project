import { CommonModule } from '@angular/common';
import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
  inject,
  isDevMode
} from '@angular/core';

import { NgxsSelectSnapshotModule } from '@ngxs-labs/select-snapshot';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsStoragePluginModule, STORAGE_ENGINE } from '@ngxs/storage-plugin';
import { NgxsModule, getActionTypeFromInstance } from '@ngxs/store';

import { LoggerUtilService } from '@project/app-core-util-logger';
import {
  AppCoreUtilStorageModule,
  StorageUtilService,
  UTIL_STORE_STORAGE_PREFIX_KEY_TOKEN,
  UTIL_STORE_STORAGE_USE_CRYPTO_FOR_KEYS_TOKEN,
  UTIL_STORE_STORAGE_USE_CRYPTO_FOR_VALUES_TOKEN
} from '@project/app-core-util-storage';
import {
  APP_STATE_ALL_CONFIG,
  APP_STATE_KEYS_TO_STORAGE_CONFIG
} from '../_variables/app.store.config';

import {
  NavigationActionTiming,
  NgxsRouterPluginModule
} from '@ngxs/router-plugin';
import { APP_ENV_CONFIG } from '../_variables/app.env.config';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pluginModulesForDevMode: ModuleWithProviders<any>[] = [];

if (isDevMode()) {
  pluginModulesForDevMode.push(
    NgxsReduxDevtoolsPluginModule.forRoot({
      disabled: !isDevMode()
    })
  );

  pluginModulesForDevMode.push(
    NgxsLoggerPluginModule.forRoot({
      disabled: !isDevMode(),
      collapsed: true,
      filter: (action) => {
        const actionName: string | undefined =
          getActionTypeFromInstance(action);
        return actionName
          ? /* actionName.indexOf('@@INIT') === -1 && */
            /* actionName.indexOf('@@UPDATE_STATE') === -1 && */
            /*  actionName.indexOf('[Router]') === -1 && */
            /* actionName.indexOf('[TRANSLATION]') === -1 && */
            /*  actionName.indexOf('[AUTH]') === -1 */
            true
          : true;
      }
    })
  );
}

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    //-----------------
    NgxsModule.forRoot([...APP_STATE_ALL_CONFIG], {
      developmentMode: isDevMode()
    }),
    // ---------------------------
    NgxsStoragePluginModule.forRoot({
      key: [...APP_STATE_KEYS_TO_STORAGE_CONFIG]
      // deserialize: JSON.parse,
      // serialize: JSON.stringify
    }),
    // ---------------------------
    NgxsRouterPluginModule.forRoot({
      navigationActionTiming: NavigationActionTiming.PostActivation
    }),
    // ---------------------------
    NgxsSelectSnapshotModule.forRoot(),
    // ---------------------------
    ...pluginModulesForDevMode,
    // ---------------------------
    AppCoreUtilStorageModule
    // ---------------------------
  ],
  providers: [
    {
      provide: UTIL_STORE_STORAGE_PREFIX_KEY_TOKEN,
      useValue: APP_ENV_CONFIG.storage.prefixKey
    },
    {
      provide: UTIL_STORE_STORAGE_USE_CRYPTO_FOR_KEYS_TOKEN,
      useValue: APP_ENV_CONFIG.storage.useCryptoForKeys
    },
    {
      provide: UTIL_STORE_STORAGE_USE_CRYPTO_FOR_VALUES_TOKEN,
      useValue: APP_ENV_CONFIG.storage.useCryptoForValues
    },
    {
      provide: STORAGE_ENGINE,
      useExisting: StorageUtilService
    }
  ],
  exports: []
})
export class AppStoreConfigModule {
  protected readonly logger: LoggerUtilService =
    inject<LoggerUtilService>(LoggerUtilService);

  constructor(
    @Optional()
    @SkipSelf()
    parentModule: AppStoreConfigModule
  ) {
    if (parentModule) {
      throw new Error(
        AppStoreConfigModule +
          ' is already loaded. Import it in the main config module only.'
      );
    }
    this.init();
  }

  private init(): void {
    this.logger.console.debug('init');
  }
}
