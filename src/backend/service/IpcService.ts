
import { app, ipcMain } from 'electron';
import MpcFactory from './mpc/MpcFactory';
import MpcCommand from './IpcCommand';

export default {

    init() {
        const mpcService = MpcFactory.create();
        const mpcConnection = mpcService.connect();

        ipcMain.on('bye', () => {
            console.log('Exit')
            app.quit();
        });

        ipcMain.on('mpd-togglePlay', () => mpcConnection.togglePlay());
        //ipcMain.on('mpd-stop', () => mpcConnection.sendCommand('stop'));
        ipcMain.on('mpd-next', () => mpcConnection.nextTrack());
        ipcMain.on('mpd-previous', () => mpcConnection.previousTrack());
        //ipcMain.on('mpd-status', () => mpcConnection.sendCommand('status'));
    }
};