import { CustomReducerType, InjectAsyncReducer } from '@/types';
import { createReducer } from '@/store/create-reducer';

export const injectAsyncReducer = ({
  store,
  name,
  reducer,
}: InjectAsyncReducer) => {
  const asyncReducersInStore = store.asyncReducers;
  const rootReducers = store.rootReducers;
  const wasAsyncReducerInjected = Boolean(asyncReducersInStore[name]);
  const wasRootReducerInjected = Boolean(rootReducers[name]);

  if (wasAsyncReducerInjected || wasRootReducerInjected) {
    return;
  }

  // register reducer to the store
  asyncReducersInStore[name] = reducer;

  // define new reducers
  const newReducer: CustomReducerType = createReducer({
    prevState: store.getState(),
    asyncReducers: asyncReducersInStore,
    rootReducers,
  }) as CustomReducerType;

  // log to the devtools
  store.dispatch({
    type: '@REDUX-CORE-MODULES INJECT REDUCER',
    payload: {
      name,
    },
  });

  // inject reducer
  store.replaceReducer(newReducer);
};
