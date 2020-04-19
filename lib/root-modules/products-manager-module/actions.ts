import { Action, BaseAction } from "@/types";
import { MenuListType } from './types';

export const FETCH_MENU = 'FETCH_MENU';
export const SET_MENU = 'SET_MENU';
export const SET_LOADING = 'SET_LOADING';
export const LOAD_MENU = 'LOAD_MENU';
export const LOAD_PRODUCT = 'LOAD_PRODUCT';

export const fetchMenu: BaseAction = () => ({
    type: FETCH_MENU,
});

export const setMenu: Action<{
    menu: MenuListType;
}> = payload => ({
    type: SET_MENU,
    payload,
});

export const setLoading: Action<boolean> = payload => ({
    type: SET_LOADING,
    payload,
});
