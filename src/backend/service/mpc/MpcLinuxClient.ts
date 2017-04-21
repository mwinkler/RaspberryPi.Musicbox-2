
import * as mpd from 'mpd';

export default {
    
    connect(): IMpcConnection {

        console.log('Connect to MPD deamon');

        const client = mpd.connect({
            port: 6600,
            host: 'localhost'
        });

        const sendCommand = (command) => {

            console.log(`Send mpd command: '${command}'`);

            client.sendCommand(mpd.cmd(command, []), (err, result) => {
                
                console.log(`Mpd command '${command}' response: ${JSON.stringify(result)}`);
            });
        }
        
        return {
            
            getCurrentState() {

                return new Promise<IMpcState>((ret, rej) => {
                    
                    client.sendCommand(mpd.cmd('state', []), (err, result) => {
                        ret(result);
                        //console.log(`Mpd command '${command}' response: ${JSON.stringify(result)}`);
                    });
                });
            },

            togglePlay() {

            },

            nextTrack() {

            },

            previousTrack() {

            }
        }
    }

} as IMpcClient;