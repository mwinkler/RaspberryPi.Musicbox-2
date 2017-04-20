
export default {
    
    connect(): IMpcConnection {

        console.log('Connect to dummy MPD deamon');

        return {
            
            sendCommand(command: string) {

                console.log(`Send mpd command: '${command}'`);
            }
        }
    }
    
} as IMpcClient;