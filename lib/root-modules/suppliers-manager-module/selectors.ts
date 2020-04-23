import { createSelector } from 'reselect';
import { reducerSuppliersName } from './constants';
import { SuppliersStatePart, SuppliersState } from './types';

const suppliersManagerStorageSelector = (store: SuppliersStatePart) =>
  store[reducerSuppliersName];

export const getSuppliersData = createSelector(
  suppliersManagerStorageSelector,
  ({ suppliers }: SuppliersState) => suppliers,
);

export const getSuppliersIsLoading = createSelector(
  suppliersManagerStorageSelector,
  ({ loading }: SuppliersState) => loading,
);

export const getSelectedSupplier = createSelector(
  suppliersManagerStorageSelector,
  ({ loading }: SuppliersState) => loading,
);
