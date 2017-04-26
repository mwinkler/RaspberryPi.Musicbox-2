
import { combineReducers, createStore, compose, applyMiddleware } from 'redux';

import reducers from '../reducers/index';

export const store = createStore(reducers);

store.subscribe(() => {
    console.log('store change', store.getState());
});