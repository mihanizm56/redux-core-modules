import React, { PropsWithChildren } from 'react';
import { State } from 'router5';
import { injectAsyncReducer, injectAsyncSaga } from '@/utils';
import {
  initLoadManagerActionSaga,
  InitLoadManagerActionPayloadType,
} from '@/root-modules/init-load-manager-module';
import { IAdvancedStore } from '@/types';
import { removeAllInjectedReducers } from '@/utils/remove-all-injected-reducers';
import { removeAllInjectedSagas } from '@/utils/remove-all-injected-sagas';

type PropsType = PropsWithChildren<{
  toState: State;
  fromState: State;
  store: IAdvancedStore;
  sagasToInject?: Array<any>;
  reducersToInject?: Array<any>;
  initialLoadManagerConfig?: InitLoadManagerActionPayloadType;
}>;

export class ReduxStoreLoader extends React.Component<PropsType> {
  componentDidMount() {
    const {
      fromState,
      toState,
      store,
      reducersToInject = [],
      sagasToInject = [],
      initialLoadManagerConfig,
    } = this.props;

    // define first route name to navigate from
    const coreRouteFromStateName =
      fromState && fromState.name ? fromState.name.split('.')[0] : null;

    // define first route name to navigate to
    const coreRouteToStateName =
      toState && toState.name ? toState.name.split('.')[0] : null;

    if (toState && coreRouteToStateName !== coreRouteFromStateName) {
      // replace all injected reducers and sagas
      removeAllInjectedReducers(store);
      removeAllInjectedSagas(store);

      // make some noise =)
      console.warn('ReduxStoreLoader replaced old reducers'); // eslint-disable-line
    }

    // inject reducers
    reducersToInject.forEach(({ reducer, name }) =>
      injectAsyncReducer({
        store,
        name,
        reducer,
      }),
    );

    // inject sagas
    sagasToInject.forEach(({ saga, name }) =>
      injectAsyncSaga({
        store,
        name,
        saga,
      }),
    );

    // dispatch initial load requests
    if (initialLoadManagerConfig) {
      store.dispatch(initLoadManagerActionSaga(initialLoadManagerConfig));
    }
  }

  render() {
    return this.props.children;
  }
}
