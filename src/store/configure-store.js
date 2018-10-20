// @flow
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

import rootReducer from './root-reducer';
import type { Store } from './types';
import { watchCounter } from './sagas';


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const sagaMiddleware = createSagaMiddleware();
const enhancer = composeEnhancers(applyMiddleware(sagaMiddleware));
const store: Store = createStore(rootReducer, enhancer);

sagaMiddleware.run(watchCounter);

export default store;
