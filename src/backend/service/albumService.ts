
import * as fs from 'fs';
//import * as path from 'path';
import config from '../../shared/config';
import { List } from 'linqts';

export default {

    getAlbums(options: IAlbumPageOptions): Promise<IAlbumPage> {
        
        return new Promise<IAlbumPage>((ret, rej) => {
            
            try {
                
                options = { path: '', ...options }

                let fullPath = config.library + options.path;
                
                console.log(`Get content of '${fullPath}'`);

                // read directory
                fs.readdir(fullPath, (err, files) => {

                    if (err) {
                        rej(err)
                        return;
                    }

                    //console.log(`Content of '${fullPath}': ${JSON.stringify(files)}`);
                    
                    // create albums
                    let albums = new List(files)
                        .Skip(options.pageSize * (options.page - 1))
                        .Take(options.pageSize)
                        .Select(folder => ({
                            title: folder,
                            cover: '',
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
                });
            } 
            catch (error) {
                rej(error);
            }
        });
    },

    extractAlbumCover(path: string) {

         fs.readdirSync(path);
    }
}