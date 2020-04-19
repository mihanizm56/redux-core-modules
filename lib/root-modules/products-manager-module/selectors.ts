import { createSelector } from 'reselect';
import { reducerProductsName, ProductsState } from './reducer';
import { ProductStateTypes } from './types';

const UIStorageSelector = (store: ProductsState) => store[reducerProductsName];

export const getMenu = createSelector(
    UIStorageSelector,
    ({ menu }: ProductStateTypes) => menu,
);

export const getStatusLoading = createSelector(
    UIStorageSelector,
    ({ loading }: ProductStateTypes) => loading,
);
