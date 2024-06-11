/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf, inject, isDevMode } from '@angular/core';
import { ActivatedRoute, Event, NavigationEnd, Router } from '@angular/router';
import { ConfigUtilService } from '@project/app-core-util-config';
import {
  FlowUtilService,
  AppCoreUtilFlowModule,
  UtilFlowBackButtonDisableModule
} from '@project/app-core-util-flow';
import { LoggerUtilService } from '@project/app-core-util-logger';
import { AbstractAppFeatureComponent } from '@project/app-module-api-feature';
import { filter, pairwise } from 'rxjs';
import { APP_ROUTES_CONFIG } from '../_variables/app.routes.config';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    //-----------------
    AppCoreUtilFlowModule,
    //-----------------
    // Back Button Disable
    //-----------------
    UtilFlowBackButtonDisableModule
    // ----------------
  ],
  providers: [],
  exports: []
})
export class AppFlowConfigModule {
  protected readonly logger: LoggerUtilService =
    inject<LoggerUtilService>(LoggerUtilService);

  protected readonly configService: ConfigUtilService =
    inject<ConfigUtilService>(ConfigUtilService);

  protected readonly flowService: FlowUtilService =
    inject<FlowUtilService>(FlowUtilService);

  protected readonly router: Router = inject<Router>(Router);

  protected readonly activatedRoute: ActivatedRoute =
    inject<ActivatedRoute>(ActivatedRoute);

  constructor(
    @Optional()
    @SkipSelf()
    parentModule: AppFlowConfigModule
  ) {
    if (parentModule) {
      throw new Error(
        AppFlowConfigModule.name +
          ' is already loaded. Import it in the main config module only.'
      );
    }

    this.init();
  }

  private init(): void {
    this.logger.console.debug('init');

    this.configService.set<any>('routes', APP_ROUTES_CONFIG);

    this.logger.console.debug(
      'check ' + AbstractAppFeatureComponent.name + ' feature implementation'
    );

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        pairwise()
      )
      .subscribe(([previousEvent, currentEvent]) => {
        const previousUrl = (previousEvent as NavigationEnd).url;
        const currentUrl = (currentEvent as NavigationEnd).url;

        this.flowService.saveCurrentRoute(currentUrl);
        this.flowService.saveLastRoute(previousUrl);

        window.scroll({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });

        setTimeout(() => {
          const layoutMain: Element | null = document
            .getElementsByClassName('layout-main')
            .item(0);

          if (layoutMain) {
            layoutMain.scroll({
              top: 0,
              left: 0,
              behavior: 'smooth'
            });
          }
        }, 0);
      });

    const production = !isDevMode();

    this.router.events
      .pipe(filter((evt) => evt instanceof NavigationEnd))
      .subscribe((evt: Event) => {
        let route = this.activatedRoute.firstChild;
        let child = route;
        while (child) {
          if (child.firstChild) {
            child = child.firstChild;
            route = child;
          } else {
            child = null;
          }
        }
        const component: any | null = route?.component;
        if (
          !production &&
          component &&
          !(component.prototype instanceof AbstractAppFeatureComponent)
        ) {
          const error =
            'Component [' +
            component.prototype.constructor.name +
            '] must inherit from [AbstractAppFeatureComponent]';
          this.logger.console.warn(error);
          // throwError(error);
        }
      });
  }
}
