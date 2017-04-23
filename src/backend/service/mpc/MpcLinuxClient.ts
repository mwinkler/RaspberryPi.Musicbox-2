
import * as mpd from 'mpd';
import MpcState from '../../../shared/MpcState';

export default {
    
    connect(): IMpcConnection {

        console.log('Connect to MPD deamon');

        const client = mpd.connect({
            port: 6600,
            host: 'localhost'
        });

        const sendCommand = (command, args?: string[]): Promise<{err: string, result: string}> => {

            return new Promise<{err: string, result: string}>((ret, rej) => {

                console.log(`Send MPD command '${command}'`);

                client.sendCommand(mpd.cmd(command, args || []), (err, result) => {
                    
                    console.log(`MPD command '${command}' result: '${JSON.stringify(result)}', err: '${JSON.stringify(err)}'`);

                    ret({
                        err: err,
                        result: result
                    });
                });
            });
        }
        
        return {
            
            getStatus() {

                return new Promise<IMpcStatus>(async (ret, rej) => {
                    
                    let response = await sendCommand('status');

                    // transform npd state string into object
                    let stateMpd = {} as any;
                    response.result
                        .split('\n')
                        .forEach(line => {
                            if (line) {
                                let parts = line.split(':');
                                stateMpd[parts[0]] = parts[1].trim();
                            }
                        });

                    let state: IMpcStatus = {
                        state: MpcState[stateMpd.state],
                        album: '',
                        title: '',
                        trackNumber: parseInt(stateMpd.song) + 1,
                        totalTracks: parseInt(stateMpd.playlistlength),
                        volume: parseInt(stateMpd.volume),
                        time: new Date(1),
                    };

                    ret(state);
                });
            },

            async togglePlay() {
                
                let status = await this.getStatus();

                sendCommand(status.state !== MpcState.play ? 'play' : 'pause');
            },

            nextTrack() {
                sendCommand('next');
            },

            previousTrack() {
                sendCommand('previous');
            },

            volumeUp() {
                sendCommand('volume', ['+1']);
            },

            volumeDown() {
                sendCommand('volume', ['-1']);
            }
        }
    }

} as IMpcClient;