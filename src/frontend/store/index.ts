
// lib
import { combineReducers, createStore, compose, applyMiddleware } from 'redux';

// app
import * as PlayerReducer from '../reducers/player';
import * as CommonReducer from '../reducers/common';
import * as SelectorReducer from '../reducers/selector';

export interface IRootState {
    player: IMpcStatus,
    common: CommonReducer.State,
    selector: SelectorReducer.State
}

const reducers = combineReducers<IRootState>({
    player: PlayerReducer.Reducer,
    common: CommonReducer.Reducer,
    selector: SelectorReducer.Reducer
});

const store = createStore(reducers);

store.subscribe(() => {
    console.log('Store change', store.getState());
});

export default store;