import { notificationsState } from '@wildberries/notifications';
import { translationStorage } from '@mihanizm56/i18n-react';
import UIStateStorage, { reducerUIName } from '@/root-modules/ui-module';
import productsManagerStorage, {
  reducerProductsName,
} from '@/root-modules/products-manager-module';
import suppliersManagerStorage, {
  reducerSuppliersName,
} from '@/root-modules/suppliers-manager-module';

export const rootReducers = {
  UIStateStorage,
  notificationsState,
  translationStorage,
  [reducerProductsName]: productsManagerStorage,
  [reducerSuppliersName]: suppliersManagerStorage,
  [reducerUIName]: UIStateStorage,
};
