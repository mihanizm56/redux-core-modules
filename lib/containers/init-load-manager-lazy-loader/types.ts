import { BaseAction } from '@/types';
import {
  InitLoadManagerRequestOptionsType,
  BeforeRequestConfigType,
} from '../../root-modules/init-load-manager-module';

export type InitLoadManagerViewportLoaderConfigType = {
  options?: {
    fullActionLoadingStop?: BaseAction;
    fullActionLoadingStart?: BaseAction;
    setAppErrorAction?: BaseAction;
    requestsSectionId?: string;
    requestBeforeAllConfig?: BeforeRequestConfigType;
  };
  requestConfigList: Array<InitLoadManagerRequestOptionsType>;
};

export type ShouldRecallInitLoadManagerParamsType = {
  prevProps: any;
  currentProps: any;
};
