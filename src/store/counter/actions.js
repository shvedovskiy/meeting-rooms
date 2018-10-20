// @flow
import * as types from './action-types';
import type { Action } from './types';

export const increment = (): Action => ({
  type: types.INCREMENT,
});

export const decrement = (): Action => ({
  type: types.DECREMENT,
});

export const incrementAsync = (delay: number = 1): Action => ({
  type: types.INCREMENT_ASYNC,
  delay,
});
