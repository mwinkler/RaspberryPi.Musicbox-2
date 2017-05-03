
import * as fs from 'fs';
//import * as path from 'path';
import config from '../../shared/config';
import { List } from 'linqts';

export default {

    getAlbums(req: { path?: string, page: number, pageSize: number }): Promise<IAlbum[]> {
        
        return new Promise<IAlbum[]>((ret, rej) => {
            
            try {
                
                req = { path: '', ...req }

                let fullPath = config.library + req.path;
                
                console.log(`Get content of '${fullPath}'`);

                // read directory
                fs.readdir(fullPath, (err, files) => {

                    if (err) {
                        rej(err)
                        return;
                    }

                    console.log(`Content of '${req.path}': ${JSON.stringify(files)}`);
                    
                    // create albums
                    let albums = new List(files)
                        .Skip(req.pageSize * (req.page - 1))
                        .Take(req.pageSize)
                        .Select(folder => ({
                            title: folder,
                            cover: '',
                            path: req.path + '/' + folder
                        } as IAlbum));

                    ret(albums.ToArray());
                });
            } 
            catch (error) {
                rej(error);
            }
        });
    }
}