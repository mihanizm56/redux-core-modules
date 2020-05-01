import { CustomReducerType } from '@/types';
import { createReducer } from '@/store/create-reducer';

export const removeAsyncReducer = ({ store, name }: any) => {
  const asyncReducersInStore = store.asyncReducers;
  const wasReducerInjected = Boolean(asyncReducersInStore[name]);

  if (!wasReducerInjected) {
    return;
  }

  delete asyncReducersInStore[name];

  // define new reducer
  const newReducer: CustomReducerType = createReducer({
    prevState: store.getState(),
    asyncReducers: asyncReducersInStore,
  }) as CustomReducerType;

  // inject reducer
  store.replaceReducer(newReducer);
};
