
interface IMpcConnection {
    getStatus();
    togglePlay();
    nextTrack();
    previousTrack();
    volumeUp();
    volumeDown();
    play(path: string);
}