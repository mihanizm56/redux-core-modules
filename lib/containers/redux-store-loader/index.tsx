import React, { Props } from 'react';

// todo get store in the future or not --- truthly speaking,
// I made this to use this Loader only in pages folders
// import { connect } from 'react-redux';

import {
  injectAsyncReducer,
  removeAsyncReducer,
  injectAsyncSaga,
  removeAsyncSaga,
} from '@/utils';
import { initLoadManagerActionSaga } from '@/root-modules/init-load-manager-module';
import { IAdvancedStore } from '@/types';
import { StoreInjectConfig } from './types';

type PropsType = {
  storeInjectConfig: StoreInjectConfig;
  store: IAdvancedStore;
} & Props<any>;

export class ReduxStoreLoader extends React.PureComponent<PropsType> {
  componentDidMount() {
    // eslint-disable-next-line
    console.warn(
      'Warning! You are using EXPERIMENTAL component ReduxStoreLoader ',
    );

    const {
      store,
      storeInjectConfig: {
        reducersToInject = [],
        sagasToInject = [],
        initialLoadManagerConfig,
      },
    } = this.props;

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

  componentWillUnmount() {
    const {
      store,
      storeInjectConfig: {
        reducersToRemoveAfterUnmount = [],
        sagasToRemoveAfterUnmount = [],
      },
    } = this.props;

    // remove reducers from store
    reducersToRemoveAfterUnmount.map(name =>
      removeAsyncReducer({
        store,
        name,
      }),
    );

    // remove sagas from store
    sagasToRemoveAfterUnmount.forEach(name =>
      removeAsyncSaga({
        store,
        name,
      }),
    );
  }

  render() {
    return this.props.children;
  }
}
