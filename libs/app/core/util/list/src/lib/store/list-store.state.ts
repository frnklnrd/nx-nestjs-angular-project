import { Injectable, inject } from '@angular/core';

import {
  Action,
  State,
  StateContext,
  Store,
  createSelector
} from '@ngxs/store';

import { LIST_STATE_TOKEN } from '../variable/variables';

import { TranslateService } from '@ngx-translate/core';
import {
  ListResetAllStoreAction,
  ListResetKeyDataStoreAction,
  ListSetKeyDataStoreAction
} from './list-store.action';
import { ListStoreModel } from './list-store.model';

@State<ListStoreModel>({
  name: LIST_STATE_TOKEN,
  defaults: {}
})
@Injectable()
export class ListStoreState {
  //-------------------------------------------------------------------------------------

  protected store: Store = inject<Store>(Store);

  protected translate: TranslateService =
    inject<TranslateService>(TranslateService);

  //-------------------------------------------------------------------------------------

  static getListSelector(key: string, lang: string) {
    return createSelector([ListStoreState], (state: ListStoreModel) => {
      if (!state[lang]) {
        return null;
      }

      if (!state[lang][key.toLocaleLowerCase()]) {
        return null;
      }

      const stored = state[lang][key.toLocaleLowerCase()];

      if (stored) {
        const expirationDate = new Date(
          new Date(stored.updatedAt).getTime() +
            Number.parseInt('' + stored.expiresIn)
        );

        const now = Date.now();

        const diff = expirationDate.getTime() - now;

        if (diff > 5 * 60 * 1000) {
          return stored.data;
        }

        return null;
      }

      return null;
    });
  }

  //-------------------------------------------------------------------------------------

  @Action(ListSetKeyDataStoreAction)
  setKeyDataStoreAction(
    ctx: StateContext<ListStoreModel>,
    action: ListSetKeyDataStoreAction
  ): void {
    const state = ctx.getState();

    const patch = JSON.parse(JSON.stringify(state));

    const currentLang = this.translate.currentLang
      ? this.translate.currentLang
      : this.translate.defaultLang;

    if (!patch[currentLang]) {
      patch[currentLang] = {};
    }

    patch[currentLang][action.key.toLocaleLowerCase()] = {
      updatedAt: new Date().toISOString(),
      expiresIn: 24 * 60 * 60 * 1000,
      data: action.data
    };

    ctx.patchState(patch);
  }

  @Action(ListResetKeyDataStoreAction)
  resetKeyDataStoreAction(
    ctx: StateContext<ListStoreModel>,
    action: ListResetKeyDataStoreAction
  ): void {
    const state = ctx.getState();

    const patch = JSON.parse(JSON.stringify(state));

    const currentLang = this.translate.currentLang
      ? this.translate.currentLang
      : this.translate.defaultLang;

    if (!patch[currentLang]) {
      patch[currentLang] = {};
    }

    patch[currentLang][action.key.toLocaleLowerCase()] = {
      updatedAt: new Date().toISOString(),
      expiresIn: 24 * 60 * 60 * 1000,
      data: null
    };

    ctx.patchState(patch);
  }

  @Action(ListResetAllStoreAction)
  resetAllStoreAction(
    ctx: StateContext<ListStoreModel>,
    action: ListResetAllStoreAction
  ): void {
    const state = ctx.getState();
    const currentLang = this.translate.currentLang
      ? this.translate.currentLang
      : this.translate.defaultLang;

    if (!state[currentLang] && action.allLang) {
      state[currentLang] = {};
    }

    ctx.patchState(state);
  }

  //-------------------------------------------------------------------------------------
}
