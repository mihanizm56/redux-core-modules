import { take, fork, race, delay } from 'redux-saga/effects';
import { Dispatch } from 'redux';
import { THROTTLE_TIMEOUT } from '@/constants';
import { IAdvancedStore } from '@/types';
import { DOWNLOAD_FILE_MANAGER } from '../actions';
import { DownloadFilesManagerType } from '../types';
import { downloadFilesManagerWorkerSaga } from './download-files-manager-worker-saga';

type ParamsType = {
  store: IAdvancedStore;
  dispatch: Dispatch;
};

export function* downloadFilesManagerWatcherSaga({
  store,
  dispatch,
}: ParamsType) {
  while (true) {
    let action: { payload: DownloadFilesManagerType } = yield take(
      DOWNLOAD_FILE_MANAGER,
    );

    while (true) {
      const { debounced, latestAction } = yield race({
        debounced: delay(THROTTLE_TIMEOUT),
        latestAction: take(DOWNLOAD_FILE_MANAGER),
      });

      if (debounced) {
        yield fork(downloadFilesManagerWorkerSaga, {
          ...action.payload,
          store,
          dispatch,
        });
        break;
      }

      action = latestAction;
    }
  }
}
