import { IAsyncReducers } from '@/types';
import { combineReducers } from '../utils/combine-reducers';

export const createReducer = ({
  prevState = {},
  asyncReducers,
  rootReducers,
}: {
  prevState?: IAsyncReducers;
  asyncReducers?: IAsyncReducers;
  rootReducers: IAsyncReducers;
}) =>
  combineReducers({
    ...prevState,
    ...asyncReducers,
    ...rootReducers,
  });
