import { Store, Reducer, CombinedState } from 'redux';
import { Router } from 'router5';
import { Task } from 'redux-saga';

export interface IAsyncReducers {
  [reducerName: string]: Reducer;
}

export interface IAsyncSagas {
  [name: string]: Task;
}

export interface IAdvancedStore extends Store {
  asyncReducers: IAsyncReducers;
  asyncSagas: IAsyncSagas;
  sagaMiddleware: any;
  router: Router;
}

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
};

export type InjectAsyncReducer = {
  store: IAdvancedStore;
  name: string;
  reducer: Reducer;
};

export type ErrorTextParams = {
  errorTextKey: string;
  errorsMap: { [key: string]: string };
};
