import { notificationsState } from '@wildberries/notifications';
import { translationStorage } from '@mihanizm56/i18n-react';
import UIStateStorage, { reducerUIName } from '@/root-modules/ui-module';

export const rootReducers = {
  UIStateStorage,
  notificationsState,
  translationStorage,
  [reducerUIName]: UIStateStorage,
};
