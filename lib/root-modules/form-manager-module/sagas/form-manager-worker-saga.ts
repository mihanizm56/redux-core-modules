import { put, all, call } from 'redux-saga/effects';
import { setModalAction } from '@wildberries/notifications';
import { requestExtraDataHandlerActionSaga } from '@/root-modules/request-extra-data-handler-module';
import {
  redirectManagerSagaAction,
  IRedirectManagerPayload,
} from '@/root-modules/redirect-manager-module';
import { requestErrorHandlerProcess } from '@/utils/request-error-handler-process';
import { FormManagerType } from '../types';
import { getParsedError } from './_utils/get-parsed-error';

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
    requestErrorHandlerProcessParams,
    setFormExternalErrorsAction,
  },
}: IFormManagerWorkerParams) {
  let responseData;
  // set new "initial" form data - react-final-form needs because if rerender form - "initial" values will be from the very beginning
  if (resetInitialDataAction) {
    yield put(resetInitialDataAction(formValues));
  }

  yield put(loadingStartAction());

  const formattedFormValues = formValuesFormatter
    ? formValuesFormatter(formValues)
    : formValues;

  try {
    if (requestErrorHandlerProcessParams) {
      responseData = yield* requestErrorHandlerProcess({
        ...requestErrorHandlerProcessParams,
        request: () =>
          formRequest({
            body: formattedFormValues,
            isErrorTextStraightToOutput: Boolean(withoutFormattingError),
          }),
      });
    } else {
      responseData = yield call(formRequest, {
        body: formattedFormValues,
        isErrorTextStraightToOutput: Boolean(withoutFormattingError),
      });
    }

    if (responseData.error) {
      // serialize data to be catched to the "catch" block and to be parsed
      throw new Error(
        JSON.stringify({
          errorText: responseData.errorText,
          additionalErrors: responseData.additionalErrors,
        }),
      );
    }

    // put usual function callback
    // PLEASE DO NOT USE THIS IN YOUR REGULAR CASES
    // THIS IS A SYSTEM FEATURE AND IT IS DEPRECATED
    if (callBackOnSuccess) {
      // eslint-disable-next-line
      console.warn('You Are using the DEPRECATED method "callBackOnSuccess", this will be REMOVED in next major release!!!');
      yield callBackOnSuccess();
    }

    // format data
    const formattedData = responseDataFormatter
      ? responseDataFormatter(responseData.data)
      : responseData.data;

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
          title: textMessageSuccess,
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
    // parse error data
    const errorData = getParsedError({sagaName:'FormManagerSaga',error})

    // get additionalErrors from rest and json-rpc requests
    // eslint-disable-next-line
    const additionalErrors = errorData.additionalErrors?.errors ?? errorData?.additionalErrors

    // put usual function callback
    // PLEASE DO NOT USE THIS IN YOUR REGULAR CASES
    // THIS IS A SYSTEM FEATURE AND IT IS DEPRECATED
    if (callBackOnError) {
      // eslint-disable-next-line
      console.warn('You Are using the DEPRECATED method "callBackOnError", this will be REMOVED in next major release!!!');
      yield callBackOnError();
    }

    // dispatch fail actions
    if (setErrorAction) {
      yield put(setErrorAction(errorData.errorText));
    } else if (setErrorActionsArray && setErrorActionsArray.length) {
      yield all(
        setErrorActionsArray.map(errorAction =>
          put(errorAction(errorData.errorText)),
        ), // eslint-disable-line
      );
    }

    // dispatch actions with additionalErrors to set errors to the form
    if (setFormExternalErrorsAction && additionalErrors) {
      yield put(setFormExternalErrorsAction(additionalErrors));
    }

    // trigger notification
    if (showNotification) {
      yield put(
        setModalAction({
          status: 'error',
          title: errorData.errorText,
        }),
      );
    }

    // handle error redirect
    if (redirectErrorActionParams) {
      const redirectData: IRedirectManagerPayload = formatDataToRedirectParamsError
        ? formatDataToRedirectParamsError({
            ...redirectErrorActionParams,
            ...additionalErrors,
          })
        : redirectErrorActionParams;

      yield put(redirectManagerSagaAction(redirectData));
    }
  } finally {
    yield put(loadingStopAction());
  }
}
