
import * as ReactDom from 'react-dom';
import * as React from 'react';

import View from './components/controls'

document.querySelector('body').innerHTML = '<app></app>';

ReactDom.render(
    <View></View>,
    document.querySelector('app'));