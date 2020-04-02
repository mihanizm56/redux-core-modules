# @mihanizm56/redux-core-modules

## Sollution for redux-store and root modules implementation

### Benefits:

- Gives an opportunity to initialize the redux store with root modules 'in a one string'
- Includes the main redux-saga managers
- Exports all root reducers and watcher-sagas to be implemeted into your own store
- Exports all necessary typings and default action types (Action and BaseAction)
- Has batching mode in the store initialization (redux-batched-actions library)
- Provides redirect-manager-module based on the Router5 to be able to navigate in your worker sagas
- Gives injecting reducers and sagas mechanizm

## Examples of usage

#### installation

```javascript
npm install @mihanizm56/redux-core-modules
```

#### implementing store in regular App

```javascript
import { createAppStore } from '@mihanizm56/redux-core-modules';

const ROOT_ELEMENT = document.getElementById('root');

const router: any = configureRouter();

const store = createAppStore({ router });

router.setDependencies({
  store,
});

router.start(() => {
  ReactDOM.render(
    <Provider store={store}>
      <App router={router} />
    </Provider>,
    ROOT_ELEMENT,
  );
});
```

#### Example usage of form-manager-module

```javascript
import { fetchFormManagerSagaAction } from '@mihanizm56/redux-core-modules';

submitForm = (formValues: SignatureRenewalFormDataType) => {
    const {
        formLoadingStart,
        formLoadingStop,
        submitForm,
        formSaveAction,
    } = this.props;

    const formManagerSubmitOptions = {
        resetInitialDataAction: formSaveAction,
        formValues,
        loadingStartAction: formLoadingStart,
        loadingStopAction: formLoadingStop,
        formRequest: signatureRenewalFormSubmitRequest,
        showNotification: true,
        withoutFormattingError: true,
        redirectSuccessActionParams: {
            pathName: 'home.supplier-card',
        },
    };

    this.props.dispatch(fetchFormManagerSagaAction(formManagerSubmitOptions));
  };
```

#### Example usage of init-loader-manager

```javascript
import { initLoadManagerActionSaga } from '@mihanizm56/redux-core-modules';

const loadDataConfig = {
  requestConfigList: [
    {
      request: initSupplierInfoRequest,
      isDataCritical: false,
      showErrorNotification: true,
      showSuccessNotification: false,
      requestExtraDataHandlerOptions: [
        {
          fieldName: 'supplierName',
          action: setSupplierNameAction,
        },
        {
          fieldName: 'contactInfo',
          action: setContactInfoAction,
        },
        {
          fieldName: 'warehouses',
          action: setWarehousesAction,
        },
      ],
    },
  ],
};

this.props.dispatch(initLoadManagerActionSaga(loadDataConfig));
```

#### Example usage of notifications-module (notifications-components module must be implemented!)

```javascript
import { setModalAction } from '@mihanizm56/redux-core-modules';
import { uniqueId } from 'lodash-es';

this.props.dispatch(setModalAction({
    status: 'success',
    text: 'some message',
    id: uniqueId('notification_'),
}));
```

#### Example usage redirect-manager-module

```javascript
import { redirectManagerWorkerSaga } from '@mihanizm56/redux-core-modules';

this.props.dispatch(redirectManagerSagaAction({
  pathName: 'pathName',
  params: {
    foo:'bar'
  },
  actionAfterRedirect: setModalAction,
  actionAfterRedirectParams: {
    status: 'success',
    text: 'some message',
    id: uniqueId('notification_'),
  },
  reload: true;
}));
```

#### Example usage ui-module

```javascript
import { 
    startPageLoadingAction,
    stopPageLoadingAction,
    setErrorsMapAction,
    setAppErrorAction,
    removeAppErrorAction
} from '@mihanizm56/redux-core-modules';

this.props.dispatch(startPageLoadingAction);

this.props.dispatch(stopPageLoadingAction);

this.props.dispatch(setAppErrorAction);

this.props.dispatch(removeAppErrorAction);

this.props.dispatch(setErrorsMapAction({
    TIMEOUT_ERROR: 'timeout error';
    REQUEST_DEFAULT_ERROR: 'sorry the request in invalid';
    FORBIDDEN: 'sorry the response is forbidden'
}));
```

#### Example of import modules into your own root reducer

```javascript
// root-reducers.ts
import {
    notificationsModuleReducer,
    uiModuleReducer
} from '@mihanizm56/redux-core-modules';

const rootReducers = {
  notificationsModuleReducer,
  uiModuleReducer,
};
```

#### Example of import modules into your own root-saga

```javascript
// root-saga.ts
import { all, fork } from 'redux-saga/effects';
import { Router } from 'router5';
import { Dispatch } from 'redux';
import { 
    formManagerWatcherSaga,
    initLoadManagerWatcherSaga,
    requestExtraDataHandlerWatcherSaga,
    redirectManagerWatcherSaga 
} from '@mihanizm56/redux-core-modules';

type RootSagaParams = {
  router: Router;
  dispatch: Dispatch;
};

function* rootSaga({ router, dispatch }: RootSagaParams) {
  yield all([
    fork(formManagerWatcherSaga),
    fork(initLoadManagerWatcherSaga),
    fork(requestExtraDataHandlerWatcherSaga),
    fork(redirectManagerWatcherSaga, { router, dispatch }),
  ]);
}
```