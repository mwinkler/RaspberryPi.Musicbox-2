
import ipcClient from '../service/ipcClient';
import IpcCommands from '../../shared/IpcCommand';
import store from '../store';
import * as CommonReducer from '../reducers/common';

export default {

    quit() {
        ipcClient.sendCommand(IpcCommands.Quit);
    }
}