// @flow
import createReducer from '../common/create-reducer';
import * as types from './action-types';
import type { Counter, Action } from './types';


const initialState = 0;

export default createReducer(initialState, {
  [types.INCREMENT](state: Counter, action: Action) {
    return state + 1;
  },
  [types.DECREMENT](state: Counter, action: Action) {
    return state - 1;
  },
});
