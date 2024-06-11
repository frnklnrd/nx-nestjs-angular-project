/* eslint-disable @typescript-eslint/no-explicit-any */
import { StateToken } from '@ngxs/store';

import { CachedStoreModel } from '../store/cached-store.model';

export const CACHED_STATE_TOKEN = new StateToken<CachedStoreModel>('cached');
