
import { app, ipcMain } from 'electron';
import * as mpd from 'mpd';

export default () => {

    const client = mpd.connect({
        port: 6600,
        host: 'localhost'
    });

    client.on('ready', () => {
        console.log('MPC ready');
    });

    function sendMpdCommand(cmd) {
        console.log(cmd);
        
        client.sendCommand(mpd.cmd(cmd, []), (err, result) => {
            console.log(JSON.stringify(result));
        });
    }
    
    ipcMain.on('bye', (event, arg) => {
        console.log('Bye!')  // prints "ping"
        app.quit();
    });

    ipcMain.on('mpd-play', () => sendMpdCommand('play'));
    ipcMain.on('mpd-stop', () => sendMpdCommand('stop'));
    ipcMain.on('mpd-status', () => sendMpdCommand('status'));
}