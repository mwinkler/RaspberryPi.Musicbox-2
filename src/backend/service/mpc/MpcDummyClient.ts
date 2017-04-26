
import MpcState from '../../../shared/MpcState';

export default {
    
    connect(): IMpcConnection {

        console.log('Connect to dummy MPD deamon');

        var status: IMpcStatus = {
            state: MpcState.stop,
            album: 'Dummy Album',
            title: '',
            currentTrack: 0,
            totalTracks: 10,
            volume: 50,
            time: new Date(1)
        };

        return {
            
            getStatus() {

                return new Promise<IMpcStatus>((ret, rej) => {

                    status.title = status.state === MpcState.play
                        ? `Track ${status.currentTrack}`
                        : '';

                    console.log(`Current state: ${JSON.stringify(status)}`);

                    ret(status);
                });
            },

            togglePlay() {
                status.currentTrack = Math.max(status.currentTrack, 1);
                status.state = status.state !== MpcState.play ? MpcState.play : MpcState.pause;
                console.log(`Toggle state to ${status.state}`);
            },

            nextTrack() {
                status.currentTrack = Math.min(status.totalTracks, status.currentTrack + 1);
                console.log(`Next track ${status.currentTrack}`);
            },

            previousTrack() {
                status.currentTrack = Math.max(1, status.currentTrack - 1);
                console.log(`Previous track ${status.currentTrack}`);
            },

            volumeUp() {
                status.volume = Math.min(100, status.volume + 1);
            },

            volumeDown() {
                status.volume = Math.max(0, status.volume - 1);
            }
        }
    }
    
} as IMpcClient;