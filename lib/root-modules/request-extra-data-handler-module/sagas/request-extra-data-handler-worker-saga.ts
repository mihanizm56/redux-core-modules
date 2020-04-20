import { put } from 'redux-saga/effects';
import { InitRequestHandlerActionType } from '../types';

type ParamsType = {
  data: any; // 'cause we can have various types of data
  options: InitRequestHandlerActionType;
};

export function* requestExtraDataHandlerWorkerSaga({
  data,
  options,
}: ParamsType) {
  try {
    const optionsLength = options.length;

    let optionsItem = 0;

    while (optionsItem < optionsLength) {
      const { fieldName, action } = options[optionsItem];
      const optionDataValue = data[fieldName];

      yield put(action(optionDataValue));

      optionsItem += 1;
    }
  } catch (error) {
    console.error(
      'requestExtraDataHandlerWorkerSaga catch error',
      error.message,
    );
  }
}
