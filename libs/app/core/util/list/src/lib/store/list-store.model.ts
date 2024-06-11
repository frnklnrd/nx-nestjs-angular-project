/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ListStoreModel {
  [langCode: string]: {
    [listKey: string]: {
      updatedAt: string;
      expiresIn: number;
      data: any;
    } | null;
  };
}
