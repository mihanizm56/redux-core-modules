import { State } from 'router5';
import { IAdvancedStore } from '@/types';
import { removeAllInjectedReducers } from './remove-all-injected-reducers';
import { removeAllInjectedSagas } from './remove-all-injected-sagas';

type ParamsType = {
  toState?: State;
  fromState?: State;
  store: IAdvancedStore;
  reducersNotToReplace?: Array<string>;
  sagasNotToReplace?: Array<string>;
};

export const replaceReducersAndSagas = ({
  fromState,
  toState,
  store,
  reducersNotToReplace = [],
  sagasNotToReplace = [],
}: ParamsType) => {
  // define first route name to navigate from
  const coreRouteFromStateName =
    fromState && fromState.name ? fromState.name.split('.')[0] : null;

  // define first route name to navigate to
  const coreRouteToStateName =
    toState && toState.name ? toState.name.split('.')[0] : null;

  // replace all injected reducers and sagas
  if (toState && fromState && coreRouteToStateName !== coreRouteFromStateName) {
    removeAllInjectedReducers({ store, reducersNotToReplace });
    removeAllInjectedSagas({ store, sagasNotToReplace });

    // make some noise =)
    console.warn('ReduxStoreLoader replaced old reducers'); // eslint-disable-line
  }
};
