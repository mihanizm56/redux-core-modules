import { put, all, call } from 'redux-saga/effects';
import { setModalAction } from '@wildberries/notifications';
import { requestExtraDataHandlerActionSaga } from '@/root-modules/request-extra-data-handler-module';
import {
  redirectManagerSagaAction,
  IRedirectManagerPayload,
} from '@/root-modules/redirect-manager-module';
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
    responseDataFormatter,
    withoutFormattingError,
    redirectSuccessActionParams,
    redirectErrorActionParams,
    formatDataToRedirectParamsSuccess,
    formatDataToRedirectParamsError,
    textMessageSuccess,
  },
}: IFormManagerWorkerParams) {
  // set new "initial" form data - react-final-form needs because if rerender form - "initial" values will be from the very beginning
  if (resetInitialDataAction) {
    yield put(resetInitialDataAction(formValues));
  }

  yield put(loadingStartAction());

  try {
    const { error, errorText, data } = yield call(formRequest, {
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

    // format data
    const formattedData = responseDataFormatter
      ? responseDataFormatter(data)
      : data;

    // dispatch success actions
    if (formSuccessAction) {
      yield put(formSuccessAction(formattedData));
    } else if (formSuccessActionsArray && formSuccessActionsArray.length) {
      yield all(
        formSuccessActionsArray.map(successAction =>
          put(successAction(formattedData)),
        ),
      );
    }

    // custom data redux actions in one middleware
    if (requestExtraDataHandlerOptions) {
      yield put(
        requestExtraDataHandlerActionSaga({
          data: formattedData,
          options: requestExtraDataHandlerOptions,
        }),
      );
    }

    // trigger success notification
    if (showNotification && textMessageSuccess) {
      yield put(
        setModalAction({
          status: 'success',
          text: textMessageSuccess,
        }),
      );
    }

    // handle success redirect
    if (redirectSuccessActionParams) {
      const redirectData: IRedirectManagerPayload = formatDataToRedirectParamsSuccess
        ? formatDataToRedirectParamsSuccess({
            ...redirectSuccessActionParams,
            ...formattedData,
          })
        : redirectSuccessActionParams;

      yield put(redirectManagerSagaAction(redirectData));
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

    // handle error redirect
    if (redirectErrorActionParams) {
      const redirectData: IRedirectManagerPayload = formatDataToRedirectParamsError
        ? formatDataToRedirectParamsError({
            ...redirectErrorActionParams,
            ...error.additionalErrors,
          })
        : redirectErrorActionParams;

      yield put(redirectManagerSagaAction(redirectData));
    }
  } finally {
    yield put(loadingStopAction());
  }
}
