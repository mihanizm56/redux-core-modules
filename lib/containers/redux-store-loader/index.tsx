import React, { PropsWithChildren } from 'react';
import { State } from 'router5';
import { IAdvancedStore } from '@/types';
import { replaceReducersAndSagas } from '@/utils/replace-reducers-and-sagas';
import { StoreInjectConfig } from './types';
import { runInjectorConfig } from './utils/run-injector-config';

type PropsType = PropsWithChildren<{
  toState?: State;
  fromState?: State;
  store: IAdvancedStore;
  storeInjectConfig: StoreInjectConfig;
  withoutRemovingReducers?: boolean;
}>;

export class ReduxStoreLoader extends React.Component<PropsType> {
  static getDerivedStateFromProps(props: PropsType) {
    replaceReducersAndSagas({
      fromState: props.fromState,
      toState: props.toState,
      store: props.store,
      withoutRemovingReducers: props.withoutRemovingReducers,
    });

    return {};
  }

  componentDidMount() {
    runInjectorConfig(this.props);
  }

  componentDidUpdate() {
    runInjectorConfig(this.props);
  }

  render() {
    return this.props.children;
  }
}
