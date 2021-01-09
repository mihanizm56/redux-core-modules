/* eslint-disable no-console */

import { InjectAsyncSagaParams } from '@/types';

export const injectAsyncSaga = ({
  store,
  name,
  saga,
  isRoot,
}: InjectAsyncSagaParams) => {
  // get dependencies
  const dependencies = store.dependencies;
  // get add injected sagas
  const injectedSagas = store.asyncSagas;
  // get root sagas
  const rootSagas = store.rootSagas;
  // get the router
  const router = store.router;
  // get the true-type dispatch
  const dispatch = store.dispatch;
  // get run func
  const runSaga = store.sagaMiddleware.run;
  // get if saga was injected earlier
  const wasSagaInjected = Boolean(injectedSagas[name]);
  // get if saga was injected earlier as a root saga
  const wasRootSagaInjected = Boolean(rootSagas[name]);

  if (wasSagaInjected || wasRootSagaInjected) {
    // make some noise if REACT_APP_REDUX_DEBUG was setted in .env file
    if (process.env.REACT_APP_REDUX_DEBUG) {
      console.warn(`${name} saga was injected earlier`);
    }

    return;
  }

  // run saga
  const sagaToAdd = isRoot
    ? runSaga(saga, { dispatch, router, dependencies, store })
    : runSaga(saga, { dispatch, router, dependencies });

  // register saga
  if (isRoot) {
    rootSagas[name] = sagaToAdd;
  } else {
    injectedSagas[name] = sagaToAdd;
  }

  // log to the devtools
  store.dispatch({
    type: '@REDUX-CORE-MODULES INJECT SAGA',
    payload: {
      name,
    },
  });
};
