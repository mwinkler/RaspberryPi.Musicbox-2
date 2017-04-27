
// lib
import { combineReducers, createStore, compose, applyMiddleware } from 'redux';

// app
import playerReducer from './player/reducer';

const reducers = combineReducers({
    player: playerReducer
});

export const store = createStore(reducers);

store.subscribe(() => {
    console.log('store change', store.getState());
});