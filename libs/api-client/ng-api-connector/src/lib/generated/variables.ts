/* eslint-disable no-control-regex */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-interface */
import { InjectionToken } from '@angular/core';

export const BASE_PATH = new InjectionToken<string>('basePath');
export const COLLECTION_FORMATS = {
  csv: ',',
  tsv: '   ',
  ssv: ' ',
  pipes: '|'
};
