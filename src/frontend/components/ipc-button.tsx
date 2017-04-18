
import * as React from 'react';
import { ipcRenderer } from 'electron';
import './ipc-button.scss';

interface IMpcButtonProperties {
    command: string;
    title: string;
}

export default class IpcButton extends React.Component<IMpcButtonProperties, {}> {

    constructor(properties: IMpcButtonProperties) {
        super(properties);
    }

    click() {
        ipcRenderer.send(this.props.command);
    }

    render() {
        return (
            <div className="mpc-button" onClick={() => this.click()}>
                <span>{this.props.title}</span>
            </div>
        )
    }
}