import { Injectable, inject } from '@angular/core';
import { LoggerUtilService } from '@project/app-core-util-logger';
import {
  BehaviorSubject,
  Observable,
  distinctUntilChanged,
  filter
} from 'rxjs';

@Injectable()
export class LoaderUtilService {
  protected readonly logger: LoggerUtilService =
    inject<LoggerUtilService>(LoggerUtilService);

  private static __loading: Map<string, boolean> = new Map<string, boolean>();

  private static __loading$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public start(key: string): void {
    if (key && key !== '') {
      this.logger.console.debug('start', '[' + key.toLocaleLowerCase() + ']');
      LoaderUtilService.__loading.set(key.toLocaleLowerCase(), true);
      this.checkAndEmitLoading();
    }
  }

  public stop(key: string, delay = 0): void {
    if (
      key &&
      key !== '' &&
      LoaderUtilService.__loading.has(key.toLocaleLowerCase())
    ) {
      setTimeout(() => {
        this.logger.console.debug(
          'stop',
          '[' + key.toLocaleLowerCase() + ']',
          delay
        );
        LoaderUtilService.__loading.delete(key.toLocaleLowerCase());
        this.checkAndEmitLoading();
      }, delay);
    }
  }

  public clear(delay = 0): void {
    setTimeout(() => {
      this.logger.console.debug('clear', delay);
      LoaderUtilService.__loading.clear();
      this.checkAndEmitLoading();
    }, delay);
  }

  private checkAndEmitLoading(): void {
    this.logger.console.debug(
      'loading',
      Object.fromEntries(LoaderUtilService.__loading)
    );
    this.logger.console.debug('loading$', LoaderUtilService.__loading.size > 0);

    setTimeout(
      () => {
        LoaderUtilService.__loading$.next(LoaderUtilService.__loading.size > 0);
      },
      LoaderUtilService.__loading.size > 0 ? 0 : 200
    );
  }

  public isLoading(key: string | null = null): boolean {
    return key
      ? LoaderUtilService.__loading.has(key.toLocaleLowerCase())
      : LoaderUtilService.__loading.size > 0;
  }

  public getObservable(key: string | null = null): Observable<boolean> {
    return LoaderUtilService.__loading$.pipe(
      filter((loading) => {
        if (key) {
          if (loading) {
            return this.isLoading(key);
          } /* if (!loading) */ else {
            return !this.isLoading(key);
          }
        } /* if (!key) */ else {
          return true;
        }
      }),
      distinctUntilChanged()
    );
  }
}
