
// lib
import { combineReducers, createStore, compose, applyMiddleware } from 'redux';

// app
import playerReducer from '../reducers/player';
import viewReducer from '../reducers/view';

export interface IRootState {
    player: IMpcStatus,
    view: string
}

const reducers = combineReducers<IRootState>({
    player: playerReducer,
    view: viewReducer
});

const store = createStore(reducers);

store.subscribe(() => {
    console.log('Store change', store.getState());
});

export default store;