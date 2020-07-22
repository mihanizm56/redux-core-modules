import { InjectAsyncSagaParams } from '@/types';

export const injectAsyncSaga = ({
  store,
  name,
  saga,
  isRoot,
}: InjectAsyncSagaParams) => {
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
    // make some noise

    // eslint-disable-next-line
    console.warn(`${name} saga was injected earlier`);

    return;
  }

  // get saga to inject
  const sagaToAdd = runSaga(saga, { dispatch, router });

  if (isRoot) {
    // inject root saga
    rootSagas[name] = sagaToAdd;
  } else {
    // inject saga
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