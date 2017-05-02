
import mpcDummyClient from '../backend/service/mpc/mpcDummyClient';
import mpcLinuxClient from '../backend/service/mpc/mpcLinuxClient';

const isLocal = process.argv.find(s => s === '--local') !== undefined;

const local: IConfig = {
    library: 'Z:/My Documents/Music',
    mpcClient: mpcDummyClient
}

const production: IConfig = {
    library: '',
    mpcClient: mpcLinuxClient
}

export default isLocal 
    ? local 
    : production;