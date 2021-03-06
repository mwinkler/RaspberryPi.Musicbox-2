
import { Gpio } from 'pigpio';
import { exec } from 'child_process';
import commonService from '../commonService';

const service: IHardwareService = {

    init: () => {

        // set boot pin to low (atx input is pulled up)
        let atxTx = new Gpio(4, { mode: Gpio.OUTPUT });
        atxTx.digitalWrite(0);

        // listen on atx rx pin for shutdown signal
        let atxRx = new Gpio(17, { mode: Gpio.INPUT, pullUpDown: Gpio.PUD_UP, edge: Gpio.EITHER_EDGE });
        atxRx.on('interrupt', level => {
            console.log(`GPIO change to level ${level}`);

            if (level === 0) {
                console.log('ATX send shutdown signal');
                commonService.quitAndShutdown();
            }
        });
    },

    shutdown: () => {

        exec('shutdown now -h');
    }
}

export default service;