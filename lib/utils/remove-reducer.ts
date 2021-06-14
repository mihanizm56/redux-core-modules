import { CustomReducerType, InjectAsyncReducerParams } from '@/types';
import { combineReducers } from './combine-reducers';

export const removeAsyncReducer = ({
  store,
  name,
}: Omit<InjectAsyncReducerParams, 'reducer'>) => {
  const asyncReducers = store.asyncReducers;
  const rootReducers = store.rootReducers;
  const wasReducerInjected = Boolean(asyncReducers[name]);
  const wasRootReducerInjected = Boolean(rootReducers[name]);

  if (!wasReducerInjected || wasRootReducerInjected) {
    return;
  }

  delete asyncReducers[name];

  const { [name]: reducerToDelete, ...prevState } = store.getState(); // eslint-disable-line

  // define new reducer
  const newReducer: CustomReducerType = combineReducers({
    ...prevState,
    ...asyncReducers,
    ...rootReducers,
  });

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
