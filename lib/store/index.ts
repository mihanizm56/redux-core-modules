import { applyMiddleware, createStore } from 'redux';
import { enableBatching, batchDispatchMiddleware } from 'redux-batched-actions';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { Router } from 'router5';
import { combineReducers } from '@/utils';
import { IAdvancedStore } from '../types';
import { createRootSaga } from './root-saga';
import { defaultRootReducers } from './default-root-reducers';

const __DEV__ = process.env.NODE_ENV === "development"; // eslint-disable-line

interface IStoreParams {
  router?: Router;
  rootReducers?: {
    [key: string]: any;
  };
  rootSagas?: Record<string, any>;
  eventNameToCancelRequests?: string;
  initialState?: {
    [key: string]: any;
  };
  dependencies?: Record<string, any>;
  extraMiddlewares?: Array<any>;
}

export const createAppStore = ({
  router,
  rootReducers,
  rootSagas,
  eventNameToCancelRequests,
  initialState,
  dependencies,
  extraMiddlewares,
}: IStoreParams) => {
  const rootReducersPackage = {
    ...rootReducers,
    ...defaultRootReducers,
  };
  const sagaMiddleware = createSagaMiddleware();
  const composeMiddlewares = [
    batchDispatchMiddleware,
    sagaMiddleware,
    ...extraMiddlewares,
  ];

  const enhancers = __DEV__
    ? composeWithDevTools({ shouldHotReload: false })(
        applyMiddleware(...composeMiddlewares),
      )
    : applyMiddleware(...composeMiddlewares);

  // создаем корневой редюсер прокидывая в него доп параметры
  const rootReducer = combineReducers(rootReducersPackage);

  const store: IAdvancedStore = initialState
    ? (createStore(
        enableBatching(rootReducer),
        initialState,
        enhancers,
      ) as IAdvancedStore)
    : (createStore(enableBatching(rootReducer), enhancers) as IAdvancedStore);

  // вытаскиваем диспатч для корневый саги
  const dispatch = store.dispatch;
  // передаём зависимости
  store.dependencies = dependencies;

  // создаем корневую сагу прокидывая в нее доп параметры
  const rootSaga = createRootSaga({
    rootSagas,
    router,
    dispatch,
    eventNameToCancelRequests,
    store,
    dependencies,
  });

  // прокидываем роутер в стор
  store.router = router;
  // создаем регистр динамических  редюсеров
  store.asyncReducers = {};
  // создаем регистр root редюсеров
  store.rootReducers = rootReducersPackage;
  // создаем регистр динамических саг
  store.asyncSagas = {};
  // создаем регистр root саг
  store.rootSagas = {};
  // определяем раннер миддливары внутри стора
  store.sagaMiddleware = sagaMiddleware;

  sagaMiddleware.run(rootSaga);

  // возвращаем объект стора
  return store;
};
