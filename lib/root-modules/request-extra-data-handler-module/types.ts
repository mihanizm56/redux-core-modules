import { Action, BaseAction, IErrorLogger } from '../../types';

export type InitRequestHandlerActionType = Array<{
  fieldName: string;
  action: Action<any> | BaseAction;
}>;

export type RequestExtraDataHandlerActionSagaType = {
  data: any;
  options: InitRequestHandlerActionType;
  errorLogger?: IErrorLogger;
};
