
interface IMpcClient {
    connect(): IMpcConnection;
}

interface IMpcConnection {
    getCurrentState(): Promise<IMpcState>;
    togglePlay();
    nextTrack();
    previousTrack();
}

interface IMpcState {
    playing: boolean;
    title: string;
    album: string;
}