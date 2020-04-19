export { createAppStore } from './store';

export { Action, BaseAction, IAdvancedStore } from './types';

export { injectAsyncReducer } from './utils/inject-reducers';
export { injectAsyncSaga } from './utils/inject-sagas';

export {
  fetchFormManagerSagaAction,
  FormManagerType,
  formManagerWatcherSaga,
} from './root-modules/form-manager-module';

export {
  fetchMenuAction,
  getMenuData,
  getMenuIsLoading,
} from './root-modules/products-manager-module';

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
} from './root-modules/redirect-manager-module';

export {
  InitRequestHandlerActionType,
  requestExtraDataHandlerWatcherSaga,
} from './root-modules/request-extra-data-handler-module';

export { getPageIsLoading, getIsAppError } from './root-modules/ui-module';
export { default as uiModuleReducer } from './root-modules/ui-module';

export { getTranslationsDictionary } from '@mihanizm56/i18n-react';

export { getTranslationsLocale } from '@mihanizm56/i18n-react';
