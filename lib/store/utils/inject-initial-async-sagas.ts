import { IAdvancedStore } from '@/types';
import { injectAsyncSaga } from '@/utils';

type PropsType = {
  asyncSagas: Record<string, any>;
  store: IAdvancedStore;
};

export const injectInitialAsyncSagas = ({ asyncSagas, store }: PropsType) =>
  Object.entries(asyncSagas).map(([name, saga]) =>
    injectAsyncSaga({ name, saga, store }),
  );
