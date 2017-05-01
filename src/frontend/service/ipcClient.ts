
import { ipcRenderer } from 'electron';
import IpcCommands from '../../shared/IpcCommand';

const ipcClient = {

    sendCommand<T>(command: string): Promise<T> {
        
        return new Promise((ret, rej) => {

            console.log(`Send IPC command '${command}'`);

            try {
                let response = ipcRenderer.sendSync(command);
                
                console.log(`Recive IPC event '${command}': ${JSON.stringify(response)}`);

                ret(response);
            } 
            catch (error) {
                rej(error);
            }
        });
    },

    getPlayerState(): Promise<IMpcStatus> {

        return ipcClient.sendCommand(IpcCommands.MpdGetState);
    },

    registerEventListener(command: string, callback: Electron.IpcRendererEventListener) {

        ipcRenderer.on(command, callback);
    }
}

export default ipcClient;