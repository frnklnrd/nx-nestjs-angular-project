/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, inject } from '@angular/core';

import { Action, Selector, State, StateContext, Store } from '@ngxs/store';

import { I18N_STATE_TOKEN } from '../variable/variables';

import { ConfigUtilService } from '@project/app-core-util-config';
import {
  I18nChangeCurrentLangStoreAction,
  I18nChangeDefaultLangStoreAction
} from './i18n-store.action';
import { I18nStoreModel } from './i18n-store.model';

@State<I18nStoreModel>({
  name: I18N_STATE_TOKEN,
  defaults: {
    defaultLanguage: 'es',
    currentLanguage: 'es',
    textDirection: 'ltr',
    textDirectionInverted: false
  }
})
@Injectable()
export class I18nStoreState {
  // --------------------------------------------------------------
  protected store: Store = inject<Store>(Store);

  protected readonly configService: ConfigUtilService =
    inject<ConfigUtilService>(ConfigUtilService);

  // --------------------------------------------------------------

  protected get languagesConfig(): any {
    return this.configService.get<any>('i18n.languages');
  }

  // --------------------------------------------------------------

  @Selector()
  static getDefaultLanguage(state: I18nStoreModel): string {
    return state.defaultLanguage;
  }

  @Selector()
  static getCurrentLanguage(state: I18nStoreModel): string {
    return state.currentLanguage;
  }

  @Selector()
  static getTextDirection(state: I18nStoreModel): string {
    return state.textDirection;
  }

  @Selector()
  static getTextDirectionInverted(state: I18nStoreModel): boolean {
    return state.textDirectionInverted;
  }

  //-------------------------------------------------------------------------------------

  @Action(I18nChangeDefaultLangStoreAction)
  changeDefaultLanguage(
    ctx: StateContext<I18nStoreModel>,
    action: I18nChangeDefaultLangStoreAction
  ): void {
    // const state = ctx.getState();
    ctx.patchState({
      defaultLanguage: action.lang
    });
    // this.updateByCurrentLang(ctx, action.lang);
  }

  @Action(I18nChangeCurrentLangStoreAction)
  changeCurrentLanguage(
    ctx: StateContext<I18nStoreModel>,
    action: I18nChangeCurrentLangStoreAction
  ): void {
    // const state = ctx.getState();
    ctx.patchState({
      currentLanguage: action.lang
    });
    this.updateByCurrentLang(ctx, action.lang);
  }

  /*
  @Action(I18nChangeDateFormatStoreAction)
  changeAppDateFormat(
    ctx: StateContext<I18nStoreModel>,
    action: I18nChangeDateFormatStoreAction
  ): void {
    // const state = ctx.getState();
    ctx.patchState({
      dateFormat: action.dateFormat,
    });
  }

  @Action(I18nChangeTextDirectionStoreAction)
  changeAppTextDirection(
    ctx: StateContext<I18nStoreModel>,
    action: I18nChangeTextDirectionStoreAction
  ): void {
    // const state = ctx.getState();
    ctx.patchState({
      textDirection: action.textDirection,
    });
  }

  @Action(I18nChangeTextDirectionInvertedStoreAction)
  changeTextDirectionInverted(
    ctx: StateContext<I18nStoreModel>,
    action: I18nChangeTextDirectionInvertedStoreAction
  ) {
    // const state = ctx.getState();
    ctx.patchState({
      textDirectionInverted: action.textDirectionInverted,
    });
  }
  */

  //-------------------------------------------------------------------------------------

  protected updateByCurrentLang(
    ctx: StateContext<I18nStoreModel>,
    useLang: string
  ): void {
    let useLanguageConfig = this.languagesConfig[useLang];

    if (!useLanguageConfig) {
      const defaultLang = Object.keys(this.languagesConfig).find(
        (lang) => this.languagesConfig[lang].default
      );
      useLanguageConfig =
        this.languagesConfig[defaultLang ? defaultLang : 'es'];
    }

    // const state = ctx.getState();

    if (useLanguageConfig) {
      ctx.patchState({
        textDirection: useLanguageConfig?.textDirection,
        textDirectionInverted: useLanguageConfig?.textDirection !== 'ltr'
      });
    }
  }
}
