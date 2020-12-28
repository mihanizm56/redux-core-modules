import { IAdvancedStore } from '@/types';
import { SelectorCheckInitialFetchedType } from '../../types';

type ParamsType = {
  store: IAdvancedStore;
  selectorsCheckInitialFetched?: Array<SelectorCheckInitialFetchedType>;
};

export const checkIsInitialFetched = ({
  store,
  selectorsCheckInitialFetched,
}: ParamsType) => {
  if (!selectorsCheckInitialFetched || !selectorsCheckInitialFetched.length) {
    return true;
  }

  return selectorsCheckInitialFetched.reduce((acc, selector) => {
    if (!acc) {
      return acc;
    }

    const fetchedSelectorValue = selector(store.getState());

    return fetchedSelectorValue;
  }, true);
};
