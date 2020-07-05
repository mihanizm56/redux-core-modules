import React, { PropsWithChildren } from 'react';
import { State } from 'router5';
import { Dispatch } from 'redux';
import { injectAsyncReducer, injectAsyncSaga } from '@/utils';
import {
  initLoadManagerActionSaga,
  InitLoadManagerActionPayloadType,
} from '@/root-modules/init-load-manager-module';
import { IAdvancedStore } from '@/types';
import { removeAllInjectedReducers } from '@/utils/remove-all-injected-reducers';
import { removeAllInjectedSagas } from '@/utils/remove-all-injected-sagas';

export type StoreInjectConfig = {
  additionalConfig?: {
    callbackOnMount?: (dispatch: Dispatch) => any;
  };
  sagasToInject?: Array<any>;
  reducersToInject?: Array<any>;
  initialLoadManagerConfig?: InitLoadManagerActionPayloadType;
};

type PropsType = PropsWithChildren<{
  toState: State;
  fromState: State;
  store: IAdvancedStore;
  storeInjectConfig: StoreInjectConfig;
  withoutRemovingReducers?: boolean;
}>;

export class ReduxStoreLoader extends React.Component<PropsType> {
  componentDidMount() {
    const {
      fromState,
      toState,
      store,
      withoutRemovingReducers,
      storeInjectConfig: {
        additionalConfig,
        reducersToInject,
        sagasToInject,
        initialLoadManagerConfig,
      } = {},
    } = this.props;

    // define first route name to navigate from
    const coreRouteFromStateName =
      fromState && fromState.name ? fromState.name.split('.')[0] : null;

    // define first route name to navigate to
    const coreRouteToStateName =
      toState && toState.name ? toState.name.split('.')[0] : null;

    // replace all injected reducers and sagas
    if (
      toState &&
      coreRouteToStateName !== coreRouteFromStateName &&
      !withoutRemovingReducers
    ) {
      removeAllInjectedReducers(store);
      removeAllInjectedSagas(store);

      // make some noise =)
      console.warn('ReduxStoreLoader replaced old reducers'); // eslint-disable-line
    }

    // inject reducers
    if (reducersToInject) {
      reducersToInject.forEach(({ reducer, name }) =>
        injectAsyncReducer({
          store,
          name,
          reducer,
        }),
      );
    }

    // inject sagas
    if (sagasToInject) {
      sagasToInject.forEach(({ saga, name }) =>
        injectAsyncSaga({
          store,
          name,
          saga,
        }),
      );
    }

    // dispatch initial load requests
    if (initialLoadManagerConfig) {
      store.dispatch(initLoadManagerActionSaga(initialLoadManagerConfig));
    }

    // if additional confix exists
    if (additionalConfig) {
      if (additionalConfig.callbackOnMount) {
        // call an action on mount page
        additionalConfig.callbackOnMount(store.dispatch);
      }
    }
  }

  render() {
    return this.props.children;
  }
}
