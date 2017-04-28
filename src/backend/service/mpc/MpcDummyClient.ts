
import MpcState from '../../../shared/MpcState';

export default {
    
    connect(): IMpcConnection {

        console.log('Connect to dummy MPD deamon');

        var timeStart: Date;

        var status: IMpcStatus = {
            state: MpcState.stop,
            album: 'Dummy Album',
            title: '',
            track: 0,
            totalTracks: 10,
            volume: 50,
            time: new Date(0)
        };

        const connection = {
            
            getStatus() {
                status.title = status.state === MpcState.stop
                    ? ''
                    : `Track ${status.track}`;
                status.time = status.state === MpcState.stop
                    ? new Date(0)
                    : new Date(new Date().getTime() - timeStart.getTime());

                return status;
            },

            togglePlay() {
                if (status.state === MpcState.stop)
                    connection.nextTrack();
                else
                    status.state = status.state !== MpcState.play ? MpcState.play : MpcState.pause;

                console.log(`Toggle state to ${status.state}`);
            },

            nextTrack() {
                timeStart = new Date();
                status.track = Math.max(Math.min(status.totalTracks, status.track + 1), 1);
                status.state = MpcState.play;
                console.log(`Next track ${status.track}`);
            },

            previousTrack() {
                timeStart = new Date();
                status.track = Math.max(1, status.track - 1);
                status.state = MpcState.play;
                console.log(`Previous track ${status.track}`);
            },

            volumeUp() {
                status.volume = Math.min(100, status.volume + 1);
                console.log(`Set volume up to ${status.volume}`);
            },

            volumeDown() {
                status.volume = Math.max(0, status.volume - 1);
                console.log(`Set volume down to ${status.volume}`);
            }
        }

        return connection;
    }
    
} as IMpcClient;