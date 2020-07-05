import { put, spawn } from 'redux-saga/effects';
import { uniqueId } from 'lodash-es';
import { Dispatch } from 'redux';
import { InitLoadManagerActionPayloadType } from '../types';
import { INIT_LOAD_MANAGER_EVENT_NAME } from '../constants';
import { spawnedFetchProcessSaga } from './spawned-fetch-process-saga';

type ParamsType = InitLoadManagerActionPayloadType & {
  eventNameToCancelRequests?: string;
  dispatch: Dispatch;
};

export function* initLoadManagerWorkerSaga({
  dispatch,
  eventNameToCancelRequests,
  requestConfigList,
  options: {
    abortRequestsSectionId = uniqueId('fetch_default_section'),
    fullActionLoadingStop,
    fullActionLoadingStart,
    setAppErrorAction,
  } = {},
}: ParamsType) {
  // full list fo requests counter
  let counterRequests = 0;
  // counter of processed requests
  let counterOfEndedRequestProcesses = 0;
  // unique event name
  const eventToCatchEndedProcesses = `${INIT_LOAD_MANAGER_EVENT_NAME}_${abortRequestsSectionId}`;

  // add listener to end the whole list of requests
  document.addEventListener(
    eventToCatchEndedProcesses,
    function endProcessCallback(event: CustomEvent) {
      // increment the counter if the request matches
      if (event.detail.id === abortRequestsSectionId) {
        counterOfEndedRequestProcesses += 1;
      }

      if (counterOfEndedRequestProcesses === requestConfigList.length) {
        // dispatch the loadingStop action
        if (fullActionLoadingStop) {
          dispatch(fullActionLoadingStop());
        }

        // remove listener to end the whole list of requests
        document.removeEventListener(
          eventToCatchEndedProcesses,
          endProcessCallback,
        );
      }
    },
  );

  if (fullActionLoadingStart) {
    yield put(fullActionLoadingStart());
  }

  while (counterRequests < requestConfigList.length) {
    yield spawn(spawnedFetchProcessSaga, {
      ...requestConfigList[counterRequests],
      abortRequestsSectionId,
      setAppErrorAction,
      eventNameToCancelRequests,
      eventToCatchEndedProcesses,
    });

    // go to next request
    counterRequests += 1;
  }
}
