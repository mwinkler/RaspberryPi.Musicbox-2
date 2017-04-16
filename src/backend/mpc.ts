
import { app, ipcMain } from 'electron';
import * as mpdsocket from 'mpdsocket';

export default () => {

    const mpd = new mpdsocket('localhost','6600');

    function sendMpdCommand(cmd) {
        console.log(cmd);
        
        mpd.send(cmd, function(r) {
            console.log(JSON.stringify(r));
        });
    }
    
    ipcMain.on('bye', (event, arg) => {
        console.log('Bye!')  // prints "ping"
        app.quit();
    })

    mpd.on('connect', function() {
        console.log('mpd connected');
    });

    ipcMain.on('mpd-play', () => sendMpdCommand('play'));
    ipcMain.on('mpd-stop', () => sendMpdCommand('stop'));
    ipcMain.on('mpd-status', () => sendMpdCommand('status'));
}