import { createSelector } from 'reselect';
import { reducerSuppliersName } from './constants';
import { SuppliersStateType, SuppliersState } from './types';

const productsManagerStorageSelector = (store: SuppliersState) =>
  store[reducerSuppliersName];

export const getSuppliersData = createSelector(
  productsManagerStorageSelector,
  ({ suppliers }: SuppliersStateType) => suppliers,
);

export const getSuppliersIsLoading = createSelector(
  productsManagerStorageSelector,
  ({ loading }: SuppliersStateType) => loading,
);
