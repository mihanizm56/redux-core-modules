import { State } from 'router5';
import { injectAsyncReducer, injectAsyncSaga } from '@/utils';
import { initLoadManagerActionSaga } from '@/root-modules/init-load-manager-module';
import { IAdvancedStore } from '@/types';
import { StoreInjectConfig } from '../types';

export type ParamsType = {
  toState?: State;
  fromState?: State;
  store: IAdvancedStore;
  storeInjectConfig?: StoreInjectConfig;
};

export const runInjectorConfig = ({
  store,
  storeInjectConfig,
  storeInjectConfig: {
    additionalConfig,
    reducersToInject,
    sagasToInject,
    initialLoadManagerConfig,
  } = {},
}: ParamsType) => {
  if (!storeInjectConfig) {
    return;
  }

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

  // call an action before to call initialLoadManagerConfig
  if (additionalConfig && additionalConfig.callbackBeforeInitLoadManager) {
    additionalConfig.callbackBeforeInitLoadManager(store.dispatch);
  }

  // dispatch initial load requests
  if (initialLoadManagerConfig) {
    store.dispatch(initLoadManagerActionSaga(initialLoadManagerConfig));
  }

  // call an action on mount page
  if (additionalConfig && additionalConfig.callbackOnMount) {
    additionalConfig.callbackOnMount(store.dispatch);
  }
};
