/* eslint-disable @typescript-eslint/no-explicit-any */
export interface CachedStoreModel {
  [searchKey: string]: {
    updatedAt: string;
    /*expiresIn: number;*/
    data: any;
  } | null;
}
