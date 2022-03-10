import { put } from 'redux-saga/effects';
import { RequestExtraDataHandlerActionSagaType } from '../types';

// TODO
// not work in SSR
export function* requestExtraDataHandlerWorkerSaga({
  data,
  options,
  sendErrorLogger,
}: RequestExtraDataHandlerActionSagaType) {
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

    if (sendErrorLogger) {
      sendErrorLogger({
        error,
        message: '[formManagerWorkerSaga]: get an error',
      });
    }
  }
}
