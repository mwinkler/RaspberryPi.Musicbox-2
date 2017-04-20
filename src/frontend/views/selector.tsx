
import * as React from 'react';
import './selector.scss';

interface ISelectorProperties {
    items?: any[];
}

export default class Selector extends React.Component<ISelectorProperties, {}> {
    
    constructor(props: ISelectorProperties) {
        super(props);
    }
    
    render() {
        return (
            <div className="selector">
                <div className="nav">
                    F
                </div>
                <div className="grid">
                    { 
                        //this.props.items.map(item => <div className="item"></div>) 
                    }
                </div>
                <div className="nav"></div>
            </div>
        )
    }
}