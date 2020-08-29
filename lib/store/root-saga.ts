import { spawn, all } from 'redux-saga/effects';
import { Router } from 'router5';
import { Dispatch, Store } from 'redux';
import { formManagerWatcherSaga } from '@/root-modules/form-manager-module';
import { initLoadManagerWatcherSaga } from '@/root-modules/init-load-manager-module';
import { redirectManagerWatcherSaga } from '@/root-modules/redirect-manager-module';
import { requestExtraDataHandlerWatcherSaga } from '@/root-modules/request-extra-data-handler-module';
import { downloadFilesManagerWatcherSaga } from '@/root-modules/download-files-manager';

type RootSagaParams = {
  router: Router;
  dispatch: Dispatch;
  rootSagas?: Record<string, any>;
  eventNameToCancelRequests?: string;
  store: Store;
};

export const createRootSaga = ({
  rootSagas = {},
  router,
  dispatch,
  eventNameToCancelRequests,
  store,
}: RootSagaParams) =>
  function* rootSaga() {
    yield spawn(downloadFilesManagerWatcherSaga);
    yield spawn(formManagerWatcherSaga);
    yield spawn(initLoadManagerWatcherSaga, {
      eventNameToCancelRequests,
      dispatch,
    });
    yield spawn(requestExtraDataHandlerWatcherSaga);
    yield spawn(redirectManagerWatcherSaga, { router, dispatch });

    // run additional root sagas
    yield all(
      Object.values(rootSagas).map(saga =>
        spawn(saga, { router, dispatch, eventNameToCancelRequests, store }),
      ),
    );
  };
