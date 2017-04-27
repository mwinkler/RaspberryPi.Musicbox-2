
// lib
import * as ReactDom from 'react-dom';
import * as React from 'react';
import { Provider } from 'react-redux';

// app
import 'font-awesome/css/font-awesome.css';
import './index.scss';
import Player from './views/player';
import Selector from './views/selector';
import playerAction from './actions/player';
import store from './store';

document.querySelector('body').innerHTML = '<app></app>';

ReactDom.render(
    <Provider store={store}>
        <Player></Player>
    </Provider>,
    document.querySelector('app'));
    
setInterval(() => {
    playerAction.updateState().then(() => console.log('Player update finish'));

    console.log(`Current store state: ${JSON.stringify(store.getState())}`);
}, 5000);