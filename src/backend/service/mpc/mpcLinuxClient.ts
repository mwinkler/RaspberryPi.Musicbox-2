
import * as mpd from 'mpd';
import MpcState from '../../../shared/MpcState';

export default {
    
    connect(): IMpcConnection {

        console.log('Connect to MPD deamon');

        // init mpd connection
        const client = mpd.connect({
            port: 6600,
            host: 'localhost'
        });

        // promisify send command
        const sendCommand = (command, args?: string[]): Promise<string> => {

            return new Promise<string>((ret, rej) => {

                console.log(`Send MPD command '${command}'`);

                client.sendCommand(mpd.cmd(command, args || []), (err, result) => {
                    
                    console.log(`MPD command '${command}' result: '${JSON.stringify(result)}', err: '${JSON.stringify(err)}'`);
                    
                    if (err)
                        rej(err);
                    else
                        ret(result);
                });
            });
        }

        var currentSondId;
        var currentSong = {} as any;
        
        const mpcLinuxClient: IMpcConnection = {
            
            async getStatus() {
                let response = await sendCommand('status');

                let status = mpd.parseKeyValueMessage(response);

                // refresh current song
                if (currentSondId !== status.songid) {
                    
                    let currentSongResponse = await sendCommand('currentsong');
                    currentSong = mpd.parseKeyValueMessage(currentSongResponse);
                    currentSondId = status.songid;
                }

                return {
                    state: MpcState[status.state],
                    album: currentSong.Album || '',
                    title: currentSong.Title || '',
                    track: parseInt(status.song) + 1,
                    totalTracks: parseInt(status.playlistlength),
                    volume: parseInt(status.volume),
                    time: new Date(0),
                };
            },

            async togglePlay() {
                let response = await mpcLinuxClient.getStatus();
                await sendCommand(response.state !== MpcState.play ? 'play' : 'pause');
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
            },

            async play(path: string) {
                
            }
        }

        return mpcLinuxClient;
    }

} as IMpcClient;