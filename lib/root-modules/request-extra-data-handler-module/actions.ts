import { Action } from '@/types';
import { OptionsType } from './types';

export const INIT_REQUEST_HANDLER_ACTION_SAGA =
  'INIT_REQUEST_HANDLER_ACTION_SAGA';
export const requestExtraDataHandlerActionSaga: Action<{
  data: any;
  options: OptionsType;
  formValues?: any;
}> = payload => ({
  type: INIT_REQUEST_HANDLER_ACTION_SAGA,
  payload,
});
