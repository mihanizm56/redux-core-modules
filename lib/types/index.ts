import { Store, Reducer, CombinedState } from 'redux';
import { Router } from 'router5';
import { Task } from 'redux-saga';

export interface IReducersMap {
  [reducerName: string]: Reducer;
}

export interface IAsyncSagas {
  [name: string]: Task;
}

export interface IAdvancedStore extends Store {
  asyncReducers: IReducersMap;
  rootReducers: IReducersMap;
  asyncSagas: IAsyncSagas;
  initialState?: Record<string, any>;
  rootSagas: IAsyncSagas;
  isSSR?: boolean;
  sagaMiddleware: any;
  closeSagas: () => void;
  router?: Router;
  dependencies?: Record<string, any>;
  rootSaga: any;
}

export type AnyAction = (payload?: any) => { type: string; payload?: any };

export type BaseAction = () => { type: string };

export type Action<T> = (payload: T) => { type: string; payload: T };

export type BaseActionResult = { type: string };

export type ActionResult<T> = { type: string; payload: T | undefined };

export type CustomReducerType = Reducer<
  CombinedState<{ [x: string]: unknown }>
>;

export type InjectAsyncSagaParams = {
  store: IAdvancedStore;
  name: string;
  saga: any;
  isRoot?: boolean;
};

export type InjectAsyncReducerParams = {
  store: IAdvancedStore;
  name: string;
  reducer: Reducer;
  isRoot?: boolean;
};
