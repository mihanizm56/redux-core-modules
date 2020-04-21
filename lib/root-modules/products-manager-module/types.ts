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

export type ProductsStateType = {
  menu: MenuListType;
  loading: boolean;
};

export type ActionType = {
  type: string;
  payload: ProductsStateType;
};

export type ProductsState = {
  [reducerProductsName]: ProductsStateType;
};

export type fetchMenuCallbackType = () => void;
