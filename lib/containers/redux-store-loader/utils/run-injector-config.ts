import { State } from 'router5';
import { injectAsyncReducer, injectAsyncSaga } from '@/utils';
import { initLoadManagerActionSaga } from '@/root-modules/init-load-manager-module';
import { IAdvancedStore } from '@/types';
import { StoreInjectConfig } from '../types';

export type ParamsType = {
  toState?: State;
  fromState?: State;
  store: IAdvancedStore;
  storeInjectConfig: StoreInjectConfig;
  withoutRemovingReducers?: boolean;
};

export const runInjectorConfig = ({
  store,
  storeInjectConfig: {
    additionalConfig,
    reducersToInject,
    sagasToInject,
    initialLoadManagerConfig,
  } = {},
}: ParamsType) => {
  // inject reducers
  if (reducersToInject) {
    reducersToInject.forEach(({ reducer, name, isRoot }) =>
      injectAsyncReducer({
        store,
        name,
        reducer,
        isRoot,
      }),
    );
  }

  // inject sagas
  if (sagasToInject) {
    sagasToInject.forEach(({ saga, name, isRoot }) =>
      injectAsyncSaga({
        store,
        name,
        saga,
        isRoot,
      }),
    );
  }

  // dispatch initial load requests
  if (initialLoadManagerConfig) {
    store.dispatch(initLoadManagerActionSaga(initialLoadManagerConfig));
  }

  // if additional confix exists
  if (additionalConfig) {
    if (additionalConfig.callbackOnMount) {
      // call an action on mount page
      additionalConfig.callbackOnMount(store.dispatch);
    }
  }
};
