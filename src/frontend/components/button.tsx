
import * as React from 'react';
import './button.scss';

interface IButtonProperties {
    command: () => void;
    icon: string;
}

export default class extends React.Component<IButtonProperties, {}> {

    constructor(properties: IButtonProperties) {
        super(properties);
    }

    render() {
        return (
            <div className="mpc-button" onClick={this.props.command}>
                <i className={'fa ' + this.props.icon}></i>
            </div>
        )
    }
}