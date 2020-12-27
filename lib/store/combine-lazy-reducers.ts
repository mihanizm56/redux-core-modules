import { combineReducers } from '@/utils';

// Этот Хак нужен для того, чтобы при инициализации стора с initialState
// не удалялось прежнее состояние
// Для этого надо создать редюсер вида (state: any) => (state === undefined ? null : state);
// который перезапишется инжектом но при этом сохранится начальное значение initialState
export const combineLazyReducers = (reducers: any, initialState: any) => {
  Object.keys(initialState)
    .filter(k => !reducers[k])
    .forEach(k => {
      // eslint-disable-next-line no-param-reassign
      reducers[k] = (state: any) => (state === undefined ? null : state);
    });

  return combineReducers(reducers);
};
