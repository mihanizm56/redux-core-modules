import {
  START_PAGE_LOADING,
  STOP_PAGE_LOADING,
  SET_ERRORS_MAP,
  SET_APP_ERROR_STATE,
  REMOVE_APP_ERROR_STATE,
} from './actions';
import { IUIState } from './types';

const initialState: IUIState = {
  pageIsLoadingState: false,
  errorsMap: {
    TIMEOUT_ERROR: 'Превышено ожидание запроса',
    REQUEST_DEFAULT_ERROR: 'Системная ошибка',
  },
  isAppError: false,
};

type ActionsType = {
  type: string;
  payload?: Record<string, any>;
};

const reducer = (
  state: IUIState = initialState,
  { type, payload }: ActionsType,
): IUIState => {
  switch (type) {
    case START_PAGE_LOADING:
      return { ...state, pageIsLoadingState: true };
    case STOP_PAGE_LOADING:
      return { ...state, pageIsLoadingState: false };
    case SET_ERRORS_MAP:
      return { ...state, errorsMap: { ...state.errorsMap, ...payload } };
    case SET_APP_ERROR_STATE:
      return { ...state, isAppError: true };
    case REMOVE_APP_ERROR_STATE:
      return { ...state, isAppError: false };

    default:
      return state;
  }
};

export default reducer;
