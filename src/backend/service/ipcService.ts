
import { app, ipcMain } from 'electron';
import config from '../../shared/config';
import IpcCommand from '../../shared/IpcCommand';
import albumService from './albumService';

function registerIpcCommand (command, action: Function) {

    ipcMain.on(command, async (event, arg) => {

        try {
            console.log(`Revice IPC command '${command}'`);
            
            var response =  await action.apply(this) || 'OK';
            
            console.log(`IPC command '${command}' response: ${JSON.stringify(response)}`);
            
            event.returnValue = response;
        } 
        catch (error) {
            console.error(error);
        }
    });
}

export default {

    init() {

        const mpcConnection = config.mpcClient.connect();
        
        registerIpcCommand(IpcCommand.Quit, () => app.quit());
        registerIpcCommand(IpcCommand.MpdTogglePlay, mpcConnection.togglePlay);
        registerIpcCommand(IpcCommand.MpdNextTrack, mpcConnection.nextTrack);
        registerIpcCommand(IpcCommand.MpdPreviousTrack, mpcConnection.previousTrack);
        registerIpcCommand(IpcCommand.MpdVolumeUp, mpcConnection.volumeUp);
        registerIpcCommand(IpcCommand.MpdVolumeDown, mpcConnection.volumeDown);
        registerIpcCommand(IpcCommand.MpdGetState, mpcConnection.getStatus);

        albumService.getAlbums();
    }
};