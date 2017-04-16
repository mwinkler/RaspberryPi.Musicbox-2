
const { app, ipcMain } = require('electron');
const mpd = require('mpd');

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

client.sendCommand('status', [], (err, result) => {
    console.log(result);
});

ipcMain.on('mpc-toggle', () => {
    client.sendCommand('toggle', [], (err, result) => {
        console.log(result);
    });
})