
import os from 'os';
import path from 'path';
import fs from 'fs-extra';
import {getWritableDir} from '../../platformUtils';
import Archive from 'adm-zip';

export const zipProject = async (): Promise<string> => {
    const savePromise = new Promise<void>((resolve) => {
        window.signals.one('projectSaved', () => {
            resolve();
        });
        window.signals.trigger('saveProject');
    });
    await savePromise;

    const writable = await getWritableDir();
    const inDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ctZipProject-')),
          outName = path.join(writable, `/${sessionStorage.projname}.zip`);

    await fs.remove(outName);
    await fs.remove(inDir);
    await fs.copy(window.projdir + '.ict', path.join(inDir, sessionStorage.projname));
    await fs.copy(window.projdir, path.join(inDir, sessionStorage.projname.slice(0, -4)));

    const archive = new Archive();
    await archive.addLocalFolderPromise(inDir, {});
    await archive.writeZipPromise(outName);
    return outName;
};
