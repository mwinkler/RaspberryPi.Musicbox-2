
export enum View {
    Player,
    Selector
}

const initalState = {
    view: View.Player
}

const types = {
    SetView: 'COMMON/SET_VIEW',
    SetCurrentAlbum: 'COMMON/SET_CURRENT_ALBUM'
}

export type State = typeof initalState;

export const Creator = {
    SetView: (view: View) => ({ type: types.SetView, payload: view }),
    SetCurrentAlbum: (album: IAlbum) => ({ type: types.SetCurrentAlbum, payload: album })
};

export function Reducer (state = initalState, action) {

    switch(action.type) {

        case types.SetView:
            state = { ...state, view: action.payload };
            break;

        case types.SetCurrentAlbum:
            state = { ...state, currentAlbum: action.payload }
            break;
    }

    return state;
}