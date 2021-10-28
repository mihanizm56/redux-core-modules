import React, { Component, createRef, FC } from 'react';
import { connect } from 'react-redux';
import { initLoadManagerActionSaga } from '../../root-modules/init-load-manager-module';
import {
  InitLoadManagerViewportLoaderConfigType,
  ShouldRecallInitLoadManagerParamsType,
} from './types';

type ExternalPropsType = {
  config: InitLoadManagerViewportLoaderConfigType;
  shouldRecallInitLoadManager: (
    params: ShouldRecallInitLoadManagerParamsType,
  ) => boolean;
  [key: string]: any;
};

type ReduxPropsType = {
  initLoadManagerAction: typeof initLoadManagerActionSaga;
};

type PropsType = ReduxPropsType & ExternalPropsType;

export class WrappedContainer extends Component<PropsType> {
  cardRef = createRef<HTMLDivElement>();

  wasLazyLoaded = false;

  componentDidMount() {
    this.initLazyLoading();
  }

  componentDidUpdate(prevProps: ExternalPropsType) {
    try {
      const shouldRecall = this.props.shouldRecallInitLoadManager({
        prevProps,
        currentProps: this.props,
      });

      if (shouldRecall && this.wasLazyLoaded) {
        this.props.initLoadManagerAction(this.props.config);
      }
    } catch (error) {
      console.error(
        'error in componentDidUpdate in InitLoadManagerViewportLoader',
        error,
      );
    }
  }

  initLazyLoading = () => {
    if (!this.cardRef.current) {
      return;
    }

    const observer = new window.IntersectionObserver(
      // always one because triggeren only on our ONE component
      // 1 component per 1 observer
      ([entry]) => {
        if (entry.isIntersecting && !this.wasLazyLoaded) {
          this.props.initLoadManagerAction(this.props.config);

          this.wasLazyLoaded = true;

          if (this.cardRef.current) {
            observer.unobserve(this.cardRef.current);
          }
        }
      },
      { threshold: 0.0000001 },
    );

    observer.observe(this.cardRef.current);
  };

  render() {
    // span - to have an inline element to measure children's height
    return <span ref={this.cardRef}>{this.props.children}</span>;
  }
}

const mapDispatchToProps = {
  initLoadManagerAction: initLoadManagerActionSaga,
};

export const InitLoadManagerViewportLoader: FC<ExternalPropsType> = connect(
  null,
  mapDispatchToProps,
)(WrappedContainer);
