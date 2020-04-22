import { createSelector } from 'reselect';
import { reducerProductsName } from './constants';
import { ProductsState, ProductsStatePart } from './types';

const productsManagerStorageSelector = (store: ProductsStatePart) =>
  store[reducerProductsName];

export const getProductsMenuData = createSelector(
  productsManagerStorageSelector,
  ({ menu }: ProductsState) => menu,
);

export const getProductsMenuIsLoading = createSelector(
  productsManagerStorageSelector,
  ({ loading }: ProductsState) => loading,
);
