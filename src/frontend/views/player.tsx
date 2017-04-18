
import * as React from 'react';

import './player.scss';
import IpcButton from '../components/ipc-button';

export default class Player extends React.Component<{}, {}> {

    render() {
        return (
            <div className="player">
                <div className="player-controls">
                    <IpcButton command="play" title="Play"></IpcButton>
                    <IpcButton command="stop" title="Stop"></IpcButton>
                    <IpcButton command="next" title="Next"></IpcButton>
                    <IpcButton command="previous" title="Previous"></IpcButton>
                </div>
            </div>
        )
    }
}