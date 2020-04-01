import { CustomReducerType, InjectAsyncReducer } from '@/types';
import { createReducer } from '@/store/create-reducer';

export const injectAsyncReducer = ({
  store,
  name,
  asyncReducer,
}: InjectAsyncReducer) => {
  const asyncReducersInStore = store.asyncReducers;
  const wasReducerInjected = Boolean(asyncReducersInStore[name]);

  if (wasReducerInjected) {
    return;
  }

  // get reducer from store
  asyncReducersInStore[name] = asyncReducer;

  // define new reducer
  const newReducer: CustomReducerType = createReducer({
    prevState: store.getState(),
    asyncReducers: asyncReducersInStore,
  }) as CustomReducerType;

  // inject reducer
  store.replaceReducer(newReducer);
};
