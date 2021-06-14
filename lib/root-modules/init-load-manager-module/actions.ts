import { Action } from '@/types';
import { InitLoadManagerActionPayloadType } from './types';

export const INIT_LOAD_MANAGER_ACTION_SAGA =
  '@redux-core-modules/INIT_LOAD_MANAGER_ACTION_SAGA';
export const initLoadManagerActionSaga: Action<InitLoadManagerActionPayloadType> = payload => ({
  type: INIT_LOAD_MANAGER_ACTION_SAGA,
  payload,
});
