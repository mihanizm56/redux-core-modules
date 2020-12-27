import { CustomReducerType, InjectAsyncReducerParams } from '@/types';
import { createReducer } from '@/store/create-reducer';

export const injectAsyncReducer = ({
  store,
  name,
  reducer,
  isRoot,
}: InjectAsyncReducerParams) => {
  const asyncReducers = store.asyncReducers;
  const rootReducers = store.rootReducers;
  const initialState = store.initialState;
  const wasAsyncReducerInjected = Boolean(asyncReducers[name]);
  const wasRootReducerInjected = Boolean(rootReducers[name]);

  if (wasAsyncReducerInjected || wasRootReducerInjected) {
    if (wasAsyncReducerInjected) {
      if (process.env.REACT_APP_REDUX_DEBUG) {
        // eslint-disable-next-line
      console.warn(`${name} reducer was injected earlier`);
      }
    }

    if (wasRootReducerInjected) {
      // eslint-disable-next-line
      console.warn(`${name} reducer was injected in the root reducer earlier`);
    }

    return;
  }

  if (isRoot) {
    // register root reducer to the store
    rootReducers[name] = reducer;
  } else {
    // register reducer to the store
    asyncReducers[name] = reducer;
  }

  // define new reducers
  const newReducer: CustomReducerType = createReducer({
    prevState: { ...initialState, ...store.getState() },
    asyncReducers,
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
