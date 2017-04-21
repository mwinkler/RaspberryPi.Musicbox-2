
interface IMpcClient {
    connect(): IMpcConnection;
}

interface IMpcConnection {
    getCurrentState(): Promise<IMpcState>;
    togglePlay();
    sendCommand(command: string): void;
}

interface IMpcState {
    playing: boolean;
    title: string;
    album: string;
}