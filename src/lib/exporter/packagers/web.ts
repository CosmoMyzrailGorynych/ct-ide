import fs from '../../neutralino-fs-extra';
import path from 'path';
import {getDirectories} from '../../platformUtils';

/**
 * Exports the project, zips it and returns the path to the output file.
 * The resulting file can be directly used on itch.io and similar platforms.
 */
export const exportForWeb = async (): Promise<string> => {
    const {builds} = await getDirectories();
    const runCtExport = require('src/lib/exporter').exportCtProject;
    const exportFile = path.join(
        builds,
        `${window.currentProject.settings.authoring.title || 'ct.js game'}.zip`
    );

    await fs.remove(exportFile);
    await runCtExport(window.currentProject, window.projdir, true);

    // TODO: add a call to Bun
    return exportFile;
};
