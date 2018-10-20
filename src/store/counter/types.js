// @flow
import * as actions from './actions';


export type Action = 
  $Call<typeof actions.increment> |
  $Call<typeof actions.decrement> |
  $Call<typeof actions.incrementAsync, number>;

export type Counter = number;
