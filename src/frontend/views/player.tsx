
import * as React from 'react';
import './player.scss';
import IpcButton from '../components/ipc-button';

interface IPlayerProperties {

}

export default class Player extends React.Component<IPlayerProperties, {}> {

    render() {
        return (
            <div className="player">
                <div className="player-cover">
                    Current Cover
                    <div className="player-cover-image"></div>
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