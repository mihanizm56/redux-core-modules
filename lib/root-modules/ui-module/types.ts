import { UI_MODULE_REDUCER_NAME } from './constants';

export interface IUIState {
  pageIsLoadingState: boolean;
  i18nextIsLoadingState: boolean;
  isAppError: boolean;
}

export interface IUIStatePart {
  [UI_MODULE_REDUCER_NAME]: IUIState;
}
