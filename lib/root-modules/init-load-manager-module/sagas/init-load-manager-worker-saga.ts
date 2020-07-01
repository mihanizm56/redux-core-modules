import { put, spawn } from 'redux-saga/effects';
import { uniqueId } from 'lodash-es';
import { InitLoadManagerActionPayloadType } from '../types';
import { spawnedFetchProcessSaga } from './spawned-fetch-process-saga';

type ParamsType = InitLoadManagerActionPayloadType & {
  eventNameToCancelRequests?: string;
};

export function* initLoadManagerWorkerSaga({
  eventNameToCancelRequests,
  requestConfigList,
  options: {
    abortRequestsSectionId = uniqueId('fetch_default_section'),
    fullActionLoadingStop,
    fullActionLoadingStart,
    setAppErrorAction,
  } = {},
}: ParamsType) {
  let counterRequests = 0;

  if (fullActionLoadingStart) {
    yield put(fullActionLoadingStart());
  }

  while (counterRequests < requestConfigList.length) {
    yield spawn(spawnedFetchProcessSaga, {
      ...requestConfigList[counterRequests],
      abortRequestsSectionId,
      setAppErrorAction,
      eventNameToCancelRequests,
    });

    // go to next request
    counterRequests += 1;
  }

  if (fullActionLoadingStop) {
    yield put(fullActionLoadingStop());
  }
}
