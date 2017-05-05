
import ipcClient from '../service/ipcClient';
import store from '../store';
import IpcCommands from '../../shared/IpcCommand';
import * as PlayerReducer from '../reducers/player';
import * as CommonReducer from '../reducers/common';

const playerActions = {

    async updateState() {
        var state = await ipcClient.getPlayerState();
        store.dispatch(PlayerReducer.Creator.SetState(state));
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
    },

    open() {
        // open view
        store.dispatch(CommonReducer.Creator.SetView(CommonReducer.View.Player));
    }
}

export default playerActions;