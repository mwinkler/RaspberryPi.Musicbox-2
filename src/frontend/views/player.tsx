
// lib
import * as React from 'react';
import { connect } from 'react-redux';

// app
import './player.scss';
import Button from '../components/button';
import playerAction from '../actions/player';
import MpcSate from './../../shared/MpcState';
import { IRootState } from '../store';
import * as moment from 'moment';

//import * as demoCover from '../images/cover.png';

export interface IPlayerProps {
    player: IMpcStatus
}

function mapStateToProps (store: IRootState): IPlayerProps { 
    return {
        player: store.player
    }
}

class Player extends React.Component<IPlayerProps, {}> {

    playerCoverImageStyles: React.CSSProperties;

    constructor(props) {
        super(props);

        this.playerCoverImageStyles = {
            //backgroundImage: `url(${demoCover})`
        }
    }

    render() {
        const isPlaying = this.props.player.state === MpcSate.play;

        return (
            <div className="player">
                <div className="main">
                    <div className="info">
                        {moment(this.props.player.time).format('hh:mm:ss')}
                    </div>
                    <div className="cover" style={this.playerCoverImageStyles}></div>
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
                    <Button command={playerAction.togglePlay} icon={isPlaying ? 'fa-pause' : 'fa-play'}></Button>
                    {/*<Button command={() => {}} icon="fa-stop"></Button>*/}
                    <Button command={playerAction.nextTrack} icon="fa-step-forward"></Button>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(Player);