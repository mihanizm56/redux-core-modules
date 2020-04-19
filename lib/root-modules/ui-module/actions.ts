import { BaseAction, Action } from '@/types';

export const START_PAGE_LOADING = 'START_PAGE_LOADING';
export const startPageLoadingAction: BaseAction = () => ({
  type: START_PAGE_LOADING,
});

export const STOP_PAGE_LOADING = 'STOP_PAGE_LOADING';
export const stopPageLoadingAction: BaseAction = () => ({
  type: STOP_PAGE_LOADING,
});

export const SET_APP_ERROR_STATE = 'SET_APP_ERROR_STATE';
export const setAppErrorAction: BaseAction = () => ({
  type: SET_APP_ERROR_STATE,
});

export const REMOVE_APP_ERROR_STATE = 'REMOVE_APP_ERROR_STATE';
export const removeAppErrorAction: BaseAction = () => ({
  type: REMOVE_APP_ERROR_STATE,
});
