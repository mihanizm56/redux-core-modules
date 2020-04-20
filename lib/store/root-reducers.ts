import { notificationsState } from '@wildberries/notifications';
import { translationStorage } from '@mihanizm56/i18n-react';
import UIStateStorage from '@/root-modules/ui-module';
import productsManagerStorage, {
  reducerProductsName,
} from '@/root-modules/products-manager-module';

export const rootReducers = {
  UIStateStorage,
  notificationsState,
  translationStorage,
  [reducerProductsName]: productsManagerStorage,
};
