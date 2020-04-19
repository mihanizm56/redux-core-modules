import { SET_MENU_DATA, SET_LOADING_START, SET_LOADING_STOP } from './actions';
import { ActionType, ProductsStateType } from './types';

const initialState: ProductsStateType = {
  menu: [],
  loading: true,
};

export const reducer = (
  state: ProductsStateType = initialState,
  { type, payload }: ActionType,
) => {
  switch (type) {
    case SET_MENU_DATA:
      return {
        ...state,
        menu: payload.menu,
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
