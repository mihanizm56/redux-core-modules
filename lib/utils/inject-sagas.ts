import { InjectAsyncSagaParams } from '@/types';

export const injectAsyncSaga = ({
  store,
  sagaName,
  saga,
}: InjectAsyncSagaParams) => {
  // get add injected sagas
  const injectedSagas = store.asyncSagas;
  // get the true-type dispatch
  const dispatch = store.dispatch;
  // get run func
  const runSaga = store.sagaMiddleware.run;
  // get if saga was injected earlier
  const isInjected = Boolean(store.asyncSagas[sagaName]);

  if (isInjected) {
    return;
  }

  // get saga to inject
  const sagaToAdd = runSaga(saga, { dispatch });

  // inject saga
  injectedSagas[sagaName] = sagaToAdd;
};
