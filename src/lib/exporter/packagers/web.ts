import fs from '../../neutralino-fs-extra';
import path from 'path';
import {getDirectories} from '../../platformUtils';
import {zip} from 'src/lib/bunchat';

/**
 * Exports the project, zips it and returns the path to the output file.
 * The resulting file can be directly used on itch.io and similar platforms.
 */
export const exportForWeb = async (): Promise<string> => {
    const {builds, exports} = await getDirectories();
    const runCtExport = require('src/lib/exporter').exportCtProject;
    const exportFile = path.join(
        builds,
        `${window.currentProject.settings.authoring.title || 'ct.js game'} (web).zip`
    );

    await fs.remove(exportFile);
    await runCtExport(window.currentProject, window.projdir, true);

    await zip({
        dir: exports,
        out: exportFile
    });
    return exportFile;
};
