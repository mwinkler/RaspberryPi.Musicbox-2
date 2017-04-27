
import ipcClient from '../service/ipcClient';
import IpcCommands from '../../shared/IpcCommand';

export default {

    quit() {
        ipcClient.sendCommand(IpcCommands.Quit);
    }

}