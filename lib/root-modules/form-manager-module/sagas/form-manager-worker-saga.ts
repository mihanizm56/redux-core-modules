import { put, all, call } from 'redux-saga/effects';
import { Dispatch } from 'redux';
import { requestExtraDataHandlerActionSaga } from '@/root-modules/request-extra-data-handler-module';
import {
  redirectManagerSagaAction,
  IRedirectManagerPayload,
} from '@/root-modules/redirect-manager-module';
import { requestErrorHandlerProcess } from '@/utils/request-error-handler-process';
import { IAdvancedStore } from '@/types';
import { FormManagerType } from '../types';
import { getParsedError } from './_utils/get-parsed-error';

interface IFormManagerWorkerParams {
  payload: FormManagerType;
  store: IAdvancedStore;
  dispatch: Dispatch;
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
    requestErrorHandlerProcessParams,
    setFormExternalErrorsAction,
    disableErrorLogger,
    textMessageSuccess,
    titleMessageSuccess,
    getErrorModalActionTitle,
    titleMessageError,
    scrollToErrorOnField,
    scrollFormErrorsFormatterOnSuccess,
    scrollFormErrorsFormatterOnError,
  },
  store,
  dispatch,
}: IFormManagerWorkerParams) {
  const { setModalAction, sendErrorLogger } = store?.dependencies ?? {};

  let responseData;
  // set new "initial" form data - react-final-form needs because if rerender form - "initial" values will be from the very beginning
  if (resetInitialDataAction) {
    yield put(resetInitialDataAction(formValues));
  }

  if (loadingStartAction) {
    yield put(loadingStartAction());
  }

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
      // TODO FIX
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
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

    // format data
    const formattedData = responseDataFormatter
      ? responseDataFormatter(responseData.data)
      : responseData.data;

    // put usual function callback
    if (callBackOnSuccess) {
      yield callBackOnSuccess({ dispatch, responseData: formattedData });
    }

    // dispatch success actions
    if (formSuccessAction) {
      yield put(formSuccessAction(formattedData));
    } else if (formSuccessActionsArray && formSuccessActionsArray.length) {
      yield all(
        formSuccessActionsArray.map((successAction) =>
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
    if (
      showNotification &&
      (textMessageSuccess || titleMessageSuccess) &&
      setModalAction
    ) {
      yield put(
        setModalAction({
          status: 'success',
          title: titleMessageSuccess,
          text: textMessageSuccess,
        }),
      );
    }

    // if scroll util and no redirect
    // to use simple responseData.data => "errors" field should be used
    if (scrollToErrorOnField && !redirectErrorActionParams) {
      const formErrors =
        scrollFormErrorsFormatterOnSuccess?.(responseData.data) ??
        responseData.data?.errors;

      scrollToErrorOnField({ formErrors });
    }

    // handle success redirect
    if (redirectSuccessActionParams) {
      const redirectData: IRedirectManagerPayload =
        formatDataToRedirectParamsSuccess
          ? formatDataToRedirectParamsSuccess({
              ...redirectSuccessActionParams,
              ...formattedData,
            })
          : redirectSuccessActionParams;

      yield put(redirectManagerSagaAction(redirectData));
    }
  } catch (error) {
    console.error('formManagerWorkerSaga gets an error', error);

    // parse error data
    const errorData = getParsedError({ sagaName: 'FormManagerSaga', error });

    // get additionalErrors from rest and json-rpc requests
    // please - instruct your backend to prepare form errors in "errors" field
    // eslint-disable-next-line
    const additionalErrors = errorData?.additionalErrors?.errors ?? null

    // put usual function callback
    if (callBackOnError) {
      yield callBackOnError({ errorData, dispatch });
    }

    // dispatch fail actions
    if (setErrorAction) {
      yield put(setErrorAction(errorData.errorText));
    } else if (setErrorActionsArray && setErrorActionsArray.length) {
      yield all(
        setErrorActionsArray.map((errorAction) =>
          put(errorAction(errorData.errorText)),
        ), // eslint-disable-line
      );
    }

    // if scroll util and no redirect
    if (
      scrollToErrorOnField &&
      !redirectErrorActionParams &&
      errorData?.errorText
    ) {
      const formErrors =
        scrollFormErrorsFormatterOnError?.(errorData) ?? additionalErrors;

      scrollToErrorOnField({ formErrors });
    }

    // dispatch actions with additionalErrors to set errors to the form
    if (setFormExternalErrorsAction && additionalErrors) {
      yield put(setFormExternalErrorsAction(additionalErrors));
    }

    // trigger notification
    if (showNotification && setModalAction) {
      const customModalTitle =
        titleMessageError || getErrorModalActionTitle?.(errorData.errorText);

      const params = customModalTitle
        ? {
            status: 'error',
            title: customModalTitle,
            text: errorData.errorText,
          }
        : {
            status: 'error',
            text: errorData.errorText,
          };

      yield put(setModalAction(params));
    }

    if (sendErrorLogger && !disableErrorLogger) {
      sendErrorLogger({
        error,
        message: '[formManagerWorkerSaga]: get an error',
      });
    }

    // handle error redirect
    if (redirectErrorActionParams) {
      const redirectData: IRedirectManagerPayload =
        formatDataToRedirectParamsError
          ? formatDataToRedirectParamsError({
              ...redirectErrorActionParams,
              ...additionalErrors,
            })
          : redirectErrorActionParams;

      yield put(redirectManagerSagaAction(redirectData));
    }
  } finally {
    if (loadingStopAction) {
      yield put(loadingStopAction());
    }
  }
}
