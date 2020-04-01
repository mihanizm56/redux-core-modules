import { Action, BaseAction } from '../../types';

export type OptionsType = Array<{
  fieldName: string;
  action: Action<any> | BaseAction;
}>;
