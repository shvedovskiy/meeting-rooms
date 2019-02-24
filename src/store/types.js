// @flow
import type { Store as ReduxStore, Dispatch as ReduxDispatch } from 'redux';

import type { Action as CounterAction } from './counter/types';
import type { Reducers } from './root-reducer';

type ReduxInitAction = { type: '@@INIT' };

type $ExtractFunctionReturn = <V>(v: (...args: any[]) => V) => V;
export type State = $ObjMap<Reducers, $ExtractFunctionReturn>;

export type Action = ReduxInitAction | CounterAction;
export type Store = ReduxStore<State, Action>;

export type GetState = () => State;
export type Dispatch = ReduxDispatch<Action>;
export type Thunk<A> = ((Dispatch, GetState) => Promise<void> | void) => A;
