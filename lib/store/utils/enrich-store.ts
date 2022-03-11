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
  router?: Router;
  asyncSagas?: Record<string, any>;
  rootSagas?: Record<string, any>;
  initialState?: Record<string, any>;
  rootSaga: any;
  dependencies: Record<string, any>;
};

export const enrichStore = ({
  rootReducersPackage,
  asyncReducersPackage,
  sagaMiddleware,
  store,
  router,
  initialState,
  rootSaga,
  dependencies,
}: ParamsType) => {
  // передаём зависимости
  store.dependencies = dependencies;
  // определяем сеттер зависимостей стора
  store.setDependencies = (newDependencies: Record<string, any>) => {
    store.dependencies = { ...store.dependencies, ...newDependencies };
  };

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
  // задаем весь начальный стейт
  store.initialState = initialState;

  // для возможности при инициализации на сервере сделать
  // const sagaRunner = store.sagaMiddleware.run(store.rootSaga);
  // sagaRunner.toPromise().then(() => { renderAppAndSendToClient here })
  if (isNode) {
    store.rootSaga = rootSaga;
  }
};
