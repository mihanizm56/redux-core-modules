import { spawn, all } from 'redux-saga/effects';
import { Router } from 'router5';
import { Dispatch } from 'redux';
import { formManagerWatcherSaga } from '@/root-modules/form-manager-module';
import { initLoadManagerWatcherSaga } from '@/root-modules/init-load-manager-module';
import { redirectManagerWatcherSaga } from '@/root-modules/redirect-manager-module';
import { requestExtraDataHandlerWatcherSaga } from '@/root-modules/request-extra-data-handler-module';

type RootSagaParams = {
  router: Router;
  dispatch: Dispatch;
  // todo fix type
  rootSagas?: Record<string, any>;
};

export const createRootSaga = ({
  rootSagas = [],
  router,
  dispatch,
}: RootSagaParams) =>
  function* rootSaga() {
    yield spawn(formManagerWatcherSaga);
    yield spawn(initLoadManagerWatcherSaga);
    yield spawn(requestExtraDataHandlerWatcherSaga);
    yield spawn(redirectManagerWatcherSaga, { router, dispatch });

    // run additional root sagas
    yield all(
      Object.values(rootSagas).map(saga => spawn(saga, { router, dispatch })),
    );
  };
