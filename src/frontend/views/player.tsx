
import * as React from 'react';
import './player.scss';
import IpcButton from '../components/ipc-button';
import demoCover from '../images/cover.png';

console.log(demoCover);

interface IPlayerProperties {
    cover?: string;
}

export default class Player extends React.Component<IPlayerProperties, {}> {

    playerCoverImageStyles: React.CSSProperties;

    constructor(props: IPlayerProperties) {
        super(props);

        this.playerCoverImageStyles = {
            backgroundImage: `url(${demoCover})`,
            backgroundColor: '#777'
        }
    }

    render() {
        return (
            <div className="player">
                <div className="player-cover">
                    <div className="player-cover-image" style={this.playerCoverImageStyles}></div>
                </div>
                <div className="player-title">
                    Current Title
                </div>
                <div className="player-controls">
                    <IpcButton command="play" icon="fa-play"></IpcButton>
                    <IpcButton command="stop" icon="fa-stop"></IpcButton>
                    <IpcButton command="next" icon="fa-step-forward"></IpcButton>
                    <IpcButton command="previous" icon="fa-step-backward"></IpcButton>
                </div>
            </div>
        )
    }
}