
interface IMpcClient {
    connect(): IMpcConnection;
}

interface IMpcConnection {
    getStatus(): Promise<IMpcStatus>;
    togglePlay();
    nextTrack();
    previousTrack();
}

interface IMpcStatus {
    state;  // todo: find a way to declare a existing enum
    title: string;
    album: string;
    trackNumber: number;
    totalTracks: number;
    volume: number;
    time: Date;
}