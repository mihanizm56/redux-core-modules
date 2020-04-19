import { FETCH_MENU, LOAD_PRODUCT, SET_MENU, SET_LOADING } from './actions';
import { ProductStateTypes } from './types';

const initialState: ProductStateTypes = {
    menu: [],
    loading: true,
};

export const reducerProducts = (
    state: ProductStateTypes = initialState,
    { type, payload }: { type: string; payload: ProductStateTypes },
) => {
    switch (type) {
        case SET_MENU:
            return {
                ...state,
                menu: payload.menu,
                loading: false,
            };
        case FETCH_MENU:
            return {
                ...state,
            };
        case SET_LOADING:
            return {
                ...state,
                loading: true,
            };

        default:
            return state;
    }
};

export const reducerProductsName = '@platform/products';

export interface ProductsState {
    [reducerProductsName]: ProductStateTypes;
}
