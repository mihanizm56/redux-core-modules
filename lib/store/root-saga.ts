import { all, fork } from 'redux-saga/effects';
import { Router } from 'router5';
import { Dispatch } from 'redux';
import { formManagerWatcherSaga } from '@/root-modules/form-manager-module';
import { initLoadManagerWatcherSaga } from '@/root-modules/init-load-manager-module';
import { redirectManagerWatcherSaga } from '@/root-modules/redirect-manager-module';
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
