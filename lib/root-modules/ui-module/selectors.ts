import { createSelector } from 'reselect';
import { IUIState, IUIStatePart } from './types';

const UIStorageSelector = (store: IUIStatePart) => store.UIStateStorage;

export const getPageIsLoading = createSelector(
  [UIStorageSelector],
  (UIStorage: IUIState) => UIStorage.pageIsLoadingState,
);

export const getIsAppError = createSelector(
  [UIStorageSelector],
  (UIStorage: IUIState) => UIStorage.isAppError,
);
