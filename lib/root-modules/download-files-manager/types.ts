import { Dispatch } from 'redux';
import { FILE_TYPES } from '@/constants';
import { BaseAction, AnyAction } from '../../types';

export type ResponseDataFormatterReturnType = {
  file: any;
  contentType: string;
  name: string;
};

export type DownloadFilesManagerType = {
  downloadFileRequest: (params?: any) => Promise<any>;
  requestParams?: any;
  loadingStartAction?: BaseAction;
  loadingStopAction?: BaseAction;
  setErrorAction?: AnyAction;
  setErrorActionsArray?: Array<AnyAction>;
  formSuccessAction?: AnyAction;
  formSuccessActionsArray?: Array<AnyAction>;
  showNotificationError?: boolean;
  showNotificationSuccess?: boolean;
  notificationSuccessMessage?: string;
  fileType: keyof typeof FILE_TYPES;
  responseDataFormatter?: (response: any) => ResponseDataFormatterReturnType;
  dependencies?: Record<string, any>;
  callBackOnSuccess?: (params: { dispatch: Dispatch }) => void;
  callBackOnError?: (params: { dispatch: Dispatch }) => void;
};
