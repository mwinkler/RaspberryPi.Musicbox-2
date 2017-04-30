
import MpcDummyClient from './MpcDummyClient';
import MpcLinuxClient from './MpcLinuxClient';

export default {

    create(): IMpcClient {

        const local = process.argv.find(s => s === '--local') !== undefined;

        return local
            ? MpcDummyClient
            : MpcLinuxClient;
    }
}