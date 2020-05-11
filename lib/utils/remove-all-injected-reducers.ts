import { IAdvancedStore, CustomReducerType, IReducersMap } from '@/types';
import { createReducer } from '@/store/create-reducer';

export const removeAllInjectedReducers = (store: IAdvancedStore) => {
  // get injected reducers
  const injectedReducers = store.asyncReducers;
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

  // create new reducer with createReducer and replacedResult
  const updatedReducers: CustomReducerType = createReducer({
    prevState: replacedResult,
    asyncReducers: {},
    rootReducers: store.rootReducers,
  }) as CustomReducerType;

  // update reducers
  store.replaceReducer(updatedReducers);
};
