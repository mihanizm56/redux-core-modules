import { put, call, all } from 'redux-saga/effects';
import { setModalAction } from '@wildberries/notifications';
import { downloadFile } from '@/utils';
import { DownloadFilesManagerType } from '../types';

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
}: DownloadFilesManagerType) {
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
        formSuccessActionsArray.map(successAction =>
          put(successAction(formattedData)),
        ),
      );
    }

    // set success notification
    if (showNotificationSuccess && notificationSuccessMessage) {
      yield put(
        setModalAction({
          status: 'success',
          title: error.message,
        }),
      );
    }
  } catch (error) {
    console.error('downloadFilesManagerWorkerSaga gets an error', error);

    // set error notification
    if (showNotificationError) {
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
        setErrorActionsArray.map(errorAction =>
          put(errorAction(error.message)),
        ),
      );
    }
  } finally {
    if (loadingStopAction) {
      yield put(loadingStopAction());
    }
  }
}
