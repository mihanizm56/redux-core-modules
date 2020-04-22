import { reducerUIName } from './constants';

export interface IUIState {
  pageIsLoadingState: boolean;
  isAppError: boolean;
}

export interface IUIStatePart {
  [reducerUIName]: IUIState;
}
