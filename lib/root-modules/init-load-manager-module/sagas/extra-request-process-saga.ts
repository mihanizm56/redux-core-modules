import { call, put } from 'redux-saga/effects';
import { BeforeRequestConfigType } from '../types';

export function* extraRequestProcessSaga({
  request,
  requestParams,
  requestActionStart,
  requestActionStop,
  requestCallback,
  conditionToMakeRequest,
}: BeforeRequestConfigType) {
  try {
    if (requestActionStart) {
      yield put(requestActionStart());
    }

    const isConfirmed = conditionToMakeRequest
      ? conditionToMakeRequest()
      : true;

    if (isConfirmed) {
      // make the request
      // TODO FIX
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const result = yield call(request, requestParams);

      // callback fired
      if (requestCallback) {
        requestCallback(result);
      }
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
