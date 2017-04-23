
import { app, ipcMain } from 'electron';
import MpcFactory from './mpc/MpcFactory';
import IpcCommand from '../../shared/IpcCommand';

export default {

    init() {

        const mpcService = MpcFactory.create();
        const mpcConnection = mpcService.connect();

        ipcMain.on(IpcCommand.Quit, () => {
            console.log('Quit')
            app.quit();
        });

        ipcMain.on(IpcCommand.MpdTogglePlay, () => mpcConnection.togglePlay());
        ipcMain.on(IpcCommand.MpdNextTrack, () => mpcConnection.nextTrack());
        ipcMain.on(IpcCommand.MpdPreviousTrack, () => mpcConnection.previousTrack());
        ipcMain.on(IpcCommand.MpdVolumeUp, () => mpcConnection.volumeUp());
        ipcMain.on(IpcCommand.MpdVolumeDown, () => mpcConnection.volumeDown());

        // setInterval(() => {
        //     mpcConnection.getStatus();
        // }, 1000);
    }
};