import { put, call, all } from 'redux-saga/effects';
import { requestExtraDataHandlerActionSaga } from '@/root-modules/request-extra-data-handler-module';
import {
  redirectManagerSagaAction,
  IRedirectManagerPayload,
} from '@/root-modules/redirect-manager-module';
import { BaseAction } from '@/types';
import { requestErrorHandlerProcess } from '@/utils/request-error-handler-process';
import { filterBatchedResponseData } from '@/utils/filter-batch-response-data';
import { InitLoadManagerRequestOptionsType } from '../types';
import {
  ABORTED_ERROR_TEXT_CHROME,
  ABORTED_ERROR_TEXT_MOZILLA,
  ABORTED_ERROR_TEXT_SAFARI,
} from '../constants';

type ParamsType = InitLoadManagerRequestOptionsType & {
  requestsSectionId: string;
  setAppErrorAction?: BaseAction;
  eventNameToCancelRequests?: string;
  eventToCatchEndedProcesses: string;
  isBatchRequest?: boolean;
  dependencies?: Record<string, any>;
};

export function* spawnedFetchProcessSaga({
  resetAction,
  resetActionsArray,
  request,
  requestOptions,
  requestDataFormatter,
  responseDataFormatter,
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
  requestsSectionId,
  eventNameToCancelRequests,
  eventToCatchEndedProcesses,
  requestErrorHandlerProcessParams,
  isBatchRequest,
  getErrorModalActionTitle,
  dependencies: { setModalAction } = {},
}: ParamsType) {
  let responseData;

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

    // format data before to send to the request
    const formattedRequestParams = requestDataFormatter
      ? requestDataFormatter(requestOptions)
      : requestOptions;

    if (requestErrorHandlerProcessParams) {
      responseData = yield* requestErrorHandlerProcess({
        ...requestErrorHandlerProcessParams,
        request: () =>
          request({
            ...formattedRequestParams,
            isErrorTextStraightToOutput: withoutFormattingError,
          }),
      });
    } else {
      // make the request with language dictionary (optionally with params)
      responseData = yield call(request, {
        ...formattedRequestParams,
        isErrorTextStraightToOutput: withoutFormattingError,
      });
    }

    // if an error in request
    if (responseData.error) {
      // eslint-disable-next-line
      throw { 
        message: responseData.errorText,
        additionalErrors: responseData.additionalErrors,
      };
    }

    // format response data
    const formattedResponseData = responseDataFormatter
      ? responseDataFormatter(responseData.data)
      : responseData.data;

    // filter response data to prepare json-rpc batch response
    const filteredResponseData = isBatchRequest
      ? filterBatchedResponseData(responseData)
      : formattedResponseData;

    // success actions
    if (actionSuccess && filteredResponseData) {
      yield put(actionSuccess(filteredResponseData));
    } else if (actionsArraySuccess) {
      yield all(
        actionsArraySuccess.map(action => put(action(filteredResponseData))),
      );
    }

    // custom data redux actions in one middleware
    if (requestExtraDataHandlerOptions) {
      yield put(
        requestExtraDataHandlerActionSaga({
          data: filteredResponseData,
          options: requestExtraDataHandlerOptions,
        }),
      );
    }

    // set success notification
    if (showSuccessNotification && textMessageSuccess && setModalAction) {
      yield put(
        setModalAction({
          status: 'success',
          title: textMessageSuccess,
        }),
      );
    }

    // handle success redirect
    if (redirectRouteParamsSuccess) {
      const redirectData: IRedirectManagerPayload = formatDataToRedirectParamsSuccess
        ? formatDataToRedirectParamsSuccess({
            ...redirectRouteParamsSuccess,
            ...filteredResponseData,
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
              detail: { id: requestsSectionId },
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
      if (showErrorNotification && setModalAction) {
        if (getErrorModalActionTitle) {
          yield put(
            setModalAction({
              status: 'error',
              title: getErrorModalActionTitle(error.message),
            }),
          );
        } else {
          yield put(
            setModalAction({
              status: 'error',
              title: error.message,
            }),
          );
        }
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
        detail: { id: requestsSectionId },
      }),
    );

    if (loadingStopAction) {
      yield put(loadingStopAction());
    }
  }
}
