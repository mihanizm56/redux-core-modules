import { Action } from '@/types';

export interface IRedirectManagerPayload {
  pathName: string;
  params?: any;
  actionAfterRedirect?: Action<any>;
  actionAfterRedirectParams: Record<string, any>;
  reload?: boolean;
}
