import fs from 'fs-extra';
import path from 'path';
import {getBuildDir, getExportDir} from '../../platformUtils';
import Archive from 'adm-zip';

/**
 * Exports the project, zips it and returns the path to the output file.
 * The resulting file can be directly used on itch.io and similar platforms.
 */
export const exportForWeb = async (): Promise<string> => {
    const buildFolder = await getBuildDir();
    const runCtExport = require('src/node_requires/exporter').exportCtProject;
    const exportFile = path.join(
        buildFolder,
        `${window.currentProject.settings.authoring.title || 'ct.js game'}.zip`
    );
    const inDir = await getExportDir();

    await fs.remove(exportFile);
    await runCtExport(window.currentProject, window.projdir, true);

    const archive = new Archive();
    await archive.addLocalFolderPromise(inDir, {});
    await archive.writeZipPromise(exportFile);
    return exportFile;
};
