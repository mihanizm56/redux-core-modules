import { ErrorsMap } from '@mihanizm56/fetch-api';

export interface IUIState {
  pageIsLoadingState: boolean;
  errorsMap: ErrorsMap;
  isAppError: boolean;
}

export interface IUIStatePart {
  UIStateStorage: IUIState;
}
