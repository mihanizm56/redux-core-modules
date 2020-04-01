import { Store, Reducer, CombinedState } from 'redux';

export interface IAsyncReducers {
  [reducerName: string]: Reducer;
}

export interface IAsyncSagas {
  [reducerName: string]: Reducer;
}

export interface IAdvancedStore extends Store {
  asyncReducers: IAsyncReducers;
  asyncSagas: IAsyncSagas;
  sagaMiddleware: any;
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
