
import ipcClient from '../service/ipcClient';
import IpcCommands from '../../shared/IpcCommand';
import store from '../store';
<<<<<<< HEAD
import * as CommonReducer from '../reducers/common';
=======
>>>>>>> 863cb964636c3ae7d73fe325ed756e4f68a5ca08

export default {

    quit() {
        ipcClient.sendCommand(IpcCommands.Quit);
    },

    openSelector() {
<<<<<<< HEAD
        store.dispatch(CommonReducer.Creator.SetView('selector'));
=======
        store.dispatch({
            type: 'VIEW/SET_VIEW',
            payload: 'selector'
        });
>>>>>>> 863cb964636c3ae7d73fe325ed756e4f68a5ca08
    }
}