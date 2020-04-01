export type NotificationType = {
  status: 'success' | 'error';
  text: string;
  id: string;
  externalActionType?: string;
  additionalPayload?: any;
  additionalActionType?: string;
};

export interface INotificationsStorage {
  modals: Array<NotificationType>;
}

export interface INotificationsStoragePart {
  notificationsState: INotificationsStorage;
}
