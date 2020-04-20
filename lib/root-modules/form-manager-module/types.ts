import { Action, BaseAction } from '../../types';
import { IRedirectManagerPayload } from '../redirect-manager-module';

export type FormManagerType = {
  resetInitialDataAction?: Action<any>;
  formValues: any;
  formValuesFormatter?: (data: any) => any;
  loadingStartAction: BaseAction;
  loadingStopAction: BaseAction;
  formRequest: (params: any) => Promise<any>;
  requestSchema: any;
  setErrorAction?: Action<any>;
  setErrorActionsArray?: Array<Action<string>>;
  formSuccessAction?: Action<any> | BaseAction;
  formSuccessActionsArray?: Array<Action<any> | BaseAction>;
  showNotification?: boolean;
  callBackOnSuccess?: Function; // bad Function type because we often use different callback signatures
  callBackOnError?: Function; // bad Function type because we often use different callback signatures
  requestExtraDataHandlerOptions?: Array<{
    fieldName: string;
    action: Action<any> | BaseAction;
  }>;
  withoutFormattingError?: boolean;
  redirectSuccessActionParams?: IRedirectManagerPayload;
  redirectErrorActionParams?: IRedirectManagerPayload;
};
