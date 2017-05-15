
import * as gpio from 'pi-gpio';

const service: IHardwareService = {

    init: () => {

        // set boot pin to high
        // gpio.open(16, "output", function(err) {		// Open pin 16 for output
        //     gpio.write(16, 1, function() {			// Set pin 16 high (1)
        //         gpio.close(16);						// Close pin 16
        //     });
        // });
    },

    shutdown: () => {

    }
}

export default service;