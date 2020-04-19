import { FETCH_MENU, LOAD_PRODUCT, SET_MENU, SET_LOADING } from './actions';
import {Action, ProductsStateType} from './types';

const initialState: ProductsStateType = {
    menu: [],
    loading: true,
};

export const reducerProducts = (
    state: ProductsStateType = initialState,
    { type, payload }: Action,
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