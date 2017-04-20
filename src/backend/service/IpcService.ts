
import { app, ipcMain } from 'electron';
import MpcFactory from './mpc/MpcFactory';

export default {

    init() {
        const mpcService = MpcFactory.create();
        const mpcConnection = mpcService.connect();

        ipcMain.on('bye', () => {
            console.log('Exit')
            app.quit();
        });

        ipcMain.on('mpd-play', () => mpcConnection.sendCommand('play'));
        ipcMain.on('mpd-stop', () => mpcConnection.sendCommand('stop'));
        ipcMain.on('mpd-next', () => mpcConnection.sendCommand('next'));
        ipcMain.on('mpd-previous', () => mpcConnection.sendCommand('previous'));
        ipcMain.on('mpd-status', () => mpcConnection.sendCommand('status'));
    }
};