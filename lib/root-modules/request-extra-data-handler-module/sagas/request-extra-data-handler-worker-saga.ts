import { put } from 'redux-saga/effects';
import { IAdvancedStore } from '@/types';
import { RequestExtraDataHandlerActionSagaType } from '../types';

type ParamsType = RequestExtraDataHandlerActionSagaType & {
  store: IAdvancedStore;
};

// TODO
// not work in SSR
export function* requestExtraDataHandlerWorkerSaga({
  data,
  options,
  errorLogger,
  store,
}: ParamsType) {
  const { errorLoggerGlobal } = store?.dependencies ?? {};

  try {
    const optionsLength = options.length;

    let optionsItem = 0;

    while (optionsItem < optionsLength) {
      const { fieldName, action } = options[optionsItem];
      const optionDataValue = data[fieldName];

      yield put(action(optionDataValue));

      optionsItem += 1;
    }
  } catch (error: any) {
    console.error(
      'requestExtraDataHandlerWorkerSaga catch error',
      error.message,
    );

    if (errorLogger || errorLoggerGlobal) {
      const logger = errorLogger || errorLoggerGlobal;

      logger({
        error,
        message: '[requestExtraDataHandlerWorkerSaga]: get an error',
      });
    }
  }
}
