
// lib
import * as ReactDom from 'react-dom';
import * as React from 'react';

// app
import 'font-awesome/css/font-awesome.css';
import './index.scss';
import Player from './views/player';
import Selector from './views/selector';
import playerAction from './actions/player';

document.querySelector('body').innerHTML = '<app></app>';

ReactDom.render(
    <Player></Player>,
    //<Selector></Selector>,
    document.querySelector('app'));
    
setInterval(() => {
    playerAction.updateState().then(() => console.log('Player update finish'));
}, 5000);