
import * as React from 'react';
import { connect } from 'react-redux';

import { IRootState } from '../store';
import Player from './player';
import Selector from './selector';

interface ISwitcherProperties {
    view?: string;
}

function mapStateToProps (store: IRootState): ISwitcherProperties { 
    return {
        view: store.view
    }
}

class Switcher extends React.Component<ISwitcherProperties, {}> {
    
    constructor(props: ISwitcherProperties) {
        super(props);
    }
    
    render() {
        console.log('View: ' + this.props.view);
        let view;

        switch (this.props.view) {
            case 'player': view = Player; break;
            case 'selector': view = Selector; break;
        }

        return (
            <div>
                {view}
            </div>
        )
    }
}

export default connect(mapStateToProps)(Switcher);