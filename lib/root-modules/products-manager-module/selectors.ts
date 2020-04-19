import { createSelector } from 'reselect';
import { reducerProductsName} from './constants';
import { ProductsStateType, ProductsState } from './types';

const UIStorageSelector = (store: ProductsState) => store[reducerProductsName];

export const getMenu = createSelector(
    UIStorageSelector,
    ({ menu }: ProductsStateType) => menu,
);

export const getStatusLoading = createSelector(
    UIStorageSelector,
    ({ loading }: ProductsStateType) => loading,
);
