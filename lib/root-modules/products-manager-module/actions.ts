import { Action, BaseAction } from '@/types';
import { MenuListType, fetchMenuCallbackType } from './types';

export const FETCH_MENU_ACTION_SAGA = 'FETCH_MENU_ACTION_SAGA';
export const fetchMenuAction: Action<fetchMenuCallbackType> = payload => ({
  type: FETCH_MENU_ACTION_SAGA,
  payload,
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
