
// lib
import * as fs from 'fs';
//import * as path from 'path';
import { List } from 'linqts';

// app
import config from '../../shared/config';

const albumService = {

    getAlbums(options: IAlbumPageOptions): Promise<IAlbumPage> {
        
        return new Promise<IAlbumPage>((ret, rej) => {
            
            try {
                
                options = { path: '', ...options }

                let fullPath = config.library + options.path;
                
                console.log(`Get content of '${fullPath}'`);

                // read directory
                var files = fs.readdirSync(fullPath);

                // create albums
                let albums = new List(files)
                    .Skip(options.pageSize * (options.page - 1))
                    .Take(options.pageSize)
                    .Select(folder => ({
                        title: folder,
                        cover: albumService.extractAlbumCover(fullPath + '/' + folder),
                        path: options.path + '/' + folder
                    } as IAlbum));

                let totalPages =  Math.floor(files.length / options.pageSize) + (files.length % options.pageSize > 0 ? 1 : 0);

                ret({
                    albums: albums.ToArray(),
                    currentPage: options.page,
                    totalPages: totalPages,
                    isFirstPage: options.page === 1,
                    isLastPage: options.page === totalPages,
                    totalAlbums: files.length,
                    hasSubAlbums: false
                } as IAlbumPage);
            } 
            catch (error) {
                rej(error);
            }
        });
    },

    extractAlbumCover(path: string): string {
        
        let files = fs.readdirSync(path)
            .filter(path => /\.(jpe?g|png|gif)$/i.test(path));
            
        if (files.length === 0)
            return null;
        
        let fullPath = path + '/' + files[0];

        console.log(`Read cover from '${fullPath}'`);

        return fs.readFileSync(fullPath, 'base64');
    }
}

export default albumService;