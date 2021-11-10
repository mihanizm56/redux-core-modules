import { Router } from 'router5';
import { Dispatch } from 'redux';
import { BaseAction } from '@/types';
import { IRedirectManagerPayload } from '../types';

type ParamsType = {
  payload: IRedirectManagerPayload;
  router?: Router;
  dispatch: Dispatch;
};

export function* redirectManagerWorkerSaga({
  payload: {
    pathName,
    params,
    actionAfterRedirect,
    callbackAfterRedirect,
    actionAfterRedirectParams,
    navigationParams,
  },
  router,
  dispatch,
}: ParamsType) {
  if (!router) {
    return;
  }

  try {
    // eslint-disable-next-line
    // @ts-ignore
    yield router.navigate(pathName, params, navigationParams, () => {
      if (actionAfterRedirect) {
        // cast type to dispatch in BaseAction style
        const action: BaseAction = actionAfterRedirectParams
          ? (actionAfterRedirect.bind(null, {
              ...actionAfterRedirectParams,
            }) as BaseAction)
          : (actionAfterRedirect as BaseAction);

        dispatch(action());
      }

      if (callbackAfterRedirect) {
        callbackAfterRedirect();
      }
    });
  } catch (error: any) {
    console.error('redirectManagerWorkerSaga catch error', error.message);
  }
}
