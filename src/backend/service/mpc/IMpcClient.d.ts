
interface IMpcClient {
    connect(): IMpcConnection;
}

interface IMpcConnection {
    sendCommand(command: string): void;
}