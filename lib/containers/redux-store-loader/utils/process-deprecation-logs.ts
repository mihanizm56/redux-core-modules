/* eslint-disable no-console */

import { IAdvancedStore } from '@/types';

type PropsType = {
  store?: IAdvancedStore;
};

export const processDeprecationLogs = ({ store }: PropsType) => {
  if (Boolean(store)) {
    console.warn(
      'Prop "store" is DEPRECATED in ReduxStoreLoader and will be removed in next minor release',
    );
  }
};
