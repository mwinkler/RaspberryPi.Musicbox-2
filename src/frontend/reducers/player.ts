
import mpcState from '../../shared/MpcState';

const initalState: IMpcStatus = {
    album: '',
    state: mpcState.stop,
    time: new Date(0),
    title: '',
    totalTracks: 0,
    track: 0,
    volume: 0
}

const types = {
    SetState: 'PLAYER/SET_STATE'
}

export const Creator = {
    SetState: (state: IMpcStatus) => ({ type: types.SetState, payload: state })
}

export function Reducer (state = initalState, action) {

    switch(action.type) {

        case types.SetState:
            state = { ...action.payload };
            break;
    }

    return state;
}