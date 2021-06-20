import { Dispatch } from 'redux';
import { RequestErrorHandlerProcessParamsType } from '@/utils/request-error-handler-process';
import { Action, BaseAction } from '../../types';
import { IRedirectManagerPayload } from '../redirect-manager-module';

export type FormManagerType = {
  resetInitialDataAction?: Action<any>;
  formValues: any;
  formValuesFormatter?: (data: any) => any;
  loadingStartAction?: BaseAction;
  loadingStopAction?: BaseAction;
  formRequest: (params: {
    body: any;
    isErrorTextStraightToOutput: boolean;
  }) => Promise<any>;
  setErrorAction?: Action<any>;
  setErrorActionsArray?: Array<Action<string>>;
  formSuccessAction?: Action<any> | BaseAction;
  formSuccessActionsArray?: Array<Action<any> | BaseAction>;
  showNotification?: boolean;
  callBackOnSuccess?: (params: { dispatch: Dispatch }) => void;
  callBackOnError?: (params: { errorData: any; dispatch: Dispatch }) => void;
  requestExtraDataHandlerOptions?: Array<{
    fieldName: string;
    action: Action<any> | BaseAction;
  }>;
  responseDataFormatter?: (data: any) => any;
  withoutFormattingError?: boolean;
  redirectSuccessActionParams?: IRedirectManagerPayload;
  redirectErrorActionParams?: IRedirectManagerPayload;
  formatDataToRedirectParamsSuccess?: (data: any) => any;
  formatDataToRedirectParamsError?: (data: any) => any;
  textMessageSuccess?: string;
  requestErrorHandlerProcessParams?: Omit<
    RequestErrorHandlerProcessParamsType,
    'request'
  >;
  setFormExternalErrorsAction?: Action<any>;
  getErrorModalActionTitle?: (errorText: string) => string;
};
