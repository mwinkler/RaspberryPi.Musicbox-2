
import * as React from 'react';

const ipcRenderer = require('electron').ipcRenderer;

export default class View1 extends React.Component<{}, {}> {

    click() {
        ipcRenderer.send('bye');
    }

    play() {
        ipcRenderer.send('mpd-play');
    }

    stop() {
        ipcRenderer.send('mpd-stop');
    }

    status() {
        ipcRenderer.send('mpd-status');
    }

    render() {
        return (
            <div>
                <h1 onClick={() => this.click()}>Exit</h1>
                <h1 onClick={() => this.play()}>Play</h1>
                <h1 onClick={() => this.stop()}>Stop</h1>
                <h1 onClick={() => this.status()}>Status</h1>
            </div>
        )
    }
}