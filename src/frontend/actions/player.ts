
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

    async togglePlay() {
        await ipcClient.sendCommand(IpcCommands.MpdTogglePlay);
        playerActions.updateState();
    },

    async nextTrack() {
        await ipcClient.sendCommand(IpcCommands.MpdNextTrack);
        playerActions.updateState();
    },

    async previousTrack() {
        await ipcClient.sendCommand(IpcCommands.MpdPreviousTrack);
        playerActions.updateState();
    },

    async volumeUp() {
        await ipcClient.sendCommand(IpcCommands.MpdVolumeUp);
        playerActions.updateState();
    },

    async volumeDown() {
        await ipcClient.sendCommand(IpcCommands.MpdVolumeDown);
        playerActions.updateState();
    }
}

export default playerActions;