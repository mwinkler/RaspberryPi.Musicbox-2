
export default {
    
    connect(): IMpcConnection {

        console.log('Connect to dummy MPD deamon');

        var playing = false;
        let p = new Promise<IMpcState>(() => {});

        return {
            
            getCurrentState() {

                return new Promise<IMpcState>((ret, rej) => {
                    ret({
                        playing: playing,
                        album: '',
                        title: ''
                    });
                });
            },

            togglePlay() {

                playing = !playing;

                console.log(`Toggle play to ${playing}`);
            },

            nextTrack() {

            },

            previousTrack() {

            }
        }
    }
    
} as IMpcClient;