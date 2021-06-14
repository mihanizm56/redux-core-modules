import { Dispatch } from 'redux';
import { InitLoadManagerActionPayloadType } from '@/root-modules/init-load-manager-module';
import { InjectAsyncReducerParams, InjectAsyncSagaParams } from '@/types';

export type StoreInjectConfig = {
  additionalConfig?: {
    callbackOnMount?: (dispatch: Dispatch) => any;
    callbackBeforeInject?: (dispatch: Dispatch) => any;
  };
  sagasToInject?: Array<Omit<InjectAsyncSagaParams, 'store'>>;
  reducersToInject?: Array<Omit<InjectAsyncReducerParams, 'store'>>;
  initialLoadManagerConfig?: InitLoadManagerActionPayloadType;
  customOptions?: Record<string, any>;
  reducersNotToReplace?: Array<string>;
  sagasNotToReplace?: Array<string>;
};
