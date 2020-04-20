import {
  SET_SUPPLIERS_DATA,
  SET_LOADING_START,
  SET_LOADING_STOP,
} from './actions';
import { ActionType, SuppliersStateType } from './types';

const initialState: SuppliersStateType = {
  suppliers: [],
  loading: true,
};

export const reducer = (
  state: SuppliersStateType = initialState,
  { type, payload }: ActionType,
) => {
  switch (type) {
    case SET_SUPPLIERS_DATA:
      return {
        ...state,
        suppliers: payload.suppliers,
      };

    case SET_LOADING_START:
      return {
        ...state,
        loading: true,
      };

    case SET_LOADING_STOP:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
};

export default reducer;
