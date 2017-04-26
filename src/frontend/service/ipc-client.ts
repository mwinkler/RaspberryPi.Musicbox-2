
import { ipcRenderer } from 'electron';
import IpcCommands from '../../shared/IpcCommand';

export default {

    sendCommand(command: string) {
        
        console.log(`Send IPC command '${command}'`);
        
        ipcRenderer.send(command);
    },

    getPlayerState(): Promise<IMpcStatus> {

        return new Promise((ret, rej) => {
            
            try {
                let response = ipcRenderer.sendSync(IpcCommands.MpdGetState);
                
                console.log(`Recive IPC event '${IpcCommands.MpdGetState}': ${JSON.stringify(response)}`);

                ret(response);
            } 
            catch (error) {
                rej(error);
            }
        });
    }
};;