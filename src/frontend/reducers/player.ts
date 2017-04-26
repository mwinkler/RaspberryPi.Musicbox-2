
import mpcState from '../../shared/MpcState';

const initalState: IMpcStatus = {
    album: '',
    state: mpcState.stop,
    time: new Date(0),
    title: '',
    totalTracks: 0,
    currentTrack: 0,
    volume: 0
}

export default function (state = initalState, action) {

    switch(action.type) {

        case 'PLAYER/UPDATE_STATE':
                state = { ...action.payload };
            break;
    }

    return state;
}