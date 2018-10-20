// @flow
import type { Saga } from 'redux-saga';
import { takeLatest } from 'redux-saga/effects';

import * as types from './counter/action-types';
import { incrementAsync } from './counter/sagas';


export function* watchCounter(): Saga<any> {
  yield takeLatest(types.INCREMENT_ASYNC, incrementAsync);
}
