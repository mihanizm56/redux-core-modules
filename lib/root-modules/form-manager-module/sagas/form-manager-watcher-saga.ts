import { take, fork } from 'redux-saga/effects';
import { FETCH_FORM_MANAGER } from '../actions';
import { FormManagerType } from '../types';
import { formManagerWorkerSaga } from './form-manager-worker-saga';

type ParamsType = {
  dependencies?: Record<string, any>;
};

export function* formManagerWatcherSaga({ dependencies }: ParamsType) {
  while (true) {
    const { payload }: { payload: FormManagerType } = yield take(
      FETCH_FORM_MANAGER,
    );

    yield fork(formManagerWorkerSaga, { payload, dependencies });
  }
}
