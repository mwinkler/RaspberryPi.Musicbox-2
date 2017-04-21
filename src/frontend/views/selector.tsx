
import * as React from 'react';
import './selector.scss';
import * as demoCover from '../images/cover.png';

interface ISelectorProperties {
    items?: ISelectorItem[];
}

interface ISelectorItem {
    title?: string;
    coverUrl?: string;
}

export default class extends React.Component<ISelectorProperties, {}> {
    
    sampleItems: ISelectorItem[];

    constructor(props: ISelectorProperties) {
        super(props);

        this.sampleItems = [
            { title: '1' },
            { title: '1' },
            { title: '1' },
            { title: '1' },
            { title: '1' },
            { title: '1' },
            { title: '1' },
            { title: '1' }
        ];
    }

    select() {

    }
    
    render() {
        return (
            <div className="selector">
                <div className="nav">
                    <i className="fa fa-chevron-circle-left"></i>
                </div>
                <div className="grid">
                    {(this.props.items || this.sampleItems).map(item => 
                        <div className="item" style={{ backgroundImage: `url(${demoCover})` }}></div>)}
                </div>
                <div className="nav">
                    <i className="fa fa-chevron-circle-right"></i>
                </div>
            </div>
        )
    }
}