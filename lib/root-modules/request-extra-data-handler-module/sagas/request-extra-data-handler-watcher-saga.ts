import { take, fork } from 'redux-saga/effects';
import { INIT_REQUEST_HANDLER_ACTION_SAGA } from '../actions';
import { requestExtraDataHandlerWorkerSaga } from './request-extra-data-handler-worker-saga';

export function* requestExtraDataHandlerWatcherSaga() {
  while (true) {
    const { payload } = yield take(INIT_REQUEST_HANDLER_ACTION_SAGA);

    yield fork(requestExtraDataHandlerWorkerSaga, payload);
  }
}
