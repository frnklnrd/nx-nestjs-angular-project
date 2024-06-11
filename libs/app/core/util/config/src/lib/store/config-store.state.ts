/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';

import { Action, Selector, State, StateContext } from '@ngxs/store';

import { CONFIG_STATE_TOKEN } from '../variable/variables';

import { ConfigSetKeyValueStoreAction } from './config-store.action';
import { ConfigStoreModel } from './config-store.model';

@State<ConfigStoreModel>({
  name: CONFIG_STATE_TOKEN,
  defaults: {}
})
@Injectable()
export class ConfigStoreState {
  // --------------------------------------------------------------

  @Selector()
  static getState(state: ConfigStoreState): any {
    return state;
  }

  // --------------------------------------------------------------

  @Action(ConfigSetKeyValueStoreAction)
  loadKeyValue(
    ctx: StateContext<ConfigStoreState>,
    action: ConfigSetKeyValueStoreAction
  ): void {
    const state = ctx.getState();

    const patchValue = JSON.parse(JSON.stringify(state));

    patchValue[action.key] = Object.assign(
      {},
      patchValue && patchValue[action.key] ? patchValue[action.key] : {},
      action.value
    );

    ctx.patchState(patchValue);
  }

  // --------------------------------------------------------------
}
