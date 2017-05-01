
import * as fs from 'fs';

export default {

    getAlbums(path: string): Promise<IAlbum[]> {
        
        return new Promise<IAlbum[]>((ret, rej) => {

            fs.readdir(path, (err, files) => {

                if (err) {
                    rej(err)
                    return;
                }

                console.log(`Content of '${path}': ${JSON.stringify(files)}`);

                ret([]);
            });

        });
    }
}