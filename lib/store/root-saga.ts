import { spawn, all } from 'redux-saga/effects';
import { Router } from 'router5';
import { Dispatch, Store } from 'redux';
import { formManagerWatcherSaga } from '@/root-modules/form-manager-module';
import { initLoadManagerWatcherSaga } from '@/root-modules/init-load-manager-module';
import { redirectManagerWatcherSaga } from '@/root-modules/redirect-manager-module';
import { requestExtraDataHandlerWatcherSaga } from '@/root-modules/request-extra-data-handler-module';
import { downloadFilesManagerWatcherSaga } from '@/root-modules/download-files-manager';

type RootSagaParams = {
  router?: Router;
  dispatch: Dispatch;
  rootSagas?: Record<string, any>;
  eventNameToCancelRequests?: string;
  store: Store;
  dependencies?: Record<string, any>;
};

export const createRootSaga = ({
  rootSagas = {},
  router,
  dispatch,
  eventNameToCancelRequests,
  store,
  dependencies,
}: RootSagaParams) =>
  function* rootSaga() {
    yield spawn(downloadFilesManagerWatcherSaga, { dependencies });
    yield spawn(formManagerWatcherSaga, { dependencies });
    yield spawn(initLoadManagerWatcherSaga, {
      eventNameToCancelRequests,
      dispatch,
      dependencies,
    });
    yield spawn(requestExtraDataHandlerWatcherSaga);
    yield spawn(redirectManagerWatcherSaga, { router, dispatch });

    // run additional root sagas
    yield all(
      Object.values(rootSagas).map(saga =>
        spawn(saga, {
          router,
          dispatch,
          eventNameToCancelRequests,
          store,
          dependencies,
        }),
      ),
    );
  };
