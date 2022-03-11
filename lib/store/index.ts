import { applyMiddleware, createStore } from 'redux';
import { enableBatching, batchDispatchMiddleware } from 'redux-batched-actions';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { Router } from 'router5';
import { combineReducers, getIsClient } from '@/utils';
import { IAdvancedStore } from '../types';
import { combineLazyReducers } from '../utils/combine-lazy-reducers';
import { createRootSaga } from './root-saga';
import { defaultRootReducers } from './default-root-reducers';
import { enrichStore } from './utils/enrich-store';
import { injectInitialAsyncSagas } from './utils/inject-initial-async-sagas';

const __DEV__ = process.env.NODE_ENV === "development"; // eslint-disable-line

interface IStoreParams {
  router?: Router;
  rootReducers?: Record<string, any>;
  rootSagas?: Record<string, any>;
  asyncReducers?: Record<string, any>;
  asyncSagas?: Record<string, any>;
  eventNameToCancelRequests?: string;
  initialState?: Record<string, any>;
  dependencies?: Record<string, any>;
  extraMiddlewares?: Array<any>;
  reduxStoreName?: string;
  // нужно чтобы отложить запуск саг и запустить их извне
  manualSagaStart?: boolean;
}

export const createAppStore = ({
  router,
  rootReducers,
  rootSagas,
  eventNameToCancelRequests,
  initialState,
  dependencies = {},
  extraMiddlewares = [],
  reduxStoreName = 'redux-core-modules',
  asyncReducers,
  asyncSagas,
  manualSagaStart,
}: IStoreParams) => {
  const isClient = getIsClient();

  const rootReducersPackage = {
    ...rootReducers,
    ...defaultRootReducers,
  };
  const asyncReducersPackage = { ...asyncReducers };
  const sagaMiddleware = createSagaMiddleware();
  const composeMiddlewares = [
    batchDispatchMiddleware,
    sagaMiddleware,
    ...extraMiddlewares,
  ];

  const enhancers =
    __DEV__ && isClient
      ? composeWithDevTools({ shouldHotReload: false, name: reduxStoreName })(
          applyMiddleware(...composeMiddlewares),
        )
      : applyMiddleware(...composeMiddlewares);

  // создаем корневой редюсер прокидывая в него доп параметры
  const rootReducer = initialState
    ? combineLazyReducers(
        {
          ...asyncReducersPackage,
          ...rootReducersPackage,
        },
        initialState,
      )
    : combineReducers({
        ...asyncReducersPackage,
        ...rootReducersPackage,
      });

  const store: IAdvancedStore = initialState
    ? (createStore(
        enableBatching(rootReducer),
        initialState,
        enhancers,
      ) as IAdvancedStore)
    : (createStore(enableBatching(rootReducer), enhancers) as IAdvancedStore);

  // создаем корневую сагу прокидывая в нее доп параметры
  const rootSaga = createRootSaga({
    rootSagas,
    router,
    eventNameToCancelRequests,
    store,
  });

  enrichStore({
    rootReducersPackage,
    asyncReducersPackage,
    sagaMiddleware,
    store,
    router,
    asyncSagas,
    rootSagas,
    initialState,
    rootSaga,
    dependencies,
  });

  if (asyncSagas) {
    injectInitialAsyncSagas({ asyncSagas, store });
  }

  if (!manualSagaStart) {
    sagaMiddleware.run(rootSaga);
  }

  // возвращаем объект стора
  return store;
};
