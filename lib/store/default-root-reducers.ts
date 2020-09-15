import {
  notificationsState,
  NOTIFICATIONS_REDUCER_NAME,
} from '@wildberries/notifications';

import {
  CONFIRM_MODALS_REDUCER_NAME,
  confirmModalModuleReducer,
} from '@wildberries/confirm-modal-portal';

export const defaultRootReducers = {
  [NOTIFICATIONS_REDUCER_NAME]: notificationsState,
  [CONFIRM_MODALS_REDUCER_NAME]: confirmModalModuleReducer,
};
