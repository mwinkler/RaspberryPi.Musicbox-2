
import store from '../store';
import * as CommonReducer from '../reducers/common';
import * as SelectorReducer from '../reducers/selector';
import ipcClient from '../service/ipcClient';

const selectorActions = {

    async open() {

        // get album page
        let albumPage = await ipcClient.getAlbumPage({ path: '', page: 1, pageSize: 6 });

        // update album page
        store.dispatch(SelectorReducer.Creator.SetPage(albumPage));

        // open view
        store.dispatch(CommonReducer.Creator.SetView(CommonReducer.View.Selector));
    },

    select(album: IAlbum) {

        // set album
        store.dispatch(CommonReducer.Creator.SetCurrentAlbum(album));

        // start play
        ipcClient.play(album.path);

        // switch to player view
        store.dispatch(CommonReducer.Creator.SetView(CommonReducer.View.Player));
    }

}

export default selectorActions;