
// lib
import * as React from 'react';
import { connect } from 'react-redux';

// app
import './selector.scss';
import { IRootState } from '../store';
import commonActions from '../actions/common';
import selectorActions from '../actions/selector';

import * as demoCover from '../images/cover.png';

interface ISelectorProps {
    page?: IAlbumPage;
}

function mapStateToProps (store: IRootState): ISelectorProps { 
    return {
        page: store.selector
    }
}

class Selector extends React.Component<ISelectorProps, {}> {
    
    constructor(props: ISelectorProps) {
        super(props);
    }

    select(item: IAlbum) {

        selectorActions.select(item);
    }

    previousPage() {
    }

    nextPage() {
    }
    
    render() {
        return (
            <div className="selector">
                <div className="nav" onClick={this.previousPage}>
                    <i className="fa fa-chevron-circle-left"></i>
                </div>
                <div className="grid">
                    {this.props.page.albums.map(item => 
                        <div className="item" style={{ backgroundImage: `url(data:image/png;base64,${item.cover})` }} onClick={() => this.select(item)}>
                            <span>{item.title}</span>
                        </div>)}
                </div>
                <div className="nav" onClick={this.nextPage}>
                    <i className="fa fa-chevron-circle-right"></i>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(Selector);