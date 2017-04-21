
export default {
    
    connect(): IMpcConnection {

        console.log('Connect to dummy MPD deamon');

        var playing = false;
        var trackNumber = 0;
        var totalTracks = 10;
        var volume = 50;

        return {
            
            getStatus() {

                return new Promise<IMpcState>((ret, rej) => {
                    
                    let state = {
                        playing: playing,
                        album: '',
                        title: '',
                        trackNumber: trackNumber,
                        totalTracks: totalTracks,
                        volume: volume,
                        time: new Date(1)
                    };

                    console.log(`Current state: ${JSON.stringify(state)}`);

                    ret(state);
                });
            },

            togglePlay() {
                playing = !playing;
                console.log(`Toggle play to ${playing}`);
            },

            nextTrack() {
                trackNumber = Math.min(totalTracks, trackNumber + 1);
                console.log(`Next track ${trackNumber}`);
            },

            previousTrack() {
                trackNumber = Math.max(1, trackNumber - 1);
                console.log(`Previous track ${trackNumber}`);
            }
        }
    }
    
} as IMpcClient;