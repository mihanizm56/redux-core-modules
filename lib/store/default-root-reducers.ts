import {
  notificationsState,
  NOTIFICATIONS_REDUCER_NAME,
} from '@wildberries/notifications';

export const defaultRootReducers = {
  [NOTIFICATIONS_REDUCER_NAME]: notificationsState,
};
