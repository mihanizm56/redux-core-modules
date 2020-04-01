import { Router } from 'router5';
import { noop } from '@/utils/noop';
import { IRedirectManagerPayload } from '../types';

interface IFormManagerWorkerParams {
  payload: IRedirectManagerPayload;
  router: Router;
  dispatch: any;
}

export function* redirectManagerWorkerSaga({
  payload: {
    pathName,
    params,
    actionAfterRedirect = noop,
    actionAfterRedirectParams,
    reload,
  },
  router,
  dispatch,
}: IFormManagerWorkerParams) {
  yield router.navigate(pathName, params, { reload: Boolean(reload) }, () =>
    dispatch(actionAfterRedirect({ ...actionAfterRedirectParams })),
  ); // eslint-disable-line
}
