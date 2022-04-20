import { Dispatch } from 'redux';
import { Action, BaseAction, IAdvancedStore } from '@/types';
import { RequestErrorHandlerProcessParamsType } from '@/utils/request-error-handler-process';
import { IRedirectManagerPayload } from '../redirect-manager-module';

export type SelectorCheckInitialFetchedType = (storePart: any) => boolean; // any because of variability of selector types

export type InitLoadManagerRequestOptionsType = {
  request: (params: any) => Promise<any>;
  requestOptions?: {
    [key: string]: any;
  };
  actionSuccess?: Action<any> | BaseAction;
  requestDataFormatter?: (data: any) => any;
  responseDataFormatter?: (data: any) => any;
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
  titleMessageSuccess?: string;
  textMessageSuccess?: string;
  requestErrorHandlerProcessParams?: Omit<
    RequestErrorHandlerProcessParamsType,
    'request'
  >;
  getErrorModalActionTitle?: (errorText: string) => string;
  initialLoadingFinishAction?: BaseAction;
  selectorsCheckInitialFetched?: Array<SelectorCheckInitialFetchedType>;
  callBackOnSuccess?: (params: {
    dispatch: Dispatch;
    responseData: any;
    store: IAdvancedStore;
  }) => void;
  callBackOnError?: (params: {
    dispatch: Dispatch;
    store: IAdvancedStore;
    error: any;
  }) => void;
  disableErrorLogger?: boolean;
};

export type BeforeRequestConfigType = {
  requestActionStart?: BaseAction;
  requestActionStop?: BaseAction;
  request: (params?: any) => Promise<any>;
  requestParams?: any;
  requestCallback?: (options?: any) => void;
  conditionToMakeRequest?: () => boolean;
};

export type InitLoadManagerActionPayloadType = {
  options?: {
    fullActionLoadingStop?: BaseAction;
    fullActionLoadingStart?: BaseAction;
    setAppErrorAction?: BaseAction;
    requestsSectionId?: string;
    requestBeforeAllConfig?: BeforeRequestConfigType;
    disableErrorLoggerAllRequests?: boolean;
  };
  requestConfigList: Array<InitLoadManagerRequestOptionsType>;
};
