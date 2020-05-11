import { IAdvancedStore } from '@/types';

export const removeAllInjectedSagas = (store: IAdvancedStore) => {
  // get injected sagas
  const injectedSagas = store.asyncSagas;

  // delete sagas from injected sagas registry and stop them
  Object.keys(injectedSagas).forEach(sagaName => {
    injectedSagas[sagaName].cancel();

    delete injectedSagas[sagaName];
  });
};
