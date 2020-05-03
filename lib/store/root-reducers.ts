import { notificationsState } from '@wildberries/notifications';
import UIStateStorage, { reducerUIName } from '@/root-modules/ui-module';

export const rootReducers = {
  notificationsState,
  [reducerUIName]: UIStateStorage,
};
