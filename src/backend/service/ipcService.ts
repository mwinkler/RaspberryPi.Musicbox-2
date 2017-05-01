
import { app, ipcMain } from 'electron';
import mpcFactory from './mpc/MpcFactory';
import IpcCommand from '../../shared/IpcCommand';

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

        const mpcService = mpcFactory.create();
        const mpcConnection = mpcService.connect();
        
        registerIpcCommand(IpcCommand.Quit, () => app.quit());
        registerIpcCommand(IpcCommand.MpdTogglePlay, mpcConnection.togglePlay);
        registerIpcCommand(IpcCommand.MpdNextTrack, mpcConnection.nextTrack);
        registerIpcCommand(IpcCommand.MpdPreviousTrack, mpcConnection.previousTrack);
        registerIpcCommand(IpcCommand.MpdVolumeUp, mpcConnection.volumeUp);
        registerIpcCommand(IpcCommand.MpdVolumeDown, mpcConnection.volumeDown);
        registerIpcCommand(IpcCommand.MpdGetState, mpcConnection.getStatus);
    }
};