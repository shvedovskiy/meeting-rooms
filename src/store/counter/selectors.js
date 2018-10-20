// @flow
import { createSelector } from 'reselect';

import type { Counter } from './types';


const counter = (state: Counter): Counter => state;

export const counterSelector: (Counter) => Counter = createSelector(
  counter,
  (counter: Counter): Counter => counter,
);
