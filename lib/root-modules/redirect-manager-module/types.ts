import { Action, BaseAction } from '@/types';

export interface IRedirectManagerPayload {
  pathName: string;
  params?: any;
  actionAfterRedirect?: Action<any> | BaseAction;
  actionAfterRedirectParams: Record<string, any>;
  reload?: boolean;
}
