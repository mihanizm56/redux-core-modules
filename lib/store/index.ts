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
  rootSagas: Array<SagaIterator>;
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

  const rootReducer = createReducer({ ...rootReducers });
  const rootSaga = createRootSaga(rootSagas);

  const store: IAdvancedStore = createStore(
    enableBatching(rootReducer),
    enhancers,
  ) as IAdvancedStore;

  // вытаскиваем диспатч для корневый саги
  const dispatch = store.dispatch;
  const rootSagaWithRouter = rootSaga.bind(null, { router, dispatch });

  // Add a dictionary to keep track of the registered async reducers and sagas
  // and give a possibility to run saga from field sagaMiddleware
  store.router = router;
  store.asyncReducers = {};
  store.asyncSagas = {};
  store.sagaMiddleware = sagaMiddleware;

  sagaMiddleware.run(rootSagaWithRouter);

  return store;
};
