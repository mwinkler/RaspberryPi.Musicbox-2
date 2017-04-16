
import * as React from 'react';

const ipcRenderer = require('electron').ipcRenderer;

export default class View1 extends React.Component<{}, {}> {

    click() {
        ipcRenderer.send('bye ');
    }

    toggle() {
        ipcRenderer.send('mpc-toggle');
    }

    render() {
        return (
            <div>
                <h1 onClick={() => this.click()}>Exit</h1>
                <h1 onClick={() => this.toggle()}>Toggle</h1>
            </div>
        )
    }
}