
import * as ReactDom from 'react-dom';
import * as React from 'react';

document.querySelector('body').innerHTML = '<app></app>';

ReactDom.render(
    <h1>Hello</h1>,
    document.querySelector('app'));

// var main = document.getElementById('main');

// main.addEventListener('click', e => {
//     ipcRenderer.send('bye');
// });