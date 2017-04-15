
const { ipcRenderer } = require('electron');

var main = document.getElementById('main');

main.addEventListener('click', e => {
    ipcRenderer.send('bye');
});