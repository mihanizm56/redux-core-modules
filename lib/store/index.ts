import { applyMiddleware, createStore } from 'redux';
import { enableBatching, batchDispatchMiddleware } from 'redux-batched-actions';
import createSagaMiddleware, { SagaIterator } from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { Router } from 'router5';
import { IAdvancedStore } from '../types';
import { createReducer } from './create-reducer';
import { createRootSaga } from './root-saga';

const __DEV__ = process.env.NODE_ENV === "development"; // eslint-disable-line

interface IStoreParams {
  router: Router;
  rootReducers?: {
    [key: string]: Function;
  };
  rootSagas?: Array<SagaIterator>;
}

export const createAppStore = ({
  router,
  rootReducers,
  rootSagas,
}: IStoreParams) => {
  const sagaMiddleware = createSagaMiddleware();
  const composeMiddlewares = [batchDispatchMiddleware, sagaMiddleware];

  const enhancers = __DEV__
    ? composeWithDevTools({ shouldHotReload: false })(
        applyMiddleware(...composeMiddlewares),
      )
    : applyMiddleware(...composeMiddlewares);

  // создаем корневой редюсер прокидывая в него доп параметры
  const rootReducer = createReducer({ asyncReducers: rootReducers });

  const store: IAdvancedStore = createStore(
    enableBatching(rootReducer),
    enhancers,
  ) as IAdvancedStore;

  // вытаскиваем диспатч для корневый саги
  const dispatch = store.dispatch;

  // создаем корневую сагу прокидывая в нее доп параметры
  const rootSaga = createRootSaga({
    rootSagas,
    router,
    dispatch,
  });

  const rootSagaWithRouter = rootSaga.bind(null, { router, dispatch });

  // прокидываем роутер в стор
  store.router = router;
  // создаем регистр динамических саг и редюсеров
  store.asyncReducers = {};
  store.asyncSagas = {};
  // определяем по документации раннер миддливары внутри стора
  store.sagaMiddleware = sagaMiddleware;

  sagaMiddleware.run(rootSagaWithRouter);

  // возвращаем обхект стора
  return store;
};
