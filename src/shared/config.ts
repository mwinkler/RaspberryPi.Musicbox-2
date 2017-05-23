
import mpcDummyClient from '../backend/service/mpc/mpcDummyClient';
import mpcLinuxClient from '../backend/service/mpc/mpcLinuxClient';
import piHwService from '../backend/service/hardware/piHardwareService';
import dummyHwService from '../backend/service/hardware/dummyHardwareService';

const isLocal = process.argv.find(s => s === '--local') !== undefined;

const local: IConfig = {
    library: 'Z:/My Documents/Music',
    mpcClient: mpcDummyClient,
    hwService: dummyHwService
}

const production: IConfig = {
    library: '/home/pi/Music',
    mpcClient: mpcLinuxClient,
    hwService: piHwService
}

export default isLocal 
    ? local 
    : production;