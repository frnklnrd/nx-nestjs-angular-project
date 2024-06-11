/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf, inject } from '@angular/core';
import {
  ActivatedRoute,
  NavigationCancel,
  NavigationEnd,
  NavigationStart,
  Router
} from '@angular/router';
import {
  AppCoreUtilLoaderModule,
  LoaderUtilService
} from '@project/app-core-util-loader';
import { LoggerUtilService } from '@project/app-core-util-logger';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';

@NgModule({
  declarations: [],
  imports: [
    // ---------------------
    CommonModule,
    // ---------------------
    NgxLoadingModule.forRoot({
      backdropBorderRadius: '3px',
      animationType: ngxLoadingAnimationTypes.threeBounce, //
      primaryColour: '#609af8',
      secondaryColour: '#609af8',
      tertiaryColour: '#609af8'
      /*
      ngxLoadingAnimationTypes.wanderingCubes,
      backdropBackgroundColour: "rgba(0,0,0,0.1)",
      backdropBorderRadius: "4px",
      primaryColour: "#ffffff",
      secondaryColour: "#ffffff",
      tertiaryColour: "#ffffff",
      */
    }),
    // ---------------------
    AppCoreUtilLoaderModule
    // ---------------------
  ],
  providers: [],
  exports: [AppCoreUtilLoaderModule, NgxLoadingModule]
})
export class AppLoaderConfigModule {
  protected readonly logger: LoggerUtilService =
    inject<LoggerUtilService>(LoggerUtilService);

  protected readonly loader: LoaderUtilService =
    inject<LoaderUtilService>(LoaderUtilService);

  protected router: Router = inject<Router>(Router);

  protected route: ActivatedRoute = inject<ActivatedRoute>(ActivatedRoute);

  constructor(
    @Optional()
    @SkipSelf()
    parentModule: AppLoaderConfigModule
  ) {
    if (parentModule) {
      throw new Error(
        AppLoaderConfigModule +
          ' is already loaded. Import it in the main config module only.'
      );
    }
    this.init();
  }

  private init(): void {
    this.logger.console.debug('init');

    this.router.events.subscribe(($event) => {
      if ($event instanceof NavigationStart) {
        this.loader.start('app-navigation-flow');
        return;
      }
      if ($event instanceof NavigationCancel) {
        this.loader.stop('app-navigation-flow', 200);
        return;
      }
      if ($event instanceof NavigationEnd) {
        this.loader.stop('app-navigation-flow', 200);
        return;
      }
    });
  }
}
