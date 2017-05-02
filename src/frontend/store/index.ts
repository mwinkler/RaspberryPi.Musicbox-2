
// lib
import { combineReducers, createStore, compose, applyMiddleware } from 'redux';

// app
import * as PlayerReducer from '../reducers/player';
import * as CommonReducer from '../reducers/common';

export interface IRootState {
    player: IMpcStatus,
    common: CommonReducer.State
}

const reducers = combineReducers<IRootState>({
    player: PlayerReducer.Reducer,
    common: CommonReducer.Reducer
});

const store = createStore(reducers);

store.subscribe(() => {
    console.log('Store change', store.getState());
});

export default store;