import { call, put, all } from 'redux-saga/effects';
import { AnyAction } from '../types';

type ParamsType = {
  request: () => Promise<any>;
  errorAction?: AnyAction;
  errorActionsArray?: Array<AnyAction>;
  requestValidator: (responseData: any) => boolean;
};

export function* requestErrorHandlerProcess({
  request,
  requestValidator,
  errorAction,
  errorActionsArray,
}: ParamsType) {
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
      code: 500,
      error: true,
      errorText: 'error-handler-error',
      data: null,
      additionalErrors: null,
    };
  }

  return responseData;
}
