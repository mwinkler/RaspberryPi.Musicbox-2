
import { ipcRenderer } from 'electron';
import IpcCommand from '../../shared/IpcCommand';

const ipcClient = {

    sendCommand<T>(command: string, ...args): Promise<T> {
        
        return new Promise((ret, rej) => {

            console.log(`Send IPC command '${command}' arguments: ${JSON.stringify(args)}`);

            try {

                let response = ipcRenderer.sendSync(command, args);
                
                console.log(`Recive IPC event '${command}': ${JSON.stringify(response)}`);

                ret(response);
            } 
            catch (error) {
                rej(error);
            }
        });
    },

    getPlayerState(): Promise<IMpcStatus> {

        return ipcClient.sendCommand(IpcCommand.MpdGetState);
    },

    registerEventListener(command: string, callback: Electron.IpcRendererEventListener) {

        ipcRenderer.on(command, callback);
    },

    getAlbumPage(options: IAlbumPageOptions): Promise<IAlbumPage> {

        return ipcClient.sendCommand(IpcCommand.GetAlbumPage, options);
    }
}

export default ipcClient;