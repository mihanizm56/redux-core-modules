import { combineReducers } from 'redux';
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
