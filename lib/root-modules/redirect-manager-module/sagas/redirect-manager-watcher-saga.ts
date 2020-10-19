import { take, fork } from 'redux-saga/effects';
import { Router } from 'router5';
import { REDIRECT_ACTION } from '../actions';
import { IRedirectManagerPayload } from '../types';
import { redirectManagerWorkerSaga } from './redirect-manager-worker-saga';

type PramsType = {
  router?: Router;
  dispatch: any;
};

export function* redirectManagerWatcherSaga({ router, dispatch }: PramsType) {
  while (true) {
    const { payload }: { payload: IRedirectManagerPayload } = yield take(
      REDIRECT_ACTION,
    );

    yield fork(redirectManagerWorkerSaga, {
      payload,
      router,
      dispatch,
    });
  }
}
