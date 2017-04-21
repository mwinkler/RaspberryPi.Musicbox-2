
interface IMpcClient {
    connect(): IMpcConnection;
}

interface IMpcConnection {
    getStatus(): Promise<IMpcState>;
    togglePlay();
    nextTrack();
    previousTrack();
}

interface IMpcState {
    playing: boolean;
    title: string;
    album: string;
    trackNumber: number;
    totalTracks: number;
    volume: number;
    time: Date;
}