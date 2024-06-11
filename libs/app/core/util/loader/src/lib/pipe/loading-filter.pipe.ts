/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pipe, PipeTransform, inject } from '@angular/core';
import { Observable, distinctUntilChanged, filter } from 'rxjs';
import { LoaderUtilService } from '../service/loader-util.service';

@Pipe({
  name: 'loadingFilter',
  standalone: true,
  pure: true
})
export class LoadingFilterPipe implements PipeTransform {
  protected readonly loader: LoaderUtilService =
    inject<LoaderUtilService>(LoaderUtilService);
  transform(
    value: Observable<boolean>,
    key: string | null = null
  ): Observable<boolean> {
    return value?.pipe(
      filter((loading) => {
        if (key) {
          if (loading) {
            return this.loader.isLoading(key);
          } /* if (!loading) */ else {
            return !this.loader.isLoading(key);
          }
        } /* if (!key) */ else {
          return true;
        }
      }),
      distinctUntilChanged()
    );
  }
}
