import path from 'path';
import fs from '../../neutralino-fs-extra';
const {os} = Neutralino;
import {getDirectories} from '../../platformUtils';
import {getFilesDir, getIctPath, getProjectCodename} from '.';
import {run} from 'buntralino-client';

export const zipProject = async (): Promise<string> => {
    const savePromise = new Promise<void>((resolve) => {
        window.signals.one('projectSaved', () => {
            resolve();
        });
        window.signals.trigger('saveProject');
    });
    await savePromise;

    const projName = getProjectCodename();
    const {ct} = await getDirectories();
    const inDir = await fs.mkdtemp(path.join(await os.getPath('temp'), 'ctZipProject-')),
          outName = `${ct}/${projName}.zip`;

    await fs.remove(outName);
    await fs.copy(getIctPath(), path.join(inDir, projName));
    await fs.copy(getFilesDir(), path.join(inDir, projName + '.ict'));
    await run('zip', {
        dir: inDir,
        out: outName
    });
    // await fs.remove(inDir);

    return outName;
};
