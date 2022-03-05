import { put, call, all } from 'redux-saga/effects';
import { Dispatch } from 'redux';
import { requestExtraDataHandlerActionSaga } from '@/root-modules/request-extra-data-handler-module';
import {
  redirectManagerSagaAction,
  IRedirectManagerPayload,
} from '@/root-modules/redirect-manager-module';
import { BaseAction, IAdvancedStore } from '@/types';
import { requestErrorHandlerProcess } from '@/utils/request-error-handler-process';
import { filterBatchedResponseData } from '@/utils/filter-batch-response-data';
import { getIsClient } from '@/utils/get-is-client';
import { InitLoadManagerRequestOptionsType } from '../types';
import { checkIsInitialFetched } from './utils/check-is-initial-fetched';
import { getIsAbortRequestError } from './utils/get-is-abort-request-error';

type ParamsType = InitLoadManagerRequestOptionsType & {
  requestsSectionId: string;
  setAppErrorAction?: BaseAction;
  eventNameToCancelRequests?: string;
  eventToCatchEndedProcesses: string;
  isBatchRequest?: boolean;
  dependencies?: Record<string, any>;
  store: IAdvancedStore;
  dispatch: Dispatch;
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
  initialLoadingFinishAction,
  selectorsCheckInitialFetched,
  store,
  dependencies: { setModalAction } = {},
  callBackOnSuccess,
  callBackOnError,
  dispatch,
}: ParamsType) {
  let responseData;
  const isNode = !getIsClient();

  // not to refetch if data was fetched earlier
  if (selectorsCheckInitialFetched) {
    const isInitialFetched = checkIsInitialFetched({
      selectorsCheckInitialFetched,
      store,
    });

    if (isInitialFetched) {
      return;
    }
  }

  try {
    // reset actions
    if (resetAction) {
      yield put(resetAction());
    } else if (resetActionsArray) {
      yield all(resetActionsArray.map((action) => put(action())));
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
      // TODO FIX
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
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
        actionsArraySuccess.map((action) => put(action(filteredResponseData))),
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

    // put usual function callback
    if (callBackOnSuccess) {
      yield callBackOnSuccess({
        dispatch,
        responseData: filteredResponseData,
        store,
      });
    }

    // handle success redirect
    if (redirectRouteParamsSuccess) {
      const redirectData: IRedirectManagerPayload =
        formatDataToRedirectParamsSuccess
          ? formatDataToRedirectParamsSuccess({
              ...redirectRouteParamsSuccess,
              ...filteredResponseData,
            })
          : redirectRouteParamsSuccess;

      yield put(redirectManagerSagaAction(redirectData));
    }
  } catch (error: any) {
    const isAbortError = getIsAbortRequestError(error.message);

    // if the request was not aborted
    if (!isAbortError) {
      console.error('error in initLoadManagerWorkerSaga', error.message);

      // if data in request is critical and we dont get it -> set app global error
      if (isDataCritical) {
        if (setAppErrorAction) {
          console.error('get the critical fetch fail');

          if (eventNameToCancelRequests && !isNode) {
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
        yield all(
          errorActionsArray.map((action) => put(action(error.message))),
        );
      }

      if (callBackOnError) {
        yield callBackOnError({ dispatch, store });
      }

      // set error notification
      if (showErrorNotification && setModalAction) {
        if (getErrorModalActionTitle) {
          yield put(
            setModalAction({
              status: 'error',
              title: getErrorModalActionTitle(error.message),
              text: error.message,
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
        const redirectData: IRedirectManagerPayload =
          formatDataToRedirectParamsError
            ? formatDataToRedirectParamsError({
                ...redirectRouteParamsError,
                ...error.additionalErrors,
              })
            : redirectRouteParamsError;

        yield put(redirectManagerSagaAction(redirectData));
      }
    }
  } finally {
    if (!isNode) {
      document.dispatchEvent(
        new CustomEvent(eventToCatchEndedProcesses, {
          detail: { id: requestsSectionId },
        }),
      );
    }

    if (loadingStopAction) {
      yield put(loadingStopAction());
    }

    // toggle the initial fetching state for ssr - not to refetch data twice on first render
    if (initialLoadingFinishAction) {
      yield put(initialLoadingFinishAction());
    }
  }
}
