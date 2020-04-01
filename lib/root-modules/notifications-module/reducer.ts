import { SET_MODAL, REMOVE_MODAL } from './actions';
import { INotificationsStorage, NotificationType } from './types';

type NotificationsActionsType = {
  type: string;
  payload: NotificationType | string;
};

const initialState: INotificationsStorage = {
  modals: [],
};

const reducer = (
  state: INotificationsStorage = initialState,
  { type, payload }: NotificationsActionsType,
) => {
  switch (type) {
    case SET_MODAL:
      return {
        ...state,
        modals: [...state.modals, payload],
      };

    case REMOVE_MODAL:
      return {
        ...state,
        modals: state.modals.filter(modal => modal.id !== payload),
      };

    default:
      return state;
  }
};

export default reducer;
