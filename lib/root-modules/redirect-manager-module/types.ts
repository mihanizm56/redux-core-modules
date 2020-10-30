import { NavigationOptions } from 'router5';
import { AnyAction } from '@/types';

export interface IRedirectManagerPayload {
  pathName: string;
  params?: any;
  actionAfterRedirect?: AnyAction;
  actionAfterRedirectParams?: Record<string, any>;
  callbackAfterRedirect?: () => any;
  navigationParams?: NavigationOptions;
}
