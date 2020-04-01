import { Action } from '@/types';
import { NotificationType } from './types';

export const SET_MODAL = 'SET_MODAL';
export const setModalAction: Action<NotificationType> = payload => ({
  type: SET_MODAL,
  payload,
});

export const REMOVE_MODAL = 'REMOVE_MODAL';
export const removeModalAction: Action<string> = payload => ({
  type: REMOVE_MODAL,
  payload,
});

export const MODAL_CALLBACK_ACTION = 'MODAL_CALLBACK_ACTION';
export const modalCallbackAction: Action<string> = payload => ({
  type: MODAL_CALLBACK_ACTION,
  payload,
});
