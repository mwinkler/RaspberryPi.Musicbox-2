
import { app, ipcMain } from 'electron';
import * as mpd from 'mpd';

export default () => {

    ipcMain.on('bye', (event, arg) => {
        console.log('Bye!')  // prints "ping"
        app.quit();
    })

    const client = mpd.connect({
        port: 6600,
        host: 'localhost'
    });

    client.on('ready', () => {
        console.log('MPC ready');
    });

    // client.sendCommand('status', [], (err, result) => {
    //     console.log(result);
    // });

    ipcMain.on('mpc-toggle', () => {
        console.log('mpc-toggle');
        client.sendCommand(mpd.cmd('toggle', []), (err, result) => {
            console.log(result);
        });
    })
}