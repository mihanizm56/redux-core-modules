import { Action } from '@/types';
import { FormManagerType } from './types';

export const FETCH_FORM_MANAGER = 'FETCH_FORM_MANAGER';
export const fetchFormManagerSagaAction: Action<FormManagerType> = (
  payload: FormManagerType,
) => ({
  type: FETCH_FORM_MANAGER,
  payload,
});
