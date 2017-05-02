
import * as fs from 'fs';
import * as path from 'path';
import config from '../../shared/config';

export default {

    getAlbums(path?: string): Promise<IAlbum[]> {
        
        return new Promise<IAlbum[]>((ret, rej) => {
            
            try {
                let fullPath = config.library + (path || '');
                
                console.log(`Get content of ${fullPath}`);

                fs.readdir(fullPath, (err, files) => {

                    if (err) {
                        rej(err)
                        return;
                    }

                    console.log(`Content of '${path}': ${JSON.stringify(files)}`);
                    
                    // create albums
                    let albums = files.map(folder => {
                        let album: IAlbum = {
                            title: folder,
                            cover: ''
                        }
                        return album;
                    });

                    ret(albums);
                });
            } 
            catch (error) {
                rej(error);
            }
        });
    }
}