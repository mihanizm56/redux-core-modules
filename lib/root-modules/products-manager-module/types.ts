import { reducerProductsName } from './constants';

export type MenuType = {
  icon?: string;
  name: string;
  staticURL?: string;
  url?: string;
  routeName?: string;
  nextLevelItems?: MenuListType;
};

export type MenuListType = Array<MenuType>;

export type ProductsState = {
  menu: MenuListType;
  loading: boolean;
};

export type ActionType = {
  type: string;
  payload: ProductsState;
};

export type ProductsStatePart = {
  [reducerProductsName]: ProductsState;
};

export type fetchMenuCallbackType = () => void;
