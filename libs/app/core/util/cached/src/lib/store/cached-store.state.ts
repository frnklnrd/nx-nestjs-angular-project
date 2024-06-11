/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, inject } from '@angular/core';

import {
  Action,
  State,
  StateContext,
  Store,
  createSelector
} from '@ngxs/store';

import { CACHED_STATE_TOKEN } from '../variable/variables';

import {
  CachedResetAllStoreAction,
  CachedResetKeyDataStoreAction,
  CachedSetKeyDataStoreAction
} from './cached-store.action';
import { CachedStoreModel } from './cached-store.model';

@State<CachedStoreModel>({
  name: CACHED_STATE_TOKEN,
  defaults: {}
})
@Injectable()
export class CachedStoreState {
  //-------------------------------------------------------------------------------------

  protected store: Store = inject<Store>(Store);

  //-------------------------------------------------------------------------------------

  static getDefaultData() {
    return {};
  }

  static getDefaultSearchData() {
    return {
      showAdvancedSearchFilters: false,
      globalFilter: '',
      orderBy: 'CREATION_DATE',
      sortOrder: 'DESC',
      page: 0,
      pageSize: 10
    };
  }

  //-------------------------------------------------------------------------------------

  static getCachedSelector(key: string) {
    return createSelector([CachedStoreState], (state: CachedStoreModel) => {
      const stored = state[key.toLocaleLowerCase()];
      return stored && stored.data
        ? stored.data
        : CachedStoreState.getDefaultData();
    });
  }

  static getSearchCachedSelector(key: string) {
    return createSelector([CachedStoreState], (state: CachedStoreModel) => {
      const stored = state[key.toLocaleLowerCase()];
      return stored && stored.data
        ? stored.data
        : CachedStoreState.getDefaultSearchData();
    });
  }

  //-------------------------------------------------------------------------------------

  @Action(CachedSetKeyDataStoreAction)
  setKeyDataStoreAction(
    ctx: StateContext<CachedStoreModel>,
    action: CachedSetKeyDataStoreAction
  ): void {
    const state = ctx.getState();

    const patch = JSON.parse(JSON.stringify(state));

    patch[action.key.toLocaleLowerCase()] = {
      updatedAt: new Date().toISOString(),
      /*expiresIn: 24 * 60 * 60 * 1000,*/
      data: Object.assign({}, action.data)
    };

    ctx.patchState(patch);
  }

  @Action(CachedResetKeyDataStoreAction)
  resetKeyDataStoreAction(
    ctx: StateContext<CachedStoreModel>,
    action: CachedResetKeyDataStoreAction
  ): void {
    const state = ctx.getState();

    const patch = JSON.parse(JSON.stringify(state));

    patch[action.key.toLocaleLowerCase()] = {
      updatedAt: new Date().toISOString(),
      /*expiresIn: 24 * 60 * 60 * 1000,*/
      data: null
    };

    ctx.patchState(patch);
  }

  @Action(CachedResetAllStoreAction)
  resetAllStoreAction(
    ctx: StateContext<CachedStoreModel>,
    action: CachedResetAllStoreAction
  ): void {
    const state = ctx.getState();
    ctx.patchState({});
  }

  //-------------------------------------------------------------------------------------
}
