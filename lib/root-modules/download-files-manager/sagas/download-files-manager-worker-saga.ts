import { put, call, all } from 'redux-saga/effects';
import { Dispatch } from 'redux';
import { downloadFile } from '@/utils';
import { IAdvancedStore } from '@/types';
import { getParsedError } from '@/root-modules/form-manager-module/sagas/_utils/get-parsed-error';
import { DownloadFilesManagerType } from '../types';

type ParamsType = DownloadFilesManagerType & {
  dispatch: Dispatch;
  store: IAdvancedStore;
};

export function* downloadFilesManagerWorkerSaga({
  downloadFileRequest,
  requestParams,
  loadingStartAction,
  loadingStopAction,
  setErrorAction,
  setErrorActionsArray,
  formSuccessAction,
  formSuccessActionsArray,
  showNotificationError,
  showNotificationSuccess,
  notificationSuccessMessage,
  fileType,
  responseDataFormatter,
  store,
  callBackOnSuccess,
  callBackOnError,
  dispatch,
  titleMessageError,
  getErrorModalActionTitle,
  errorLogger,
}: ParamsType) {
  const { setModalAction, errorLoggerGlobal } = store?.dependencies ?? {};

  try {
    if (loadingStartAction) {
      yield put(loadingStartAction());
    }

    const { error, errorText, data, additionalErrors } = yield call(
      downloadFileRequest,
      requestParams,
    );

    if (error) {
      // serialize data to be catched to the "catch" block and to be parsed
      throw new Error(
        JSON.stringify({
          errorText,
          additionalErrors,
        }),
      );
    }

    const formattedData = responseDataFormatter
      ? responseDataFormatter(data)
      : data;

    yield downloadFile({
      fileType,
      file: formattedData.file,
      contentType: formattedData.contentType,
      name: formattedData.name,
    });

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

    // put usual function callback
    if (callBackOnSuccess) {
      yield callBackOnSuccess({ dispatch, responseData: formattedData });
    }

    // set success notification
    if (
      showNotificationSuccess &&
      notificationSuccessMessage &&
      setModalAction
    ) {
      yield put(
        setModalAction({
          status: 'success',
          title: notificationSuccessMessage,
        }),
      );
    }
  } catch (error: any) {
    console.error('downloadFilesManagerWorkerSaga gets an error', error);

    // parse error data
    const errorData = getParsedError({
      sagaName: 'downloadFilesManagerWorkerSaga',
      error,
    });

    // set error notification
    if (showNotificationError && setModalAction) {
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

    // dispatch fail actions
    if (setErrorAction) {
      yield put(setErrorAction(errorData.errorText));
    } else if (setErrorActionsArray && setErrorActionsArray.length) {
      yield all(
        setErrorActionsArray.map((errorAction) =>
          put(errorAction(errorData.errorText)),
        ),
      );
    }

    if (callBackOnError) {
      yield callBackOnError({ dispatch, errorData });
    }

    if (errorLogger || errorLoggerGlobal) {
      const logger = errorLogger || errorLoggerGlobal;

      logger({
        error,
        message: '[downloadFilesManagerWorkerSaga]: get an error',
      });
    }
  } finally {
    if (loadingStopAction) {
      yield put(loadingStopAction());
    }
  }
}
