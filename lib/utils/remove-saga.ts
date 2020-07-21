import { InjectAsyncSagaParams } from '@/types';

export const removeAsyncSaga = ({
  store,
  name,
}: Omit<InjectAsyncSagaParams, 'saga'>) => {
  // get add injected sagas
  const injectedSagas = store.asyncSagas;
  // get if saga was injected earlier
  const isInjected = Boolean(injectedSagas[name]);

  if (!isInjected) {
    return;
  }

  // cancel the existing saga
  injectedSagas[name].cancel();

  // delete cancelled saga from storage
  delete injectedSagas[name];

  // log to the devtools
  store.dispatch({
    type: '@REDUX-CORE-MODULES REMOVE SAGA',
    payload: {
      name,
    },
  });
};
