
import * as ReactDom from 'react-dom';
import * as React from 'react';

import View from './components/controls';
import Player from './views/player';

document.querySelector('body').innerHTML = '<app></app>';

ReactDom.render(
    //<View></View>
    <Player></Player>,
    document.querySelector('app'));