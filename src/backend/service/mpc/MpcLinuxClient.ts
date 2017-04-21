
import * as mpd from 'mpd';

export default {
    
    connect(): IMpcConnection {

        console.log('Connect to MPD deamon');

        const client = mpd.connect({
            port: 6600,
            host: 'localhost'
        });

        const sendCommand = (command): Promise<{err: string, result: string}> => {

            return new Promise<{err: string, result: string}>((ret, rej) => {

                console.log(`Send MPD command '${command}'`);

                client.sendCommand(mpd.cmd(command, []), (err, result) => {
                    
                    console.log(`MPD command '${command}' result: '${result}', err: '${err}'`);

                    ret({
                        err: err,
                        result: result
                    });
                });
            });
        }
        
        return {
            
            getStatus() {

                return new Promise<IMpcState>(async (ret, rej) => {
                    
                    let result = await sendCommand('status');

                    let state = {
                        playing: false,
                        album: '',
                        title: '',
                        trackNumber: 1,
                        totalTracks: 10,
                        volume: 50,
                        time: new Date(1)
                    };

                    ret(state);
                });
            },

            togglePlay() {
                sendCommand('play');
            },

            nextTrack() {
                sendCommand('next');
            },

            previousTrack() {
                sendCommand('previous');
            }
        }
    }

} as IMpcClient;