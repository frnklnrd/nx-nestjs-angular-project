/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { LoggerUtilService } from '@project/app-core-util-logger';
import { ConfigSetKeyValueStoreAction } from '../store/config-store.action';
import { ConfigStoreState } from '../store/config-store.state';

@Injectable()
export class ConfigUtilService {
  protected readonly logger: LoggerUtilService =
    inject<LoggerUtilService>(LoggerUtilService);

  protected readonly store: Store = inject<Store>(Store);

  constructor() {
    //
  }

  public set<T>(key: string, value: T): void {
    this.logger.console.debug('set', key, value);
    this.store.dispatch(new ConfigSetKeyValueStoreAction(key, value));
  }

  public get<T>(key: string): T | null {
    this.logger.console.debug('get', key);
    const configValue = this.store.selectSnapshot(ConfigStoreState.getState);
    let value = configValue;
    const keyParts = key.split('.');
    keyParts.forEach((keyPart) => {
      value = value ? value[keyPart] : null;
    });
    return value ? value : null;
  }

  public getAppRoute(key: string): string | null {
    this.logger.console.debug('getAppRoute', key);
    const configValue = this.store.selectSnapshot(ConfigStoreState.getState);
    return configValue?.routes[key];
  }
}
