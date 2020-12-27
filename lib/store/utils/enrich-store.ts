/* eslint-disable no-param-reassign */

import { END, SagaMiddleware } from 'redux-saga';
import { Router } from 'router5';
import { IAdvancedStore } from '@/types';

type ParamsType = {
  rootReducersPackage: Record<string, any>;
  asyncReducersPackage: Record<string, any>;
  sagaMiddleware: SagaMiddleware<object>;
  store: IAdvancedStore;
  isSSR?: boolean;
  router?: Router;
  asyncSagas?: Record<string, any>;
  rootSagas?: Record<string, any>;
  initialState?: Record<string, any>;
};

export const enrichStore = ({
  rootReducersPackage,
  asyncReducersPackage,
  sagaMiddleware,
  store,
  isSSR,
  router,
  asyncSagas,
  rootSagas,
  initialState,
}: ParamsType) => {
  // прокидываем роутер в стор
  store.router = router;
  // создаем регистр динамических  редюсеров
  store.asyncReducers = { ...asyncReducersPackage };
  // создаем регистр root редюсеров
  store.rootReducers = { ...rootReducersPackage };
  // создаем регистр динамических саг
  store.asyncSagas = { ...asyncSagas };
  // создаем регистр root саг
  store.rootSagas = { ...rootSagas };
  // определяем раннер миддливары внутри стора
  store.sagaMiddleware = sagaMiddleware;
  //
  store.closeSagas = () => store.dispatch(END);
  // флаг о том что используется сервер сайд рендеринг
  store.isSSR = isSSR;
  //
  store.initialState = initialState;
};
