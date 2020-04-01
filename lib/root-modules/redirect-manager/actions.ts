import { Action } from '@/types';
import { IRedirectManagerPayload } from './types';

export const REDIRECT_ACTION = 'REDIRECT_ACTION';
export const redirectManagerSagaAction: Action<IRedirectManagerPayload> = (
  payload: IRedirectManagerPayload,
) => ({
  type: REDIRECT_ACTION,
  payload,
});
