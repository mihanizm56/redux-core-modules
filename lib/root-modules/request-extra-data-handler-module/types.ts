import { Action, BaseAction } from '../../types';

export type InitRequestHandlerActionType = Array<{
  fieldName: string;
  action: Action<any> | BaseAction;
}>;
