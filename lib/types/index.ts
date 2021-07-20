import { Store, Reducer, CombinedState, Dispatch } from 'redux';
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

export type BaseAction<Type = void> = () => {
  type: Type extends string ? Type : string;
};

export type Action<Payload, Type = void> = (
  payload: Payload,
) => {
  type: Type extends string ? Type : string;
  payload: Payload;
};

export interface IReduxBaseAction<Type = void> {
  type: Type;

  (): {
    type: Type extends string ? Type : string;
  };
}

export interface IReduxAction<Payload, Type = void> {
  type: Type;

  (payload: Payload): {
    type: Type extends string ? Type : string;
    payload: Payload;
  };
}

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

export type InjectedSagaParams = {
  dispatch: Dispatch;
  store?: IAdvancedStore;
  router: Router;
  dependencies: Record<string, any>;
};

export type InjectAsyncReducerParams = {
  store: IAdvancedStore;
  name: string;
  reducer: Reducer;
  isRoot?: boolean;
};
