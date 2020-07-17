import React, { PropsWithChildren } from 'react';
import { State } from 'router5';
import { Dispatch } from 'redux';
import { injectAsyncReducer, injectAsyncSaga } from '@/utils';
import {
  initLoadManagerActionSaga,
  InitLoadManagerActionPayloadType,
} from '@/root-modules/init-load-manager-module';
import { IAdvancedStore } from '@/types';
import { replaceReducersAndSagas } from '@/utils/replace-reducers-and-sagas';

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
  constructor(props: PropsType) {
    super(props);

    replaceReducersAndSagas({
      fromState: props.fromState,
      toState: props.toState,
      store: props.store,
      withoutRemovingReducers: props.withoutRemovingReducers,
    });
  }

  componentDidMount() {
    const {
      store,
      storeInjectConfig: {
        additionalConfig,
        reducersToInject,
        sagasToInject,
        initialLoadManagerConfig,
      } = {},
    } = this.props;

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
