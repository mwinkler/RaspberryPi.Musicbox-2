
import * as ReactDom from 'react-dom';
import * as React from 'react';
import 'font-awesome/css/font-awesome.css';
import './index.scss';
import Player from './views/player';
import Selector from './views/selector';

document.querySelector('body').innerHTML = '<app></app>';

ReactDom.render(
    <Player></Player>,
    document.querySelector('app'));