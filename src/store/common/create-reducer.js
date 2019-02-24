// @flow
import type { Action } from '../types';

type Reducer<S, A: Action> = (S, A) => S;

export default function createReducer<S, A: { +type: string }>(
  initialState: S,
  handlers: { [reducer: string]: Reducer<S, A> },
): Reducer<S, A> {
  return (state: S = initialState, action: A): S => {
    return Object.prototype.hasOwnProperty.call(handlers, action.type)
      ? handlers[action.type](state, action)
      : state;
  };
}
