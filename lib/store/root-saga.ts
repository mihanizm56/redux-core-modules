import { spawn, all, fork } from 'redux-saga/effects';
import { Router } from 'router5';
import { formManagerWatcherSaga } from '@/root-modules/form-manager-module';
import { initLoadManagerWatcherSaga } from '@/root-modules/init-load-manager-module';
import { redirectManagerWatcherSaga } from '@/root-modules/redirect-manager-module';
import { requestExtraDataHandlerWatcherSaga } from '@/root-modules/request-extra-data-handler-module';
import { downloadFilesManagerWatcherSaga } from '@/root-modules/download-files-manager';
import { getIsClient, injectAsyncSaga } from '@/utils';
import { IAdvancedStore } from '@/types';

type RootSagaParams = {
  router?: Router;
  rootSagas?: Record<string, any>;
  eventNameToCancelRequests?: string;
  store: IAdvancedStore;
};

export const createRootSaga = ({
  rootSagas = {},
  router,
  eventNameToCancelRequests,
  store,
}: RootSagaParams) =>
  function* rootSaga() {
    // вытаскиваем диспатч для корневый саги
    const dispatch = store.dispatch;

    const isNode = !getIsClient();

    if (isNode) {
      // на сервере нам надо сделать процессы которые могут быть отслеживаемыми (fork)
      // на клиенте нам надо сделать процессы которые могут быть неубиваемыми (spawn)
      yield all([
        fork(downloadFilesManagerWatcherSaga, { dispatch, store }),
        fork(formManagerWatcherSaga, { dispatch, store }),
        fork(initLoadManagerWatcherSaga, {
          eventNameToCancelRequests,
          dispatch,
          store,
        }),
        fork(requestExtraDataHandlerWatcherSaga),
        fork(redirectManagerWatcherSaga, { router, dispatch }),
      ]);

      yield all(
        Object.entries(rootSagas).map(([name, saga]) => {
          return injectAsyncSaga({
            saga,
            name,
            store,
            isRoot: true,
          });
        }),
      );
    } else {
      yield spawn(downloadFilesManagerWatcherSaga, { store, dispatch });
      yield spawn(formManagerWatcherSaga, { store, dispatch });
      yield spawn(initLoadManagerWatcherSaga, {
        eventNameToCancelRequests,
        dispatch,
        store,
      });
      yield spawn(requestExtraDataHandlerWatcherSaga);

      if (Boolean(router)) {
        yield spawn(redirectManagerWatcherSaga, { router, dispatch });
      }

      // run additional root sagas
      yield all(
        Object.entries(rootSagas).map(([name, saga]) => {
          return injectAsyncSaga({
            saga,
            name,
            store,
            isRoot: true,
          });
        }),
      );
    }
  };
