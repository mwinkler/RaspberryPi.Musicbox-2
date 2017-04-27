
import ipcClient from '../service/ipcClient';
import store from '../store';
import IpcCommands from '../../shared/IpcCommand';

const playerActions = {

    async updateState() {

        var state = await ipcClient.getPlayerState();

        store.dispatch({
            type: 'PLAYER/UPDATE_STATE',
            payload: state
        });
    },

    togglePlay() {
        ipcClient.sendCommand(IpcCommands.MpdTogglePlay);
        playerActions.updateState();
    },

    nextTrack() {
        ipcClient.sendCommand(IpcCommands.MpdNextTrack);
        playerActions.updateState();
    },

    previousTrack() {
        ipcClient.sendCommand(IpcCommands.MpdPreviousTrack);
        playerActions.updateState();
    },

    volumeUp() {
        ipcClient.sendCommand(IpcCommands.MpdVolumeUp);
        playerActions.updateState();
    },

    volumeDown() {
        ipcClient.sendCommand(IpcCommands.MpdVolumeDown);
        playerActions.updateState();
    }
}

export default playerActions;