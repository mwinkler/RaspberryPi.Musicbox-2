
import { app, ipcMain } from 'electron';
import config from '../../shared/config';

export default {

    quitAndShutdown() {
        
        config.hwService.shutdown();
        app.quit();
    }

}