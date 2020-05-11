import { IReducersMap } from '@/types';
import { combineReducers } from '../utils/combine-reducers';

export const createReducer = ({
  prevState = {},
  asyncReducers,
  rootReducers,
}: {
  prevState?: IReducersMap;
  asyncReducers?: IReducersMap;
  rootReducers: IReducersMap;
}) =>
  combineReducers({
    ...prevState,
    ...asyncReducers,
    ...rootReducers,
  });
