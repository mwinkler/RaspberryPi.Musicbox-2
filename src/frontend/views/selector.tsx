
import * as React from 'react';
import './selector.scss';

interface ISelectorProperties {
}

export default class Selector extends React.Component<ISelectorProperties, {}> {
    
    constructor(props: ISelectorProperties) {
        super(props);
    }
    
    render() {
        return (
            <div className="selector">
                <div></div>
            </div>
        )
    }
}