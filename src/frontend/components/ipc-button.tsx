
import * as React from 'react';
import { ipcRenderer } from 'electron';
import './ipc-button.scss';

interface IMpcButtonProperties {
    command: string;
    icon: string;
}

export default class extends React.Component<IMpcButtonProperties, {}> {

    constructor(properties: IMpcButtonProperties) {
        super(properties);
    }

    click() {
        ipcRenderer.send(this.props.command);
    }

    render() {
        return (
            <div className="mpc-button" onClick={() => this.click()}>
                <i className={'fa ' + this.props.icon}></i>
            </div>
        )
    }
}