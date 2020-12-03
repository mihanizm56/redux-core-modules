import React, { PropsWithChildren, ContextType } from 'react';
import { State } from 'router5';
import { ReactReduxContext } from 'react-redux';
import { IAdvancedStore } from '@/types';
import { replaceReducersAndSagas } from '@/utils/replace-reducers-and-sagas';
import { StoreInjectConfig } from './types';
import { runInjectorConfig } from './utils/run-injector-config';

type PropsType = PropsWithChildren<{
  toState?: State;
  fromState?: State;
  store?: IAdvancedStore;
  storeInjectConfig?: StoreInjectConfig;
  withoutRemovingReducers?: boolean;
  context: {
    store: IAdvancedStore;
  };
}>;

// TODO Fix eslint and ts errors
export class ReduxStoreLoader extends React.Component<PropsType> {
  // eslint-disable-next-line
  static contextType = ReactReduxContext;

  // eslint-disable-next-line
  // @ts-ignore
  context: ContextType<typeof ReactReduxContext>; //eslint-disable-line

  constructor(props: PropsType) {
    super(props);

    this.state = {};
  }

  static getDerivedStateFromProps(props: PropsType) {
    replaceReducersAndSagas({
      fromState: props.fromState,
      toState: props.toState,
      // eslint-disable-next-line
      // @ts-ignore
      store: props.store || this.context.store,
      withoutRemovingReducers: props.withoutRemovingReducers,
    });

    return {};
  }

  componentDidMount() {
    runInjectorConfig({
      ...this.props,
      // eslint-disable-next-line
      // @ts-ignore
      store: this.props.store || this.context.store,
    });
  }

  componentDidUpdate() {
    runInjectorConfig({
      ...this.props,
      // eslint-disable-next-line
      // @ts-ignore
      store: this.props.store || this.context.store,
    });
  }

  render() {
    return this.props.children;
  }
}
