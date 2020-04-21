import { createSelector } from 'reselect';
import { reducerSuppliersName } from './constants';
import { SuppliersStateType, SuppliersState } from './types';

const suppliersManagerStorageSelector = (store: SuppliersState) =>
  store[reducerSuppliersName];

export const getSuppliersData = createSelector(
  suppliersManagerStorageSelector,
  ({ suppliers }: SuppliersStateType) => suppliers,
);

export const getSuppliersIsLoading = createSelector(
  suppliersManagerStorageSelector,
  ({ loading }: SuppliersStateType) => loading,
);
