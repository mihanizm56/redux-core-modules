import { take, fork } from 'redux-saga/effects';
import { Router } from 'router5';
import { REDIRECT_ACTION } from '../actions';
import { IRedirectManagerPayload } from '../types';
import { redirectManagerWorkerSaga } from './redirect-manager-worker-saga';

export function* redirectManagerWatcherSaga({
  router,
  dispatch,
}: {
  router?: Router;
  dispatch: any;
}) {
  while (true) {
    const { payload }: { payload: IRedirectManagerPayload } = yield take(
      REDIRECT_ACTION,
    );

    yield fork(redirectManagerWorkerSaga, { payload, router, dispatch });
  }
}
