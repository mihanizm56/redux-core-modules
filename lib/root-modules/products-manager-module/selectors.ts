import { createSelector } from 'reselect';
import { reducerProductsName } from './constants';
import { ProductsStateType, ProductsState } from './types';

const productsManagerStorageSelector = (store: ProductsState) =>
  store[reducerProductsName];

export const getProductsMenuData = createSelector(
  productsManagerStorageSelector,
  ({ menu }: ProductsStateType) => menu,
);

export const getProductsMenuIsLoading = createSelector(
  productsManagerStorageSelector,
  ({ loading }: ProductsStateType) => loading,
);
