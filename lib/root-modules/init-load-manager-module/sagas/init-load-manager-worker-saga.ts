import { put, call, all, select } from 'redux-saga/effects';
import { getFormattedResponseErrorText } from '@mihanizm56/fetch-api';
import {
  setModalAction,
  DEFAULT_SUCCESS_NOTIFICATION_MESSAGE,
} from '@wildberries/notifications';
import { setAppErrorAction, UIStorageSelector } from '@/root-modules/ui-module';
import { requestExtraDataHandlerActionSaga } from '@/root-modules/request-extra-data-handler-module';
import { InitLoadManagerActionPayloadType } from '../types';

export function* initLoadManagerWorkerSaga({
  payload: {
    requestConfigList,
    options: { fullActionLoadingStop, fullActionLoadingStart } = {},
  },
}: {
  payload: InitLoadManagerActionPayloadType;
}) {
  const { errorsMap } = yield select(UIStorageSelector);

  let counterRequests = 0;

  if (fullActionLoadingStart) {
    yield put(fullActionLoadingStart());
  }

  while (counterRequests < requestConfigList.length) {
    const {
      resetAction,
      resetActionsArray,
      request,
      requestDataFormatter,
      actionSuccess,
      actionsArraySuccess,
      requestExtraDataHandlerOptions,
      showSuccessNotification,
      isDataCritical,
      errorAction,
      errorActionsArray,
      showErrorNotification,
      loadingStopAction,
      loadingStartAction,
      withoutFormattingError,
      requestOptions,
    } = requestConfigList[counterRequests];

    try {
      // reset actions
      if (resetAction) {
        yield put(resetAction());
      } else if (resetActionsArray) {
        yield all(resetActionsArray.map(action => put(action())));
      }

      if (loadingStartAction) {
        yield put(loadingStartAction());
      }

      // make the request (optionally with params)
      const { error, errorText, data } = Boolean(requestOptions)
        ? yield call(request, requestOptions)
        : yield call(request);

      // if an error in request
      if (error) {
        throw new Error(errorText);
      }

      // format data
      const formattedData = requestDataFormatter
        ? requestDataFormatter(data)
        : data;

      // success actions
      if (actionSuccess && formattedData) {
        yield put(actionSuccess(formattedData));
      } else if (actionsArraySuccess) {
        yield all(
          actionsArraySuccess.map(action => put(action(formattedData))),
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

      // set success notification
      if (showSuccessNotification) {
        yield put(
          setModalAction({
            status: 'error',
            text: DEFAULT_SUCCESS_NOTIFICATION_MESSAGE,
          }),
        );
      }
    } catch (error) {
      // get formatted error message
      const formattedErrorText = !withoutFormattingError
        ? getFormattedResponseErrorText({
            errorTextKey: error.message,
            errorsMap,
          })
        : error.message;
      console.error(
        'error',
        'error in initLoadManagerWorkerSaga',
        error.message,
      );

      // if data in request is critical and we dont get it -> set app global error
      if (isDataCritical) {
        console.error('error', 'get is critical fetch fail');

        yield put(setAppErrorAction());
        break;
      }

      // set error actions
      if (errorAction) {
        yield put(errorAction(formattedErrorText));
      } else if (errorActionsArray) {
        yield all(
          errorActionsArray.map(action => put(action(formattedErrorText))),
        );
      }

      // set error notification
      if (showErrorNotification) {
        yield put(
          setModalAction({
            status: 'error',
            text: formattedErrorText,
          }),
        );
      }
    } finally {
      if (loadingStopAction) {
        yield put(loadingStopAction());
      }
    }

    // go to next request
    counterRequests += 1;
  }

  if (fullActionLoadingStop) {
    yield put(fullActionLoadingStop());
  }
}
