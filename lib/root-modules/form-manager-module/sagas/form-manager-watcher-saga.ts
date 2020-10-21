import { take, fork, race, delay } from 'redux-saga/effects';
import { THROTTLE_TIMEOUT } from '@/constants';
import { FETCH_FORM_MANAGER } from '../actions';
import { FormManagerType } from '../types';
import { formManagerWorkerSaga } from './form-manager-worker-saga';

type ParamsType = {
  dependencies?: Record<string, any>;
};

export function* formManagerWatcherSaga({ dependencies }: ParamsType) {
  while (true) {
    let action: { payload: FormManagerType } = yield take(FETCH_FORM_MANAGER);

    while (true) {
      const { debounced, latestAction } = yield race({
        debounced: delay(THROTTLE_TIMEOUT),
        latestAction: take(FETCH_FORM_MANAGER),
      });

      if (debounced) {
        yield fork(formManagerWorkerSaga, {
          payload: action.payload,
          dependencies,
        });
        break;
      }

      action = latestAction;
    }
  }
}
