import { put, call, all } from 'redux-saga/effects';
import fileDownload from 'js-file-download';
import { setModalAction } from '@wildberries/notifications';
import { base64toBytes } from '@/utils/base-64-to-bytes';
import { DownloadFilesManagerType, FILE_TYPES } from '../types';

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

    // get file
    const blobFile =
      fileType === FILE_TYPES.base64
        ? base64toBytes(formattedData.file, formattedData.contentType)
        : formattedData.file;

    // download file
    yield fileDownload(blobFile, formattedData.name);

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
