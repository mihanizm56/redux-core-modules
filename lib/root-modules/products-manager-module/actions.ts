import { Action, BaseAction } from '@/types';
import { MenuListType } from './types';

export const FETCH_MENU = 'FETCH_MENU';
export const fetchMenuAction: BaseAction = () => ({
  type: FETCH_MENU,
});

export const SET_MENU_DATA = 'SET_MENU_DATA';
export const setMenuAction: Action<{
  menu: MenuListType;
}> = payload => ({
  type: SET_MENU_DATA,
  payload,
});

export const SET_LOADING_START = 'SET_LOADING_START';
export const setLoadingStartAction: BaseAction = () => ({
  type: SET_LOADING_START,
});

export const SET_LOADING_STOP = 'SET_LOADING_STOP';
export const setLoadingStopAction: BaseAction = () => ({
  type: SET_LOADING_STOP,
});
