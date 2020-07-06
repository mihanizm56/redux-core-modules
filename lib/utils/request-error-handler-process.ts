import { call, put, all } from 'redux-saga/effects';
import { DEFAULT_ERROR_TEXT } from '@/constants';
import { AnyAction } from '../types';

export type RequestErrorHandlerProcessParamsType = {
  request: (params?: any) => Promise<any>;
  errorAction?: AnyAction;
  errorActionsArray?: Array<AnyAction>;
  requestValidator: (responseData: any) => boolean;
};

export function* requestErrorHandlerProcess({
  request,
  requestValidator,
  errorAction,
  errorActionsArray,
}: RequestErrorHandlerProcessParamsType) {
  // get request data
  const responseData = yield call(request);
  // get response validation
  const isResponseValid = requestValidator(responseData);
  // call error action(s)
  if (!isResponseValid) {
    if (errorAction) {
      yield put(errorAction());
    } else if (errorActionsArray) {
      yield all(errorActionsArray.map(action => put(action())));
    }

    // provide th default error response
    return {
      code: 400,
      error: true,
      errorText: DEFAULT_ERROR_TEXT,
      data: null,
      additionalErrors: null,
    };
  }

  return responseData;
}
