
import * as React from 'react';
import { connect } from 'react-redux';

import { IRootState } from '../store';
import Player from './player';
import Selector from './selector';

interface IViewProperties {
    view?: string;
}

function mapStateToProps (store: IRootState): IViewProperties { 
    return {
        view: store.view
    }
}

class Switcher extends React.Component<IViewProperties, {}> {
    
    constructor(props: IViewProperties) {
        super(props);
    }
    
    render() {
        console.log('View: ' + this.props.view);
        let view;

        switch (this.props.view) {
            case 'player': view = <Player></Player>; break;
            case 'selector': view = <Selector></Selector>; break;
        }

        return (
            <div>
                {view}
            </div>
        )
    }
}

export default connect(mapStateToProps)(Switcher);