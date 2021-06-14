import { IAdvancedStore, CustomReducerType, IReducersMap } from '@/types';
import { combineReducers } from './combine-reducers';

export const removeAllInjectedReducers = ({
  store,
  reducersNotToReplace,
}: {
  reducersNotToReplace: Array<string>;
  store: IAdvancedStore;
}) => {
  // get injected reducers
  const asyncReducers = store.asyncReducers;
  const rootReducers = store.rootReducers;
  // get all reducers from the store
  const storeState = store.getState();

  const constantAsyncReducers = Object.keys(asyncReducers).reduce(
    (acc, asyncReducerName) => {
      const isAsyncReducerStable = Boolean(
        reducersNotToReplace.find(
          reducerName => reducerName === asyncReducerName,
        ),
      );

      if (isAsyncReducerStable) {
        return { ...acc, [asyncReducerName]: asyncReducers[asyncReducerName] };
      }

      return acc;
    },
    {},
  );

  // get replaced result
  const replacedResult: IReducersMap = Object.keys(storeState).reduce(
    (acc, reducerName) =>
      asyncReducers[reducerName]
        ? acc
        : { ...acc, reducerName: storeState[reducerName] },
    {},
  );

  // clear injected reducers registry
  store.asyncReducers = {...constantAsyncReducers}; // eslint-disable-line

  // create new reducer
  const updatedReducers: CustomReducerType = combineReducers({
    ...replacedResult,
    ...constantAsyncReducers,
    ...rootReducers,
  });

  // update reducers
  store.replaceReducer(updatedReducers);
};
