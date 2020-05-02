import { InitLoadManagerActionPayloadType } from '@/root-modules/init-load-manager-module';

export type StoreInjectConfig = {
  sagasToInject?: Array<any>;
  sagasToRemoveAfterUnmount?: Array<string>;
  reducersToInject?: Array<any>;
  reducersToRemoveAfterUnmount?: Array<string>;
  initialLoadManagerConfig?: InitLoadManagerActionPayloadType;
};
