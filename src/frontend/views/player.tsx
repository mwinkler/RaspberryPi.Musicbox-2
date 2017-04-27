
// lib
import * as React from 'react';
import { connect } from 'react-redux';

// app
import './player.scss';
import Button from '../components/button';
import playerAction from '../actions/player';
import MpcSate from './../../shared/MpcState';

import * as demoCover from '../images/cover.png';

function mapStateToProps (store) { 
    return {
        player: store.player
    }
}

class Player extends React.Component<any, {}> {

    playerCoverImageStyles: React.CSSProperties;

    constructor(props) {
        super(props);

        this.playerCoverImageStyles = {
            //backgroundImage: `url(${demoCover})`
        }
    }

    render() {

        return (
            <div className="player">
                <div className="main">
                    <div className="info"></div>
                    <div className="cover"  style={this.playerCoverImageStyles}></div>
                    <div className="volume">
                        <Button command={playerAction.volumeUp} icon="fa-volume-up"></Button>
                        <Button command={playerAction.volumeDown} icon="fa-volume-down"></Button>
                    </div>
                </div>
                <div className="title">
                    {this.props.player.title}
                </div>
                <div className="controls">
                    <Button command={playerAction.previousTrack} icon="fa-step-backward"></Button>
                    <Button command={playerAction.togglePlay} icon={this.props.player.state === MpcSate.play ? 'fa-pause' : 'fa-play'}></Button>
                    {/*<Button command={() => {}} icon="fa-stop"></Button>*/}
                    <Button command={playerAction.nextTrack} icon="fa-step-forward"></Button>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(Player)