import { reducerProductsName} from './constants';

export type Menu = {
    icon?: string;
    name: string;
    staticURL?: string;
    url?: string;
    nextLevelItems?: MenuListType;
};

export type MenuListType = Array<Menu>;

export type ProductsStateType = {
    menu: MenuListType;
    loading: boolean;
};

export type Action = {
    type: string;
    payload: ProductsStateType;
};

export type ProductsState = {
    [reducerProductsName]: ProductsStateType;
};