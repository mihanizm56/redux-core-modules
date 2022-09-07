import { Dispatch } from 'redux';
import { take, fork } from 'redux-saga/effects';
import { IAdvancedStore } from '@/types';
import { INIT_REQUEST_HANDLER_ACTION_SAGA } from '../actions';
import { requestExtraDataHandlerWorkerSaga } from './request-extra-data-handler-worker-saga';

type ParamsType = {
  dispatch: Dispatch;
  store: IAdvancedStore;
};

export function* requestExtraDataHandlerWatcherSaga({ store }: ParamsType) {
  while (true) {
    const { payload } = yield take(INIT_REQUEST_HANDLER_ACTION_SAGA);

    yield fork(requestExtraDataHandlerWorkerSaga, { ...payload, store });
  }
}
