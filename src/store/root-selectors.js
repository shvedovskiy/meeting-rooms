// @flow
import type { State } from './types';
import { counterSelector } from './counter/selectors';


export const getCounter = (state: State) => counterSelector(state.counter);
