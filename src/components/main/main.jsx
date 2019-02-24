// @flow
import * as React from 'react';
import { connect } from 'react-redux';

import type { State, Dispatch } from '../../store/types';
import type { Counter } from '../../store/counter/types';
import * as actions from '../../store/counter/actions';
import { getCounter } from '../../store/root-selectors';

import classes from './main.module.css';
import logo from './logo.svg';

type Props = {
  counter: Counter,
  incrementCounter: () => void,
  decrementCounter: () => void,
  incrementCounterAsync: number => void,
};

export const Main = ({
  counter,
  incrementCounter,
  decrementCounter,
  incrementCounterAsync,
}: Props) => (
  <div className={classes.Main}>
    <header className={classes.Main_header}>
      <img src={logo} className={classes.Main_logo} alt="logo" />
      <p>
        Edit <code>src/App.js</code> and save to reload.
      </p>
      <a
        href="https://reactjs.org"
        className={classes.Main_link}
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React
      </a>
    </header>
    <main className={classes.Main_content}>
      <div className={classes.Main_counter}>
        <p>Counter: {counter}</p>
      </div>
      <div className={classes.Main_buttons}>
        <button onClick={() => incrementCounter()}>+1</button>
        <button onClick={() => decrementCounter()}>-1</button>
        <button onClick={() => incrementCounterAsync(Math.random() * 5)}>
          +1 Async
        </button>
      </div>
    </main>
  </div>
);

const mapStateToProps = (state: State) => ({
  counter: getCounter(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  incrementCounter() {
    return dispatch(actions.increment());
  },
  decrementCounter() {
    return dispatch(actions.decrement());
  },
  incrementCounterAsync(delay: number) {
    return dispatch(actions.incrementAsync(delay));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Main);
