import { Action } from '@/types';
import { RequestExtraDataHandlerActionSagaType } from './types';

export const INIT_REQUEST_HANDLER_ACTION_SAGA =
  'INIT_REQUEST_HANDLER_ACTION_SAGA';
export const requestExtraDataHandlerActionSaga: Action<
  RequestExtraDataHandlerActionSagaType
> = payload => ({
  type: INIT_REQUEST_HANDLER_ACTION_SAGA,
  payload,
});
