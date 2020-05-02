import { CustomReducerType, InjectAsyncReducer } from '@/types';
import { createReducer } from '@/store/create-reducer';

export const removeAsyncReducer = ({
  store,
  name,
}: Omit<InjectAsyncReducer, 'reducer'>) => {
  const asyncReducersInStore = store.asyncReducers;
  const wasReducerInjected = Boolean(asyncReducersInStore[name]);

  if (!wasReducerInjected) {
    return;
  }

  delete asyncReducersInStore[name];

  const { [name]: reducerToDelete, ...prevState } = store.getState(); // eslint-disable-line

  // define new reducer
  const newReducer: CustomReducerType = createReducer({
    prevState,
    asyncReducers: asyncReducersInStore,
  }) as CustomReducerType;

  // log to the devtools
  store.dispatch({
    type: '@REDUX-CORE-MODULES REMOVE REDUCER',
    payload: {
      name,
    },
  });

  // inject reducer
  store.replaceReducer(newReducer);
};
