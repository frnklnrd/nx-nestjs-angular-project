/* eslint-disable @typescript-eslint/no-explicit-any */
import { StateToken } from '@ngxs/store';

import { I18nStoreModel } from '../store/i18n-store.model';

export const I18N_STATE_TOKEN = new StateToken<I18nStoreModel>('i18n');
