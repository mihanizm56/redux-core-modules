import { put, call, all } from 'redux-saga/effects';
import { Dispatch } from 'redux';
import { downloadFile } from '@/utils';
import { DownloadFilesManagerType } from '../types';

type ParamsType = DownloadFilesManagerType & {
  dispatch: Dispatch;
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
  dependencies: { setModalAction, sendErrorLogger } = {},
  callBackOnSuccess,
  callBackOnError,
  dispatch,
  disableErrorLogger,
}: ParamsType) {
  try {
    if (loadingStartAction) {
      yield put(loadingStartAction());
    }

    const { error, errorText, data } = yield call(
      downloadFileRequest,
      requestParams,
    );

    if (error) {
      throw new Error(errorText);
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
      yield callBackOnSuccess({ dispatch });
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

    // set error notification
    if (showNotificationError && setModalAction) {
      yield put(
        setModalAction({
          status: 'error',
          title: error.message,
        }),
      );
    }

    // dispatch fail actions
    if (setErrorAction) {
      yield put(setErrorAction(error.message));
    } else if (setErrorActionsArray && setErrorActionsArray.length) {
      yield all(
        setErrorActionsArray.map((errorAction) =>
          put(errorAction(error.message)),
        ),
      );
    }

    if (callBackOnError) {
      yield callBackOnError({ dispatch });
    }

    if (sendErrorLogger && !disableErrorLogger) {
      sendErrorLogger({
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
