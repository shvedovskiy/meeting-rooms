// @flow
import { delay } from 'redux-saga';
import type { Saga } from 'redux-saga';
import { put, call } from 'redux-saga/effects';

import { increment } from './actions';
import type { Action } from './types';


export function* incrementAsync(action: Action): Saga<*> {
  yield call(delay, action.delay * 1000);
  yield put(increment());
}
