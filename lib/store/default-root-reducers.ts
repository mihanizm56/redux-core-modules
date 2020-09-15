import {
  notificationsState,
  NOTIFICATIONS_REDUCER_NAME,
} from '@wildberries/notifications';

import {
  CONFIRM_MODALS_REDUCER_NAME,
  confirmModalModuleReducer,
} from '@wildberries/confirm-modal-portal';
import {
  UI_MODULE_REDUCER_NAME,
  reducer as UIModuleReducer,
} from '@/root-modules/ui-module';

export const defaultRootReducers = {
  [NOTIFICATIONS_REDUCER_NAME]: notificationsState,
  [CONFIRM_MODALS_REDUCER_NAME]: confirmModalModuleReducer,
  [UI_MODULE_REDUCER_NAME]: UIModuleReducer,
};
