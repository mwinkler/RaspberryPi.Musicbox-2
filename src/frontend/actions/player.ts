
import ipcClient from '../service/ipc-client';
import { store } from '../store/index';

export default {

    async updateState() {

        var state = await ipcClient.getPlayerState();

        store.dispatch({
            type: 'PLAYER/UPDATE_STATE',
            payload: state
        });
    }
}