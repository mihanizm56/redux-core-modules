import { createSelector } from 'reselect';
import { IUIState, IUIStatePart } from './types';

export const UIStorageSelector = (store: IUIStatePart) => store.UIStateStorage;

export const getPageIsLoading = createSelector(
  [UIStorageSelector],
  (storage: IUIState) => storage.pageIsLoadingState,
);

export const getIsAppError = createSelector(
  [UIStorageSelector],
  (storage: IUIState) => storage.isAppError,
);
