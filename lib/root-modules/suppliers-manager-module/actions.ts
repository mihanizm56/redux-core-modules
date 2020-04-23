import { Action, BaseAction } from '@/types';
import { SuppliersType } from './types';

export const FETCH_SUPPLIERS_ACTION_SAGA = 'FETCH_SUPPLIERS_ACTION_SAGA';
export const fetchSuppliersAction: BaseAction = () => ({
  type: FETCH_SUPPLIERS_ACTION_SAGA,
});

export const SET_SELECTED_SUPPLIER_ACTION_SAGA =
  'SET_SELECTED_SUPPLIER_ACTION_SAGA';
export const setCurrentSupplierActionSaga: BaseAction = () => ({
  type: SET_SELECTED_SUPPLIER_ACTION_SAGA,
});

export const SET_SUPPLIERS_DATA = 'SET_SUPPLIERS_DATA';
export const setSuppliersAction: Action<{
  suppliers: Array<SuppliersType>;
}> = payload => ({
  type: SET_SUPPLIERS_DATA,
  payload,
});

export const SET_SUPPLIERS_LOADING_START = 'SET_SUPPLIERS_LOADING_START';
export const setSuppliersLoadingStartAction: BaseAction = () => ({
  type: SET_SUPPLIERS_LOADING_START,
});

export const SET_SUPPLIERS_LOADING_STOP = 'SET_SUPPLIERS_LOADING_STOP';
export const setSuppliersLoadingStopAction: BaseAction = () => ({
  type: SET_SUPPLIERS_LOADING_STOP,
});

export const SET_SELECTED_SUPPLIER = 'SET_SELECTED_SUPPLIER';
export const setSelectedSupplierAction: BaseAction = () => ({
  type: SET_SUPPLIERS_LOADING_STOP,
});
