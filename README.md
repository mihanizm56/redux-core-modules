# @wildberries/redux-core-modules

## Sollution for redux and redux-saga common cases

### What does it provide:

- Store initialization
- Core redux-modules for common usage 
- Utils for redux code-splitting

#### installation

```javascript
npm install @wildberries/redux-core-modules
```

## Features:

### Store initialization:

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { configureRouter } from '@wildberries/service-router';
import { createAppStore } from '@wildberries/redux-core-modules';

const ROOT_ELEMENT = document.getElementById('root');

const router = configureRouter({ defaultRoute: 'wb-eu-registration' });

const store = createAppStore({
  router,
});

router.start(() => {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    ROOT_ELEMENT,
  );
});
```

### Core redux-modules for common usage:

 - Form-manager-module - helps to work with the form submission
 - Init-load-manager-module - helps to get data when page is rendering
 - Redirect-manager-module - helps to navigate in redux-saga worker saga
 - Request-extra-data-handler-module - helps to make different actions from response data
 - UI-module - helps with working in the whole app ui-data

### Form-manager-module - gets options and make request and handle different operations:

 - re-save form data (necessary for react-final-form) before call the request and set new data
 - format form data before to insert to the request
 - start and stops form loading state
 - call error action (of array of actions)
 - call success action (of array of actions)
 - trigger notifications actions on success and error
 - send data (formatted of not) to the Request-extra-data-handler-module to make some operations with splitted data from response
 - trigger success or error router redirections

#### Example:

```javascript
import { fetchFormManagerSagaAction } from '@wildberries/redux-core-modules';

const formManagerSubmitOptions: FormManagerType = {
    formValues: { foo:'bar' },
    loadingStartAction: ()=>({ type:'loading start' }),
    loadingStopAction: ()=>({ type:'loading stop' }),
    formValuesFormatter: (data) => ({ 'baz':data.foo }),
    formRequest: fetch('http://example.com'),
    formSuccessAction: (payload)=>({ type:'some example success action', payload }),
    setErrorAction: (payload)=>({ type:'some example error action', payload }),
    resetInitialDataAction: (payload)=>({ type:'action to re-save form data', payload }),
    showNotification: true,
    redirectSuccessActionParams: {
        pathName: 'some.path',
    },
};

store.dispatch(formManagerSubmitOptions);
```

### Init-load-manager-module - has the separate config for each request and makes operations:

 - start and stop form loading state (not in each request but in the whole action)
 - format request data before and after the request
 - get the options (or not) and calls the request
 - trigger notifications actions on success and error
 - call error action (of array of actions)
 - call success action (of array of actions)
 - send data (formatted of not) to the Request-extra-data-handler-module to make some operations with splitted data from response
 - trigger success or error router redirections
 - ability to use batching (in JSON-RPC protocol)
 - cancelling the request if not responded

#### Example:

```javascript
import { initLoadManagerActionSaga, InitLoadManagerActionPayloadType } from '@wildberries/redux-core-modules';
import { getWarehousesListRequest } from '@/services/api/requests/get-warehouses-list';
import { getCountriesListRequest } from '@/services/api/requests/get-countries-list';
import { setRegionsAction } from '../_redux/regions-module';
import { setWarehousesAction } from '../_redux/warehouses-module';
import { warehousesListFormatter } from '../_utils/warehouses-list-formatter';

const loadDataConfig: InitLoadManagerActionPayloadType = {
  requestConfigList: [
    {
      request: getWarehousesListRequest,
      requestOptions: { foo:'bar' },
      isDataCritical: true,
      showErrorNotification: true,
      showSuccessNotification: false,
      requestDataFormatter: warehousesListFormatter,
      actionSuccess: setWarehousesAction,
      isBatchRequest: true
    },
    {
      request: getCountriesListRequest,
      isDataCritical: true,
      showErrorNotification: true,
      showSuccessNotification: false,
      requestExtraDataHandlerOptions: [
        {
          fieldName: 'countries',
          action: setRegionsAction,
        },
      ],
    },
  ],
};

store.dispatch(initLoadManagerActionSaga(loadDataConfig));
```

### Download-files-manager-module - manager to download base64 and blob type files:

 - start and stop form loading state
 - format request data before to get file to be downloaded
 - get the options (or not) and calls the request
 - trigger notifications actions on success and error
 - call error action (of array of actions)
 - call success action (of array of actions)

#### Example:

```javascript
import { downloadFilesManagerSagaAction, DownloadFilesManagerType } from '@wildberries/redux-core-modules';
import { someDownloadRequest } from '@/services/api/requests/some-request';
import { getCountriesListRequest } from '@/services/api/requests/get-countries-list';
import { setRegionsAction } from '../_redux/regions-module';
import { setWarehousesAction } from '../_redux/warehouses-module';

const config: DownloadFilesManagerType = {
  downloadFileRequest: someDownloadRequest,
  requestParams: {foo: 'bar'};
  loadingStartAction: () => ({ type:"LOADING_START" });
  loadingStopAction: () => ({ type:"LOADING_STOP" });
  formSuccessAction: () => ({ type:"SOME_SUCCESS_ACTION" });
  formSuccessActionsArray: [
    () => ({ type:"SOME_SUCCESS_ACTION_1" }),
    () => ({ type:"SOME_SUCCESS_ACTION_2" })
  ]
  setErrorAction: () => ({ type:"SOME_ERROR_ACTION" });
  setErrorActionsArray: [
    () => ({ type:"SOME_ERROR_ACTION_1" }),
    () => ({ type:"SOME_ERROR_ACTION_2" })
  ]
  showNotificationError: true;
  showNotificationSuccess: true;
  notificationSuccessMessage: 'some success notification message';
  fileType: 'base64';
};

store.dispatch(downloadFilesManagerSagaAction(config));
```

### Redirect-manager-module - simple options-provider to the router.navigate method from router5:
 - redirects to internal routes
 - redirects to external routes (for example if you are using microservice architecture and you stream-app doesn't know about external routes)

#### provides actions:
```javascript
import { redirectManagerSagaAction, redirectToPlatformRouteManagerSagaAction } from '@wildberries/redux-core-modules';

store.dispatch(redirectManagerSagaAction({
  pathName: 'route.path.name';
  params: { foo:'bar' };
  actionAfterRedirect: (payload) => ({ type:'action that will be called after redirect', payload })
  actionAfterRedirectParams: { id: 'test_id' };
}));

'there is no differences between action signatures - they are actually go to the one watcher-saga'
'but to show exactly where do you want to redirect - we provide this method'

store.dispatch(redirectToPlatformRouteManagerSagaAction({
  pathName: 'route.path.name';
  params: { foo:'bar' };
  actionAfterRedirect: (payload) => ({ type:'action that will be called after redirect', payload })
  actionAfterRedirectParams: { id: 'test_id' };
}));
```

### Request-extra-data-handler-module:
 - gets the data and array of options to process this data with redux-actions

#### provides actions:
```javascript
import { requestExtraDataHandlerActionSaga, RequestExtraDataHandlerActionSagaType } from '@wildberries/redux-core-modules';

store.dispatch(requestExtraDataHandlerActionSaga({
  data: {
      field1: {
          foo: 'bar'
      },
      field2: {
          someOption: [
              { foo:'bar' }
          ]
      }
  },
  options: [
      {
        fieldName: 'field1';
        action: (payload) => ({ type:'action that will be called with the field1 data', payload })
      },
      {
        fieldName: 'field2';
        action: (payload) => ({ type:'action that will be called with the field2 data', payload })
      },
  ]
}));
```

### requestErrorHandlerProcess util:
  - gets the request
  - provide the validation for the request
  - dispatches an action or an array of actions if the response is invalid
  - options for that feature exist in Form-manager-module and in Init-load-manager-module

```javascript
import { requestErrorHandlerProcess } from '@wildberries/redux-core-modules';

// inside the saga
const validatedData = yield* requestErrorHandlerProcess({
  request: () =>
    updateReportRequest({
      id,
      status: STATUS_APPROVED,
    }),
  requestValidator: () => false,
  errorAction: () => ({ type: 'test error action' }),
});
```

## Utils for redux code-splitting:

### inject reducers:

```javascript
import { injectAsyncReducer } from '@wildberries/redux-core-modules';

injectAsyncReducer({
    store,                            '-- pure store object'
    name: 'registrationFormStorage',  '-- reducer name'
    reducer: registrationFormStorage, '-- reducer instance'
});
```

### inject sagas:

```javascript
import { injectAsyncSaga } from '@wildberries/redux-core-modules';

injectAsyncSaga({
    store,                                    '-- pure store object'
    name: 'downloadContractOfferWatcherSaga', '-- saga name'
    saga: downloadContractOfferWatcherSaga,   '-- saga instance'
});
```

### remove sagas:

```javascript
import { removeAsyncSaga } from '@wildberries/redux-core-modules';

removeAsyncSaga({
    store,                                    '-- pure store object'
    name: 'downloadContractOfferWatcherSaga', '-- saga name'
});
```

### remove reducers:
### Warning - please be accurate with this. You can lose your necessary data !

```javascript
import { removeAsyncReducer } from '@wildberries/redux-core-modules';

removeAsyncReducer({
    store,                                    '-- pure store object'
    name: 'registrationFormStorage',          '-- saga name'
});
```
