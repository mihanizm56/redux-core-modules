import { IResponse } from '@mihanizm56/fetch-api';
import { Action, BaseAction } from '@/types';

export type InitLoadManagerSourceType = {
  request: (options?: Record<string, any>) => Promise<IResponse>;
  requestOptions?: Record<string, any>;
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
};

export type InitLoadManagerActionPayloadType = {
  options?: {
    fullActionLoadingStop?: BaseAction;
    fullActionLoadingStart?: BaseAction;
  };
  requestConfigList: Array<InitLoadManagerSourceType>;
};
