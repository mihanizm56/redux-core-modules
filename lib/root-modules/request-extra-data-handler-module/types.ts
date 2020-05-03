import { Action, BaseAction } from '../../types';

export type RequestExtraDataHandlerActionSagaType = {
  data: any;
  options: InitRequestHandlerActionType;
};

export type InitRequestHandlerActionType = Array<{
  fieldName: string;
  action: Action<any> | BaseAction;
}>;
