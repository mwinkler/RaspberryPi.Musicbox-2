
const { app, ipcMain } = require('electron');

ipcMain.on('bye', (event, arg) => {
  console.log('Bye!')  // prints "ping"
  app.quit();
})