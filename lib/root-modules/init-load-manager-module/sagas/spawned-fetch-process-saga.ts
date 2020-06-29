import { put, call, all } from 'redux-saga/effects';
import { setModalAction } from '@wildberries/notifications';
import { requestExtraDataHandlerActionSaga } from '@/root-modules/request-extra-data-handler-module';
import {
  redirectManagerSagaAction,
  IRedirectManagerPayload,
} from '@/root-modules/redirect-manager-module';
import { BaseAction } from '@/types';
import { EVENT_MESSAGE_TO_THROW_TO_CANCEL_THE_REQUEST_GROUP } from '@/constants';
import { InitLoadManagerRequestOptionsType } from '../types';

type ParamsType = InitLoadManagerRequestOptionsType & {
  abortSectionId: string;
  setAppErrorAction?: BaseAction;
};

export function* spawnedFetchProcessSaga({
  resetAction,
  resetActionsArray,
  request,
  requestOptions,
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
  formatDataToRedirectParamsSuccess,
  redirectRouteParamsSuccess,
  formatDataToRedirectParamsError,
  redirectRouteParamsError,
  textMessageSuccess,
  setAppErrorAction,
  abortSectionId,
}: ParamsType) {
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

    // make the request with language dictionary (optionally with params)
    const { error, errorText, data, additionalErrors } = yield call(request, {
      ...requestOptions,
      isErrorTextStraightToOutput: withoutFormattingError,
    });

    // if an error in request
    if (error) {
      // eslint-disable-next-line
      throw { message: errorText, additionalErrors };
    }

    // format data
    const formattedData = requestDataFormatter
      ? requestDataFormatter(data)
      : data;

    // success actions
    if (actionSuccess && formattedData) {
      yield put(actionSuccess(formattedData));
    } else if (actionsArraySuccess) {
      yield all(actionsArraySuccess.map(action => put(action(formattedData))));
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
    if (showSuccessNotification && textMessageSuccess) {
      yield put(
        setModalAction({
          status: 'error',
          text: textMessageSuccess,
        }),
      );
    }

    // handle success redirect
    if (redirectRouteParamsSuccess) {
      const redirectData: IRedirectManagerPayload = formatDataToRedirectParamsSuccess
        ? formatDataToRedirectParamsSuccess({
            ...redirectRouteParamsSuccess,
            ...formattedData,
          })
        : redirectRouteParamsSuccess;

      yield put(redirectManagerSagaAction(redirectData));
    }
  } catch (error) {
    console.error('error in initLoadManagerWorkerSaga', error.message);

    // if data in request is critical and we dont get it -> set app global error
    if (isDataCritical) {
      if (setAppErrorAction) {
        console.error('get the critical fetch fail');

        // throw the event to cancel rest requests
        const event = new CustomEvent(
          EVENT_MESSAGE_TO_THROW_TO_CANCEL_THE_REQUEST_GROUP,
          {
            detail: { abortSectionId },
          },
        );

        document.dispatchEvent(event);

        yield put(setAppErrorAction());
      } else {
        // eslint-disable-next-line
        console.warn(
          'isDataCritical flag was provided and activated but there is no setAppErrorAction to throw',
        );
      }
    }

    // set error actions
    if (errorAction) {
      yield put(errorAction(error.message));
    } else if (errorActionsArray) {
      yield all(errorActionsArray.map(action => put(action(error.message))));
    }

    // set error notification
    if (showErrorNotification) {
      yield put(
        setModalAction({
          status: 'error',
          text: error.message,
        }),
      );
    }

    // handle error redirect
    if (redirectRouteParamsError) {
      const redirectData: IRedirectManagerPayload = formatDataToRedirectParamsError
        ? formatDataToRedirectParamsError({
            ...redirectRouteParamsError,
            ...error.additionalErrors,
          })
        : redirectRouteParamsError;

      yield put(redirectManagerSagaAction(redirectData));
    }
  } finally {
    if (loadingStopAction) {
      yield put(loadingStopAction());
    }
  }
}
