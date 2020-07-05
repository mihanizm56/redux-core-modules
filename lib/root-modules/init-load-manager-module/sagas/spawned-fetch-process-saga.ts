import { put, call, all } from 'redux-saga/effects';
import { setModalAction } from '@wildberries/notifications';
import { requestExtraDataHandlerActionSaga } from '@/root-modules/request-extra-data-handler-module';
import {
  redirectManagerSagaAction,
  IRedirectManagerPayload,
} from '@/root-modules/redirect-manager-module';
import { BaseAction } from '@/types';
import { InitLoadManagerRequestOptionsType } from '../types';
import {
  ABORTED_ERROR_TEXT_CHROME,
  ABORTED_ERROR_TEXT_MOZILLA,
  ABORTED_ERROR_TEXT_SAFARI,
} from '../constants';

type ParamsType = InitLoadManagerRequestOptionsType & {
  abortRequestsSectionId: string;
  setAppErrorAction?: BaseAction;
  eventNameToCancelRequests?: string;
  eventToCatchEndedProcesses: string;
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
  abortRequestsSectionId,
  eventNameToCancelRequests,
  eventToCatchEndedProcesses,
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
    const isAbortError =
      error.message === ABORTED_ERROR_TEXT_CHROME ||
      error.message === ABORTED_ERROR_TEXT_MOZILLA ||
      error.message === ABORTED_ERROR_TEXT_SAFARI;

    // if the request was not aborted
    if (!isAbortError) {
      console.error('error in initLoadManagerWorkerSaga', error.message);

      // if data in request is critical and we dont get it -> set app global error
      if (isDataCritical) {
        if (setAppErrorAction) {
          console.error('get the critical fetch fail');

          if (eventNameToCancelRequests) {
            // throw the event to cancel requests
            const event = new CustomEvent(eventNameToCancelRequests, {
              detail: { abortRequestId: abortRequestsSectionId },
            });

            document.dispatchEvent(event);
          }

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
    }
  } finally {
    document.dispatchEvent(
      new CustomEvent(eventToCatchEndedProcesses, {
        detail: { id: abortRequestsSectionId },
      }),
    );

    if (loadingStopAction) {
      yield put(loadingStopAction());
    }
  }
}
