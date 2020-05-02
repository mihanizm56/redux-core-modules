export { createAppStore } from './store';

export { Action, BaseAction, IAdvancedStore } from './types';

export { removeAsyncSaga } from './utils/remove-sagas';
export { removeAsyncReducer } from './utils/remove-reducer';
export { injectAsyncReducer } from './utils/inject-reducers';
export { injectAsyncSaga } from './utils/inject-sagas';

export {
  fetchFormManagerSagaAction,
  FormManagerType,
  formManagerWatcherSaga,
} from './root-modules/form-manager-module';

export {
  FETCH_MENU_ACTION_SAGA,
  fetchMenuAction,
  setMenuAction,
  setLoadingStartAction,
  setLoadingStopAction,
  getProductsMenuData,
  getProductsMenuIsLoading,
  fetchMenuCallbackType,
  MenuType,
  MenuListType,
  ProductsState,
  ProductsStatePart,
} from './root-modules/products-manager-module';

export {
  FETCH_SUPPLIERS_ACTION_SAGA,
  SET_SELECTED_SUPPLIER_ACTION_SAGA,
  fetchSuppliersAction,
  setSuppliersLoadingStopAction,
  setSuppliersAction,
  setSuppliersLoadingStartAction,
  setSelectedSupplierActionSaga,
  setSelectedSupplierAction,
  getSuppliersData,
  getSuppliersIsLoading,
  getSelectedSupplier,
  SuppliersType,
  SuppliersStatePart,
  SuppliersState,
} from './root-modules/suppliers-manager-module';

export {
  initLoadManagerActionSaga,
  InitLoadManagerSourceType,
  InitLoadManagerActionPayloadType,
  initLoadManagerWatcherSaga,
} from './root-modules/init-load-manager-module';

export {
  requestExtraDataHandlerActionSaga,
} from './root-modules/request-extra-data-handler-module';

export {
  IRedirectManagerPayload,
  redirectManagerWatcherSaga,
  redirectManagerSagaAction,
  redirectToPlatformRouteManagerSagaAction,
} from './root-modules/redirect-manager-module';

export {
  InitRequestHandlerActionType,
  requestExtraDataHandlerWatcherSaga,
} from './root-modules/request-extra-data-handler-module';

export { getPageIsLoading, getIsAppError } from './root-modules/ui-module';
export { default as uiModuleReducer } from './root-modules/ui-module';

export { ReduxStoreLoader } from './containers/redux-store-loader';
export { StoreInjectConfig } from './containers/redux-store-loader/types';
