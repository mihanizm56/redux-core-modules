import { put, all, call, select } from 'redux-saga/effects';
import {
  setModalAction,
  DEFAULT_SUCCESS_NOTIFICATION_MESSAGE,
} from '@wildberries/notifications';
import { getTranslationsBackendErrorsDictionary } from '@mihanizm56/i18n-react';
import { requestExtraDataHandlerActionSaga } from '@/root-modules/request-extra-data-handler-module';
import { redirectManagerSagaAction } from '@/root-modules/redirect-manager-module';
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
    redirectSuccessActionParams,
    redirectErrorActionParams,
  },
}: IFormManagerWorkerParams) {
  const langDict = yield select(getTranslationsBackendErrorsDictionary);

  // set new "initial" form data - react-final-form needs because if rerender form - "initial" values will be from the very beginning
  if (resetInitialDataAction) {
    yield put(resetInitialDataAction(formValues));
  }

  yield put(loadingStartAction());

  try {
    const { error, errorText, data } = yield call(formRequest, {
      langDict,
      body: formValuesFormatter ? formValuesFormatter(formValues) : formValues,
      isErrorTextStraightToOutput: withoutFormattingError,
    });

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
        }),
      );
    }

    if (redirectSuccessActionParams) {
      yield put(redirectManagerSagaAction(redirectSuccessActionParams));
    }
  } catch (error) {
    console.error('error in formRequest', error.message);

    // put usual function callback
    if (callBackOnError) {
      yield callBackOnError();
    }

    // dispatch fail actions
    if (setErrorAction) {
      yield put(setErrorAction(error.message));
    } else if (setErrorActionsArray && setErrorActionsArray.length) {
      yield all(
        setErrorActionsArray.map(errorAction =>
          put(errorAction(error.message)),
        ), // eslint-disable-line
      );
    }

    // trigger notification
    if (showNotification) {
      yield put(
        setModalAction({
          status: 'error',
          text: error.message,
        }),
      );
    }

    if (redirectErrorActionParams) {
      yield put(redirectManagerSagaAction(redirectErrorActionParams));
    }
  } finally {
    yield put(loadingStopAction());
  }
}
