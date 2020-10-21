import { take, fork, race, delay } from 'redux-saga/effects';
import { THROTTLE_TIMEOUT } from '@/constants';
import { DOWNLOAD_FILE_MANAGER } from '../actions';
import { DownloadFilesManagerType } from '../types';
import { downloadFilesManagerWorkerSaga } from './download-files-manager-worker-saga';

type ParamsType = {
  dependencies?: Record<string, any>;
};

// export function* downloadFilesManagerWatcherSaga({ dependencies }: ParamsType) {
//   let lastTask;

//   while (true) {
//     const { payload }: { payload: DownloadFilesManagerType } = yield take(
//       DOWNLOAD_FILE_MANAGER,
//     );

//     if (lastTask) {
//       yield cancel(lastTask);
//     }

//     lastTask = yield fork(downloadFilesManagerWorkerSaga, {
//       ...payload,
//       dependencies,
//     });
//   }
// }

export function* downloadFilesManagerWatcherSaga({ dependencies }: ParamsType) {
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
          dependencies,
        });
        break;
      }

      action = latestAction;
    }
  }
}
