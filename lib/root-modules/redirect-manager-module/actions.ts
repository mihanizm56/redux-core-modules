import { Action } from '@/types';
import { IRedirectManagerPayload } from './types';

export const REDIRECT_ACTION = '@redux-core-modules/REDIRECT_ACTION';
export const redirectManagerSagaAction: Action<IRedirectManagerPayload> = (
  payload: IRedirectManagerPayload,
) => ({
  type: REDIRECT_ACTION,
  payload,
});

export const REDIRECT_ACTION_PLATFORM = '@redux-core-modules/REDIRECT_ACTION';
export const redirectToPlatformRouteManagerSagaAction: Action<IRedirectManagerPayload> = (
  payload: IRedirectManagerPayload,
) => ({
  type: REDIRECT_ACTION,
  payload,
});
