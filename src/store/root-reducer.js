// @flow
import { combineReducers } from 'redux';

import counterReducer from './counter/reducer';

const reducers = {
  counter: counterReducer,
};

export type Reducers = typeof reducers;

export default combineReducers(reducers);
