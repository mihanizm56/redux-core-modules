import { Router } from 'router5';
import { Dispatch } from 'redux';
import { BaseAction } from '@/types';
import { IRedirectManagerPayload } from '../types';

interface IFormManagerWorkerParams {
  payload: IRedirectManagerPayload;
  router: Router;
  dispatch: Dispatch;
}

export function* redirectManagerWorkerSaga({
  payload: {
    pathName,
    params,
    actionAfterRedirect,
    actionAfterRedirectParams,
    reload,
  },
  router,
  dispatch,
}: IFormManagerWorkerParams) {
  yield router.navigate(pathName, params, { reload: Boolean(reload) }, () => {
    if (actionAfterRedirect) {
      // cast type to dispatch in BaseAction style
      const action: BaseAction = actionAfterRedirectParams
        ? (actionAfterRedirect.bind(null, {
            ...actionAfterRedirectParams,
          }) as BaseAction)
        : (actionAfterRedirect as BaseAction);

      dispatch(action());
    }
  });
}
