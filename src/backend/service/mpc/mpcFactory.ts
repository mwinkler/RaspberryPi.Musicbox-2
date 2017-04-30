
import mpcDummyClient from './mpcDummyClient';
import mpcLinuxClient from './mpcLinuxClient';

export default {

    create(): IMpcClient {

        const local = process.argv.find(s => s === '--local') !== undefined;

        return local
            ? mpcDummyClient
            : mpcLinuxClient;
    }
}