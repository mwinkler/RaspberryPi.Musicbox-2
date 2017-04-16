
import * as React from 'react';

const ipcRenderer = require('electron').ipcRenderer;

export default class View1 extends React.Component<{}, {}> {

    click() {
        const { ipcRenderer } = require('electron');
        //this.state.Title = 'your clicked';
        ipcRenderer.send('bye');
    }

    render() {
        return (
            <div>
                <h1 onClick={() => this.click()}>Welcome</h1>
            </div>
        )
    }
}