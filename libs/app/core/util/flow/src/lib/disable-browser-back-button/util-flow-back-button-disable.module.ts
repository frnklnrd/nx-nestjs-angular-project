/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { inject, NgModule, Optional, SkipSelf } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { BackButtonDisableModule } from './extended/public_api';

@NgModule({
  imports: [
    CommonModule,
    BackButtonDisableModule.forRoot({
      preserveScrollPosition: true
    })
  ],
  exports: [CommonModule]
})
export class UtilFlowBackButtonDisableModule {
  protected readonly __logger: NGXLogger = inject<NGXLogger>(NGXLogger);

  constructor(
    @Optional()
    @SkipSelf()
    parentModule: UtilFlowBackButtonDisableModule
  ) {
    if (parentModule) {
      throw new Error(
        UtilFlowBackButtonDisableModule.name +
          ' is already loaded. Import it in the main config module only.'
      );
    }

    this.init();
  }

  private init(): void {
    this.__logger.debug('init');

    window.addEventListener('popstate', ($event) => {
      $event.preventDefault();
      $event.stopPropagation();
      this.__logger.debug('Window -> popstate event fired!!!');
      if ((window as any)._popstateEventListenerBlocked === true) {
        this.__logger.debug('Window -> popstate event blocked!!!');
      } else {
        this.__logger.debug('Window -> popstate event not blocked !!!');
      }
    });
  }
}
