import React, { PropsWithChildren } from 'react';
import { State } from 'router5';
import { ReactReduxContext } from 'react-redux';
import { IAdvancedStore } from '@/types';
import { replaceReducersAndSagas } from '@/utils/replace-reducers-and-sagas';
import { StoreInjectConfig } from './types';
import { runInjectorConfig } from './utils/run-injector-config';
import { processDeprecationLogs } from './utils/process-deprecation-logs';

type PropsType = PropsWithChildren<{
  toState?: State;
  fromState?: State;
  store?: IAdvancedStore;
  storeInjectConfig?: StoreInjectConfig;
  withoutRemovingReducers?: boolean;
}>;

type StateType = {
  reduxStore: IAdvancedStore;
};

export class ReduxStoreLoader extends React.Component<PropsType, StateType> {
  // eslint-disable-next-line
  static contextType = ReactReduxContext;

  contextStore: IAdvancedStore;

  constructor(props: PropsType, context: any) {
    super(props, context);

    this.contextStore = context.store;

    // link to store in state because of getting "this.context" in getDerivedStateFromProps
    this.state = {
      reduxStore: context.store,
    };

    processDeprecationLogs(props);
  }

  static getDerivedStateFromProps(props: PropsType, state: any) {
    replaceReducersAndSagas({
      fromState: props.fromState,
      toState: props.toState,
      store: state.reduxStore,
      withoutRemovingReducers: props.withoutRemovingReducers,
    });

    return {};
  }

  componentDidMount() {
    runInjectorConfig({
      ...this.props,
      store: this.state.reduxStore,
    });
  }

  componentDidUpdate() {
    runInjectorConfig({
      ...this.props,
      store: this.state.reduxStore,
    });
  }

  render() {
    return this.props.children;
  }
}
