import { Dispatch } from 'redux';
import { InitLoadManagerActionPayloadType } from '@/root-modules/init-load-manager-module';
import { InjectAsyncReducerParams, InjectAsyncSagaParams } from '@/types';

export type StoreInjectConfig = {
  additionalConfig?: {
    callbackOnMount?: (dispatch: Dispatch) => any;
  };
  sagasToInject?: Array<InjectAsyncSagaParams>;
  reducersToInject?: Array<InjectAsyncReducerParams>;
  initialLoadManagerConfig?: InitLoadManagerActionPayloadType;
};
