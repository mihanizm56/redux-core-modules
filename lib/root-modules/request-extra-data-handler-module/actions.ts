import { Action } from '@/types';
import { InitRequestHandlerActionType } from './types';

export const INIT_REQUEST_HANDLER_ACTION_SAGA =
  'INIT_REQUEST_HANDLER_ACTION_SAGA';
export const requestExtraDataHandlerActionSaga: Action<{
  data: any;
  options: InitRequestHandlerActionType;
  formValues?: any;
}> = payload => ({
  type: INIT_REQUEST_HANDLER_ACTION_SAGA,
  payload,
});
