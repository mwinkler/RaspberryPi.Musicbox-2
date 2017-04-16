
import { app, ipcMain } from 'electron';
import * as mpdsocket from 'mpdsocket';

export default () => {

    const mpd = new mpdsocket('localhost','6600');

    ipcMain.on('bye', (event, arg) => {
        console.log('Bye!')  // prints "ping"
        app.quit();
    })

    mpd.on('connect', function() {
        console.log('mpd connected');

        mpd.send('status', function(r) {
            console.log(r);
        });
    });

    // client.sendCommand('status', [], (err, result) => {
    //     console.log(result);
    // });

    ipcMain.on('mpc-toggle', () => {
        console.log('mpc-toggle');
        
        mpd.send('toggle', function(r) {
            console.log(r);
        });
    })
}