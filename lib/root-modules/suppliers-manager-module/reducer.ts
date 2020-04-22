import {
  SET_SUPPLIERS_DATA,
  SET_SUPPLIERS_LOADING_START,
  SET_SUPPLIERS_LOADING_STOP,
} from './actions';
import { ActionType, SuppliersState } from './types';

const initialState: SuppliersState = {
  suppliers: [],
  loading: true,
};

export const reducer = (
  state: SuppliersState = initialState,
  { type, payload }: ActionType,
) => {
  switch (type) {
    case SET_SUPPLIERS_DATA:
      return {
        ...state,
        suppliers: payload.suppliers,
      };

    case SET_SUPPLIERS_LOADING_START:
      return {
        ...state,
        loading: true,
      };

    case SET_SUPPLIERS_LOADING_STOP:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
};

export default reducer;
