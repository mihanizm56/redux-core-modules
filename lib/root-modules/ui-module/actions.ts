import { BaseAction } from '@/types';

export const START_PAGE_LOADING = 'START_PAGE_LOADING';
export const startAppLoadingAction: BaseAction = () => ({
  type: START_PAGE_LOADING,
});

export const STOP_PAGE_LOADING = 'STOP_PAGE_LOADING';
export const stopAppLoadingAction: BaseAction = () => ({
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

export const START_I18NEXT_LOADING = 'START_i18NEXT_LOADING';
export const starti18nextLoadingAction: BaseAction = () => ({
  type: START_I18NEXT_LOADING,
});

export const STOP_I18NEXT_LOADING = 'STOP_i18NEXT_LOADING';
export const stopi18nextLoadingAction: BaseAction = () => ({
  type: STOP_I18NEXT_LOADING,
});
