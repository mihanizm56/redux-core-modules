import { take, fork } from 'redux-saga/effects';
import { Dispatch } from 'redux';
import { INIT_LOAD_MANAGER_ACTION_SAGA } from '../actions';
import { InitLoadManagerActionPayloadType } from '../types';
import { initLoadManagerWorkerSaga } from './init-load-manager-worker-saga';

type ParamsType = {
  eventNameToCancelRequests?: string;
  dispatch: Dispatch;
  dependencies?: Record<string, any>;
};

export function* initLoadManagerWatcherSaga({
  eventNameToCancelRequests,
  dispatch,
  dependencies,
}: ParamsType) {
  while (true) {
    const {
      payload,
    }: { payload: InitLoadManagerActionPayloadType } = yield take(
      INIT_LOAD_MANAGER_ACTION_SAGA,
    );

    yield fork(initLoadManagerWorkerSaga, {
      ...payload,
      eventNameToCancelRequests,
      dispatch,
      dependencies,
    });
  }
}
