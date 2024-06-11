/* eslint-disable @typescript-eslint/no-explicit-any */
import { StateToken } from '@ngxs/store';

import { ListStoreModel } from '../store/list-store.model';

export const LIST_STATE_TOKEN = new StateToken<ListStoreModel>('list');
