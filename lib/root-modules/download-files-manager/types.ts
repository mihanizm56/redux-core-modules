import { BaseAction, AnyAction } from '../../types';

export const FILE_TYPES = {
  blob: 'blob',
  base64: 'base64',
};

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
};
