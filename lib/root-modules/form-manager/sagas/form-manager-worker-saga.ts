import { put, all, call } from 'redux-saga/effects';
import { uniqueId } from 'lodash-es';
import { getFormattedResponseErrorText } from '@mihanizm56/fetch-api';
import {
  setModalAction,
  DEFAULT_SUCCESS_NOTIFICATION_MESSAGE,
} from '@/root-modules/notifications';
import { requestExtraDataHandlerActionSaga } from '@/root-modules/request-extra-data-handler-module';
import { FormManagerType } from '../types';

interface IFormManagerWorkerParams {
  payload: FormManagerType;
}

export function* formManagerWorkerSaga({
  payload: {
    resetInitialDataAction,
    formValues,
    formRequest,
    loadingStartAction,
    loadingStopAction,
    setErrorAction,
    setErrorActionsArray,
    formSuccessAction,
    formSuccessActionsArray,
    showNotification,
    callBackOnSuccess,
    callBackOnError,
    requestExtraDataHandlerOptions,
    formValuesFormatter,
    withoutFormattingError,
  },
}: IFormManagerWorkerParams) {
  // set new "initial" form data - react-final-form needs because if rerender form - "initial" values will be from the very beginning
  if (resetInitialDataAction) {
    yield put(resetInitialDataAction(formValues));
  }

  yield put(loadingStartAction());

  // format data before to send
  const dataToSend = formValuesFormatter
    ? formValuesFormatter(formValues)
    : formValues;

  try {
    const { error, errorText, data } = yield call(formRequest, dataToSend);

    if (error) {
      throw new Error(errorText);
    }

    // put usual function callback
    if (callBackOnSuccess) {
      yield callBackOnSuccess();
    }

    // dispatch success actions
    if (formSuccessAction) {
      yield put(formSuccessAction(data));
    } else if (formSuccessActionsArray && formSuccessActionsArray.length) {
      yield all(
        formSuccessActionsArray.map(successAction => put(successAction(data))),
      );
    }

    // custom data redux actions in one middleware
    if (requestExtraDataHandlerOptions) {
      yield put(
        requestExtraDataHandlerActionSaga({
          data,
          options: requestExtraDataHandlerOptions,
          formValues,
        }),
      );
    }

    // trigger notification
    if (showNotification) {
      yield put(
        setModalAction({
          status: 'success',
          text: DEFAULT_SUCCESS_NOTIFICATION_MESSAGE,
          id: uniqueId('notification_'),
        }),
      );
    }
  } catch (error) {
    // get formatted error message
    const formattedErrorText = !withoutFormattingError
      ? getFormattedResponseErrorText(error.message)
      : error.message;
    console.error('error', 'error in formRequest', error.message);

    // put usual function callback
    if (callBackOnError) {
      yield callBackOnError();
    }

    // dispatch fail actions
    if (setErrorAction) {
      yield put(setErrorAction(formattedErrorText));
    } else if (setErrorActionsArray && setErrorActionsArray.length) {
      yield all(
        setErrorActionsArray.map(errorAction =>
          put(errorAction(formattedErrorText)),
        ), // eslint-disable-line
      );
    }

    // trigger notification
    if (showNotification) {
      yield put(
        setModalAction({
          status: 'error',
          text: formattedErrorText,
          id: uniqueId('notification_'),
        }),
      );
    }
  } finally {
    yield put(loadingStopAction());
  }
}
