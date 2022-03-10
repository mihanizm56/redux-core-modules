import { fork, put, spawn } from 'redux-saga/effects';
import uniqueId from 'uniqid';
import { Dispatch } from 'redux';
import { getIsClient } from '@/utils';
import { IAdvancedStore } from '@/types';
import { InitLoadManagerActionPayloadType } from '../types';
import { INIT_LOAD_MANAGER_EVENT_NAME } from '../constants';
import { spawnedFetchProcessSaga } from './spawned-fetch-process-saga';
import { extraRequestProcessSaga } from './extra-request-process-saga';

type ParamsType = InitLoadManagerActionPayloadType & {
  eventNameToCancelRequests?: string;
  dispatch: Dispatch;
  dependencies?: Record<string, any>;
  store: IAdvancedStore;
};

export function* initLoadManagerWorkerSaga({
  dispatch,
  eventNameToCancelRequests,
  requestConfigList,
  options: {
    requestsSectionId = uniqueId('fetch_default_section'),
    fullActionLoadingStop,
    fullActionLoadingStart,
    setAppErrorAction,
    requestBeforeAllConfig,
    disableErrorLoggerAllRequests,
  } = {},
  dependencies,
  store,
}: ParamsType) {
  const isNode = !getIsClient();

  // на сервере нам надо сделать процессы которые могут быть отслеживаемыми (fork)
  // на клиенте нам надо сделать процессы которые могут быть неубиваемыми (spawn)
  const subprocessMethod = isNode ? fork : spawn;

  if (requestConfigList.length === 0) {
    console.warn('please, provide non empty requestConfigList');

    return;
  }

  // make the blocking extra request before all initial requests (for example - i18next request)
  if (requestBeforeAllConfig) {
    yield* extraRequestProcessSaga(requestBeforeAllConfig);
  }

  // full list fo requests counter
  let counterRequests = 0;
  // counter of processed requests
  let counterOfEndedRequestProcesses = 0;
  // unique event name
  const eventToCatchEndedProcesses = `${INIT_LOAD_MANAGER_EVENT_NAME}_${requestsSectionId}`;

  if (!isNode) {
    document.addEventListener(
      eventToCatchEndedProcesses,
      function endProcessCallback(event: CustomEvent) {
        // increment the counter if the request matches
        if (event.detail.id === requestsSectionId) {
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
            true,
          );
        }
      },
      true,
    );

    if (fullActionLoadingStart) {
      yield put(fullActionLoadingStart());
    }
  }

  while (counterRequests < requestConfigList.length) {
    yield subprocessMethod(spawnedFetchProcessSaga, {
      ...requestConfigList[counterRequests],
      requestsSectionId,
      setAppErrorAction,
      eventNameToCancelRequests,
      eventToCatchEndedProcesses,
      dependencies,
      store,
      dispatch,
      disableErrorLoggerAllRequests,
    });

    // go to next request
    counterRequests += 1;
  }
}
