import { Action, BaseAction } from '@/types';
import { IRedirectManagerPayload } from '../redirect-manager-module';

export type InitLoadManagerRequestOptionsType = {
  request: (params: any) => Promise<any>;
  requestOptions: {
    translateFunction: (key: string, options?: Record<string, any>) => string;
    [key: string]: any;
  };
  actionSuccess?: Action<any> | BaseAction;
  requestDataFormatter?: (data: any) => any;
  resetAction?: BaseAction;
  resetActionsArray?: Array<BaseAction>;
  actionsArraySuccess?: Array<Action<any> | BaseAction>;
  isDataCritical?: boolean;
  errorAction?: Action<any> | BaseAction;
  errorActionsArray?: Array<Action<any> | BaseAction>;
  requestExtraDataHandlerOptions?: Array<{
    fieldName: string;
    action: Action<any> | BaseAction;
  }>;
  showErrorNotification?: boolean;
  showSuccessNotification?: boolean;
  loadingStopAction?: BaseAction;
  loadingStartAction?: BaseAction;
  withoutFormattingError?: boolean;
  formatDataToRedirectParamsSuccess?: (data: any) => any;
  redirectRouteParamsSuccess?: IRedirectManagerPayload;
  formatDataToRedirectParamsError?: (data: any) => any;
  redirectRouteParamsError?: IRedirectManagerPayload;
};

export type InitLoadManagerActionPayloadType = {
  options?: {
    fullActionLoadingStop?: BaseAction;
    fullActionLoadingStart?: BaseAction;
  };

  requestConfigList: Array<InitLoadManagerRequestOptionsType>;
};
