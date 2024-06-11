/* eslint-disable @typescript-eslint/no-explicit-any */
import { StateToken } from '@ngxs/store';
import { ConfigStoreModel } from '../store/config-store.model';

export const CONFIG_STATE_TOKEN = new StateToken<ConfigStoreModel>('config');
