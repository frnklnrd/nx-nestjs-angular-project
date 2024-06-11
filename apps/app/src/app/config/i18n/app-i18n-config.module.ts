/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CommonModule,
  registerLocaleData as ngRegisterLocaleData
} from '@angular/common';

import { HttpClient, HttpClientModule } from '@angular/common/http';

import ngLocaleCa from '@angular/common/locales/ca';
import ngLocaleEn from '@angular/common/locales/en';
import ngLocaleEs from '@angular/common/locales/es';

import {
  LOCALE_ID,
  NgModule,
  Optional,
  SkipSelf,
  StaticClassProvider,
  inject
} from '@angular/core';

import {
  MissingTranslationHandler,
  MissingTranslationHandlerParams,
  TranslateLoader,
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';

import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// import { Select } from '@ngxs/store';
// import { defineLocale as bsDefineLocale } from 'ngx-bootstrap/chronos';
// import { BsLocaleService } from 'ngx-bootstrap/datepicker';

/*
import {
  arLocale as bsLocaleAr,
  enGbLocale as bsLocaleEn,
  esLocale as bsLocaleEs,
} from 'ngx-bootstrap/locale';
*/

import { Store } from '@ngxs/store';
import { ConfigUtilService } from '@project/app-core-util-config';
import {
  I18nChangeCurrentLangStoreAction,
  I18nChangeDefaultLangStoreAction,
  I18nStoreState
} from '@project/app-core-util-i18n';
import { LoggerUtilService } from '@project/app-core-util-logger';
import { Buffer } from 'buffer';
import { PrimeNGConfig } from 'primeng/api';
import { APP_ENV_CONFIG } from '../_variables/app.env.config';
import { APP_I18N_CONFIG } from '../_variables/app.i18n.config';

ngRegisterLocaleData(ngLocaleEn, 'en');
ngRegisterLocaleData(ngLocaleEs, 'es');
ngRegisterLocaleData(ngLocaleCa, 'ca');

// bsDefineLocale('en-gb', bsLocaleEn);
// bsDefineLocale('es-es', bsLocaleEs);
// bsDefineLocale('es-ca', bsLocaleCa);

class CustomMissingTranslationHandler implements MissingTranslationHandler {
  constructor() {
    //
  }
  handle(params: MissingTranslationHandlerParams) {
    return `[${params.key}]`;
  }
}

export class DynamicLocaleId extends String {
  constructor(protected service: TranslateService) {
    super('');
  }

  public override toString(): string {
    return this.service.currentLang ? this.service.currentLang : 'en';
  }
}

export const LocaleProvider: StaticClassProvider = {
  provide: LOCALE_ID,
  useClass: DynamicLocaleId,
  deps: [TranslateService]
};

@NgModule({
  declarations: [],
  imports: [
    // ----------------
    CommonModule,
    // ----------------
    HttpClientModule,
    // ----------------
    TranslateModule.forRoot({
      defaultLanguage: APP_I18N_CONFIG.defaultLang,
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => {
          return new TranslateHttpLoader(
            http,
            './assets/i18n/',
            '.json?v=' +
              encodeURIComponent(
                Buffer.from(APP_ENV_CONFIG.app.version).toString('base64')
              )
          );
        },
        deps: [HttpClient]
      },
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: CustomMissingTranslationHandler,
        deps: []
      }
    })
    // ----------------
  ],
  providers: [LocaleProvider, TranslateService],
  exports: []
})
export class AppI18nConfigModule {
  protected readonly logger: LoggerUtilService =
    inject<LoggerUtilService>(LoggerUtilService);

  protected readonly configService: ConfigUtilService =
    inject<ConfigUtilService>(ConfigUtilService);

  protected readonly translate: TranslateService =
    inject<TranslateService>(TranslateService);

  protected readonly systemLangs: any = APP_I18N_CONFIG.languages;

  protected primeNgConfig: PrimeNGConfig = inject<PrimeNGConfig>(PrimeNGConfig);

  protected readonly store: Store = inject<Store>(Store);

  constructor(
    @Optional()
    @SkipSelf()
    parentModule: AppI18nConfigModule
  ) {
    if (parentModule) {
      throw new Error(
        AppI18nConfigModule.name +
          ' is already loaded. Import it in the main config module only.'
      );
    }

    this.init();
  }

  private init(): void {
    this.logger.console.debug('init');

    this.configService.set<any>('i18n', {
      defaultLang: APP_I18N_CONFIG.defaultLang,
      languages: APP_I18N_CONFIG.languages
    });

    this.logger.console.log('Set default lang', APP_I18N_CONFIG.defaultLang);

    this.translate.setDefaultLang(APP_I18N_CONFIG.defaultLang);

    this.store.dispatch([
      new I18nChangeDefaultLangStoreAction(APP_I18N_CONFIG.defaultLang)
    ]);

    // change this according to some app or user strategy

    this.translate.onLangChange.subscribe((changedLang) => {
      this.logger.console.log('Language changed!!!', changedLang.lang);

      this.store.dispatch([
        new I18nChangeCurrentLangStoreAction(changedLang.lang)
      ]);
    });

    let currentLang = this.store.selectSnapshot(
      I18nStoreState.getCurrentLanguage
    );

    if (!currentLang) {
      const browserLang = this.translate.getBrowserLang();
      currentLang = browserLang?.match(/es|ca|en/)
        ? browserLang
        : APP_I18N_CONFIG.defaultLang;
    }

    this.logger.console.log('Use current lang', currentLang);

    this.translate.use(currentLang);

    const currentLangSettings: any = this.systemLangs[currentLang];

    this.primeNgConfig.setTranslation(currentLangSettings?.primeNgLocale);
  }
}
