import { createSelector } from 'reselect';
import { IUIState, IUIStatePart } from './types';
import { UI_MODULE_REDUCER_NAME } from './constants';
import { initialState } from './reducer';

export const UIStorageSelector = (store: IUIStatePart) =>
  store[UI_MODULE_REDUCER_NAME] || initialState;

export const getAppIsLoadingSelector = createSelector(
  [UIStorageSelector],
  ({ pageIsLoadingState }: IUIState) => pageIsLoadingState,
);

export const getIsAppErrorSelector = createSelector(
  [UIStorageSelector],
  ({ isAppError }: IUIState) => isAppError,
);

export const geti18nextIsLoadingSelector = createSelector(
  [UIStorageSelector],
  ({ i18nextIsLoadingState }: IUIState) => i18nextIsLoadingState,
);
