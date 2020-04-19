import { createSelector } from 'reselect';
import { reducerProductsName } from './constants';
import { ProductsStateType, ProductsState } from './types';

const ProductManagerStorageSelector = (store: ProductsState) =>
  store[reducerProductsName];

export const getMenuData = createSelector(
  ProductManagerStorageSelector,
  (state: ProductsStateType) => (Boolean(state) ? state.menu : []),
);

export const getMenuIsLoading = createSelector(
  ProductManagerStorageSelector,
  (state: ProductsStateType) => (Boolean(state) ? state.loading : []),
);
