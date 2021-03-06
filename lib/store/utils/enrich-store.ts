/* eslint-disable no-param-reassign */

import { END, SagaMiddleware } from 'redux-saga';
import { Router } from 'router5';
import { IAdvancedStore } from '@/types';
import { getIsClient } from '@/utils';

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
  rootSaga: any;
};

export const enrichStore = ({
  rootReducersPackage,
  asyncReducersPackage,
  sagaMiddleware,
  store,
  isSSR,
  router,
  initialState,
  rootSaga,
}: ParamsType) => {
  const isNode = !getIsClient();

  // прокидываем роутер в стор
  store.router = router;
  // создаем регистр динамических  редюсеров
  store.asyncReducers = { ...asyncReducersPackage };
  // создаем регистр root редюсеров
  store.rootReducers = { ...rootReducersPackage };
  // создаем регистр динамических саг
  store.asyncSagas = {};
  // создаем регистр root саг
  store.rootSagas = {};
  // определяем раннер миддливары внутри стора
  store.sagaMiddleware = sagaMiddleware;
  // Функция при вызове которой redux-saga собирает все саги
  // и их результаты и завершает прослушивание всех запущенных саг (через fork!)
  store.closeSagas = () => store.dispatch(END);
  // флаг о том что используется сервер сайд рендеринг и его специфичное поведение на сервере
  store.isSSR = isSSR;
  // TODO проверить имеет ли смысл
  store.initialState = initialState;

  // для возможности при инициализации на сервере сделать
  // const sagaRunner = store.sagaMiddleware.run(store.rootSaga);
  // sagaRunner.toPromise().then(() => { renderAppAndSendToClient here })
  if (isNode) {
    store.rootSaga = rootSaga;
  }
};
