
import * as React from 'react';
import { connect } from 'react-redux';

import { IRootState } from '../store';
import Player from './player';
import Selector from './selector';
import { View } from '../reducers/common';

interface IViewProperties {
    view?: View;
}

function mapStateToProps (store: IRootState): IViewProperties { 
    return {
        view: store.common.view
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
            case View.Player: view = <Player></Player>; break;
            case View.Selector: view = <Selector></Selector>; break;
        }

        return (
            <div>
                {view}
            </div>
        )
    }
}

export default connect(mapStateToProps)(Switcher);