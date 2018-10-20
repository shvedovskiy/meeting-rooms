import configureStore from 'redux-mock-store';
import createSagaMiddleware from 'redux-saga';

import * as types from '../../../store/counter/action-types';
import * as actions from '../../../store/counter/actions'; 
import { watchCounter } from '../../../store/sagas';


const sagaMiddleware = createSagaMiddleware();
const mockStore = configureStore([sagaMiddleware]);
const defaultCounterState = {
  counter: 0,
};

describe('actions', () => {
  it('should create INCREMENT action', () => {
    const expectedAction = {
      type: types.INCREMENT,
    };
    expect(actions.increment()).toEqual(expectedAction);
  });

  it('should create DECREMENT action', () => {
    const expectedAction = {
      type: types.DECREMENT,
    };
    expect(actions.decrement()).toEqual(expectedAction);
  });

  it('should create INCREMENT action in async mode', done => {
    const store = mockStore(defaultCounterState);
    sagaMiddleware.run(watchCounter);

    const expectedActions = [
      {
        type: types.INCREMENT_ASYNC,
        delay: 2,
      },
      { type: types.INCREMENT },
    ];

    store.subscribe(() => {
      const actions = store.getActions();
      if (actions.length >= expectedActions.length){
        expect(actions).toEqual(expectedActions);
        done();
      }
    });
    store.dispatch(actions.incrementAsync(2));
  });
});
