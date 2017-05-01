
import ipcClient from '../service/ipcClient';
import IpcCommands from '../../shared/IpcCommand';
import store from '../store';

export default {

    quit() {
        ipcClient.sendCommand(IpcCommands.Quit);
    },

    openSelector() {
        store.dispatch({
            type: 'VIEW/SET_VIEW',
            payload: 'selector'
        });
    }
}