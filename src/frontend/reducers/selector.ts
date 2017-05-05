
const initalState: IAlbumPage = {
    albums: [],
    currentPage: 1,
    hasSubAlbums: false,
    isFirstPage: true,
    isLastPage: true,
    totalAlbums: 0,
    totalPages: 1
}

export type State = typeof initalState;

const types = {
    SetPage: 'SELECTOR/SET_PAGE'
}

export const Creator = {
    SetPage: (page: IAlbumPage) => ({ type: types.SetPage, payload: page })
}

export function Reducer (state = initalState, action) {

    switch(action.type) {

        case types.SetPage:
            state = { ...action.payload };
            break;
    }

    return state;
}