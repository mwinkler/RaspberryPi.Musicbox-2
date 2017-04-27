
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

        var currentSondId;
        var currentSong = {} as any;
        
        return {
            
            getStatus() {

                return new Promise<IMpcStatus>(async (ret, rej) => {
                    
                    let response = await sendCommand('status');

                    let status = mpd.parseKeyValueMessage(response.result);

                    // refresh current song
                    if (currentSondId !== status.songid) {
                        
                        let currentSongResponse = await sendCommand('currentsong');
                        currentSong = mpd.parseKeyValueMessage(currentSongResponse.result);
                        currentSondId = status.songid;
                    }

                    ret({
                        state: MpcState[status.state],
                        album: currentSong.Album || '',
                        title: currentSong.Title || '',
                        track: parseInt(status.song) + 1,
                        totalTracks: parseInt(status.playlistlength),
                        volume: parseInt(status.volume),
                        time: new Date(1),
                    });
                });
            },

            async togglePlay() {
                
                let status = await this.getStatus();

                sendCommand(status.state !== MpcState.play ? 'play' : 'pause');
            },

            async nextTrack() {
                await sendCommand('next');
            },

            async previousTrack() {
                await sendCommand('previous');
            },

            async volumeUp() {
                await sendCommand('volume', ['+1']);
            },

            async volumeDown() {
                await sendCommand('volume', ['-1']);
            }
        }
    }

} as IMpcClient;