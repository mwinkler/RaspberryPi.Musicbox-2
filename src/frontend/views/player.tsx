
//lib
import * as React from 'react';
import { connect } from 'react-redux';

// app
import './player.scss';
import IpcButton from '../components/ipc-button';
import IpcCommand from '../../shared/IpcCommand';

import * as demoCover from '../images/cover.png';

interface IPlayerProperties {
    cover?: string;
}

function mapStateToProps (store) { 
    return {
        player: store.player
    }
}

class Player extends React.Component<any, {}> {

    playerCoverImageStyles: React.CSSProperties;

    constructor(props: IPlayerProperties) {
        super(props);

        this.playerCoverImageStyles = {
            backgroundImage: `url(${demoCover})`
        }
    }

    render() {
        console.log(`Player props: ${JSON.stringify(this.props)}`);
        return (
            <div className="player">
                <div className="main">
                    <div className="info"></div>
                    <div className="cover"  style={this.playerCoverImageStyles}></div>
                    <div className="volume">
                        <IpcButton command={IpcCommand.MpdVolumeUp} icon="fa-volume-up"></IpcButton>
                        <IpcButton command={IpcCommand.MpdVolumeDown} icon="fa-volume-down"></IpcButton>
                    </div>
                </div>
                <div className="title">
                    Current Title
                </div>
                <div className="controls">
                    <IpcButton command={IpcCommand.MpdPreviousTrack} icon="fa-step-backward"></IpcButton>
                    <IpcButton command={IpcCommand.MpdTogglePlay} icon="fa-play"></IpcButton>
                    <IpcButton command={IpcCommand.Quit} icon="fa-stop"></IpcButton>
                    <IpcButton command={IpcCommand.MpdNextTrack} icon="fa-step-forward"></IpcButton>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(Player)