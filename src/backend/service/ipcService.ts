
import { app, ipcMain } from 'electron';
import config from '../../shared/config';
import IpcCommand from '../../shared/IpcCommand';
import albumService from './albumService';

function registerIpcCommand (command, action: Function) {

    ipcMain.on(command, async (event, args) => {

        try {
            console.log(`Revice IPC command '${command}' arguments: ${JSON.stringify(args)}`);
            
            var response =  await action.apply(this, args) || 'OK';
            
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
        registerIpcCommand(IpcCommand.GetAlbumPage, albumService.getAlbums);
        registerIpcCommand(IpcCommand.MpdPlay, mpcConnection.play);

        // albumService.getAlbums({
        //     page: 1,
        //     pageSize: 2
        // }).then(resp => console.log(JSON.stringify(resp)));
    }
};