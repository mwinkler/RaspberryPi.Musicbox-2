
// lib
import { combineReducers, createStore, compose, applyMiddleware } from 'redux';

// app
import playerReducer from '../reducers/player';

export interface IRootState {
    player: IMpcStatus
}

const reducers = combineReducers<IRootState>({
    player: playerReducer
});

const store = createStore(reducers);

store.subscribe(() => {
    console.log('Store change', store.getState());
});

export default store;