import { combineReducers } from './combine-reducers';

// Этот ХАК нужен для того, чтобы при инициализации стора с initialState
// не удалялось прежнее состояние в редюсерах, которые на момент первой клиенской отрисовки еще не были подключены
// так как подключаются лениво через injectReducer.
// Для этого надо создать редюсер вида (state: any) => (state === undefined ? null : state);
// который перезапишется инжектом но при этом сохранится начальное значение initialState в редюсере
export const combineLazyReducers = (reducers: any, initialState: any) => {
  Object.keys(initialState)
    .filter((k) => !reducers[k])
    .forEach((k) => {
      // eslint-disable-next-line no-param-reassign
      reducers[k] = (state: any) => (state === undefined ? null : state);
    });

  return combineReducers(reducers);
};
