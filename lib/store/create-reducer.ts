import { combineReducers } from '../utils/combine-reducers';
import { rootReducers } from './root-reducers';

export const createReducer = ({
  prevState = {},
  asyncReducers,
}: {
  prevState?: any;
  asyncReducers?: any;
}) =>
  combineReducers({
    ...prevState,
    ...asyncReducers,
    ...rootReducers,
  });
