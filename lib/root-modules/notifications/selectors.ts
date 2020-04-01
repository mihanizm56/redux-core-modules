import { createSelector } from 'reselect';
import { INotificationsStoragePart } from './types';

const modalStorageSelector = (store: INotificationsStoragePart) =>
  store.notificationsState;

export const getModalStack = createSelector(
  [modalStorageSelector],
  modalStorage => modalStorage.modals,
);
