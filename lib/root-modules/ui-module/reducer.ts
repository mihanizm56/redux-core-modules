import {
  START_PAGE_LOADING,
  STOP_PAGE_LOADING,
  SET_APP_ERROR_STATE,
  REMOVE_APP_ERROR_STATE,
  START_I18NEXT_LOADING,
  STOP_I18NEXT_LOADING,
} from './actions';
import { IUIState } from './types';

export const initialState: IUIState = {
  pageIsLoadingState: false,
  isAppError: false,
  i18nextIsLoadingState: true, // true потому что сначала надо загрузить словарь
  // и не дать отрисоваться остальному контенту
};

type ActionsType = {
  type: string;
};

export const reducer = (
  state: IUIState = initialState,
  { type }: ActionsType,
): IUIState => {
  switch (type) {
    case START_PAGE_LOADING:
      return { ...state, pageIsLoadingState: true };
    case STOP_PAGE_LOADING:
      return { ...state, pageIsLoadingState: false };
    case SET_APP_ERROR_STATE:
      return { ...state, isAppError: true };
    case REMOVE_APP_ERROR_STATE:
      return { ...state, isAppError: false };
    case START_I18NEXT_LOADING:
      return { ...state, i18nextIsLoadingState: true };
    case STOP_I18NEXT_LOADING:
      return { ...state, i18nextIsLoadingState: false };

    default:
      return state;
  }
};

export default reducer;
