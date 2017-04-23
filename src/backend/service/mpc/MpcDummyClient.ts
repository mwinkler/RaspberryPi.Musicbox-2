
import MpcState from '../../../shared/MpcState';

export default {
    
    connect(): IMpcConnection {

        console.log('Connect to dummy MPD deamon');

        var state = MpcState.stop;
        var trackNumber = 0;
        var totalTracks = 10;
        var volume = 50;

        return {
            
            getStatus() {

                return new Promise<IMpcStatus>((ret, rej) => {
                    
                    let status: IMpcStatus = {
                        state: state,
                        album: '',
                        title: '',
                        trackNumber: trackNumber,
                        totalTracks: totalTracks,
                        volume: volume,
                        time: new Date(1)
                    };

                    console.log(`Current state: ${JSON.stringify(state)}`);

                    ret(status);
                });
            },

            togglePlay() {
                state = state !== MpcState.play ? MpcState.play : MpcState.pause;
                console.log(`Toggle state to ${state}`);
            },

            nextTrack() {
                trackNumber = Math.min(totalTracks, trackNumber + 1);
                console.log(`Next track ${trackNumber}`);
            },

            previousTrack() {
                trackNumber = Math.max(1, trackNumber - 1);
                console.log(`Previous track ${trackNumber}`);
            },

            volumeUp() {
            },

            volumeDown() {
            }
        }
    }
    
} as IMpcClient;