import { call, put } from 'redux-saga/effects';
import { BeforeRequestConfigType } from '../types';

export function* extraRequestProcessSaga({
  request,
  requestParams,
  requestActionStart,
  requestActionStop,
  requestCallback,
}: BeforeRequestConfigType) {
  try {
    if (requestActionStart) {
      yield put(requestActionStart());
    }

    // make the request
    const result = yield call(request, requestParams);

    // callback fired
    if (requestCallback) {
      requestCallback(result);
    }
  } catch (error) {
    console.error('extraRequestProcessSaga catch the error', error);
  } finally {
    // loading stop
    if (requestActionStop) {
      yield put(requestActionStop());
    }
  }
}
