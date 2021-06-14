import { IAdvancedStore } from '@/types';

export const removeAllInjectedSagas = ({
  store,
  sagasNotToReplace,
}: {
  store: IAdvancedStore;
  sagasNotToReplace: Array<string>;
}) => {
  // get injected sagas
  const injectedSagas = store.asyncSagas;

  // delete sagas from injected sagas registry and stop them
  Object.keys(injectedSagas).forEach(sagaName => {
    const isSagaStable = Boolean(
      sagasNotToReplace.find(
        notReplacedSagaName => notReplacedSagaName === sagaName,
      ),
    );

    if (!isSagaStable) {
      injectedSagas[sagaName].cancel();

      delete injectedSagas[sagaName];
    }
  });
};
