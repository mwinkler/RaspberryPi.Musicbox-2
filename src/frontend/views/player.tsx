
import * as React from 'react';
import './player.scss';
import IpcButton from '../components/ipc-button';
import * as demoCover from '../images/cover.png';

interface IPlayerProperties {
    cover?: string;
}

export default class extends React.Component<IPlayerProperties, {}> {

    playerCoverImageStyles: React.CSSProperties;

    constructor(props: IPlayerProperties) {
        super(props);

        this.playerCoverImageStyles = {
            backgroundImage: `url(${demoCover})`
        }
    }

    render() {
        return (
            <div className="player">
                <div className="cover">
                    <div className="image" style={this.playerCoverImageStyles}></div>
                </div>
                <div className="title">
                    Current Title
                </div>
                <div className="controls">
                    <IpcButton command="mpd-previous" icon="fa-step-backward"></IpcButton>
                    <IpcButton command="mpd-togglePlay" icon="fa-play"></IpcButton>
                    <IpcButton command="quit" icon="fa-stop"></IpcButton>
                    <IpcButton command="mpd-next" icon="fa-step-forward"></IpcButton>
                </div>
            </div>
        )
    }
}