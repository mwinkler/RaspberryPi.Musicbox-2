
import * as mpd from 'mpd';

export default {
    
    connect(): IMpcConnection {

        console.log('Connect to MPD deamon');

        const client = mpd.connect({
            port: 6600,
            host: 'localhost'
        });
        
        return {
            
            sendCommand(command: string) {
                
                console.log(`Send mpd command: '${command}'`);

                client.sendCommand(mpd.cmd(command, []), (err, result) => {
                    
                    console.log(`Mpd command '${command}' response: ${JSON.stringify(result)}`);
                });
            }
        }
    }

} as IMpcClient;