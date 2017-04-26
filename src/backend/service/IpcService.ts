
import { app, ipcMain } from 'electron';
import MpcFactory from './mpc/MpcFactory';
import IpcCommand from '../../shared/IpcCommand';

export default {

    init() {

        const mpcService = MpcFactory.create();
        const mpcConnection = mpcService.connect();

        ipcMain.on(IpcCommand.Quit, () => { console.log('Recive IPC: Quit'); app.quit(); });
        ipcMain.on(IpcCommand.MpdTogglePlay, () => { console.log('Recive IPC: MpdTogglePlay'); mpcConnection.togglePlay(); });
        ipcMain.on(IpcCommand.MpdNextTrack, () => { console.log('Recive IPC: MpdNextTrack'); mpcConnection.nextTrack(); });
        ipcMain.on(IpcCommand.MpdPreviousTrack, () => { console.log('Recive IPC: MpdPreviousTrack'); mpcConnection.previousTrack(); });
        ipcMain.on(IpcCommand.MpdVolumeUp, () => { console.log('Recive IPC: MpdVolumeUp'); mpcConnection.volumeUp(); });
        ipcMain.on(IpcCommand.MpdVolumeDown, () => { console.log('Recive IPC: MpdVolumeDown'); mpcConnection.volumeDown(); });

        ipcMain.on(IpcCommand.MpdGetState, async (event, arg) => { 
            console.log('Recive IPC: MpdGetState'); 
            event.returnValue = await mpcConnection.getStatus();
        });
    }
};