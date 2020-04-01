import { all, fork } from 'redux-saga/effects';
import { Router } from 'router5';
import { Dispatch } from 'redux';
import { formManagerWatcherSaga } from '@/root-modules/form-manager';
import { initLoadManagerWatcherSaga } from '@/root-modules/init-load-manager';
import { redirectManagerWatcherSaga } from '@/root-modules/redirect-manager';
import { requestExtraDataHandlerWatcherSaga } from '@/root-modules/request-extra-data-handler-module';

type RootSagaParams = {
  router: Router;
  dispatch: Dispatch;
};

export function* rootSaga({ router, dispatch }: RootSagaParams) {
  yield all([
    fork(formManagerWatcherSaga),
    fork(initLoadManagerWatcherSaga),
    fork(requestExtraDataHandlerWatcherSaga),
    fork(redirectManagerWatcherSaga, { router, dispatch }),
  ]);
}
