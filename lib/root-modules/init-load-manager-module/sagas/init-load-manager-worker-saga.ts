import { put, spawn } from 'redux-saga/effects';
import { uniqueId } from 'lodash-es';
import { InitLoadManagerActionPayloadType } from '../types';
import { spawnedFetchProcessSaga } from './spawned-fetch-process-saga';

export function* initLoadManagerWorkerSaga({
  payload: {
    requestConfigList,
    options: {
      fullActionLoadingStop,
      fullActionLoadingStart,
      setAppErrorAction,
    } = {},
  },
}: {
  payload: InitLoadManagerActionPayloadType;
}) {
  let counterRequests = 0;
  const abortSectionId = uniqueId('fetch_section');

  if (fullActionLoadingStart) {
    yield put(fullActionLoadingStart());
  }

  while (counterRequests < requestConfigList.length) {
    yield spawn(spawnedFetchProcessSaga, {
      ...requestConfigList[counterRequests],
      abortSectionId,
      setAppErrorAction,
    });

    // go to next request
    counterRequests += 1;
  }

  if (fullActionLoadingStop) {
    yield put(fullActionLoadingStop());
  }
}
