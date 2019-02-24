import { delay } from 'redux-saga';
import { put, call } from 'redux-saga/effects';

import { incrementAsync as incrementAsyncSaga } from '../../../store/counter/sagas';
import { increment, incrementAsync } from '../../../store/counter/actions';

describe('counter sagas', () => {
  const gen = incrementAsyncSaga(incrementAsync(42));

  it('incrementAsync saga must call delay(42 * 1000)', () => {
    expect(gen.next().value).toEqual(call(delay, 42 * 1000));
  });

  it('incrementAsync saga must dispatch an INCREMENT action', () => {
    const expectedAction = increment();
    expect(gen.next().value).toEqual(put(expectedAction));
  });

  it('incrementAsync saga must be done', () => {
    const expectedIteratorState = {
      done: true,
      value: undefined,
    };
    expect(gen.next()).toEqual(expectedIteratorState);
  });
});
