import { IAdvancedStore, CustomReducerType, IReducersMap } from '@/types';
import { combineReducers } from './combine-reducers';

export const removeAllInjectedReducers = (store: IAdvancedStore) => {
  // get injected reducers
  const injectedReducers = store.asyncReducers;
  const rootReducers = store.rootReducers;
  // get all reducers from the store
  const allReducersInStore = store.getState();

  // get replaced result
  const replacedResult: IReducersMap = Object.keys(allReducersInStore).reduce(
    (acc, reducerName) =>
      !injectedReducers[reducerName]
        ? { ...acc, reducerName: allReducersInStore[reducerName] }
        : acc,
    {},
  );

  // clear injected reducers registry
  store.asyncReducers = {}; // eslint-disable-line

  // create new reducer
  const updatedReducers: CustomReducerType = combineReducers({
    ...replacedResult,
    ...rootReducers,
  });

  // update reducers
  store.replaceReducer(updatedReducers);
};
