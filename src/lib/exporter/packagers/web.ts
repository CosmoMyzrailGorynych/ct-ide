import fs from '../../neutralino-fs-extra';
import path from 'path';
import {getDirectories} from '../../platformUtils';
import {run} from 'buntralino-client';
import {exportCtProject} from '..';
import {getFilesDir} from '../../resources/projects';

/**
 * Exports the project, zips it and returns the path to the output file.
 * The resulting file can be directly used on itch.io and similar platforms.
 */
export const exportForWeb = async (): Promise<string> => {
    const {builds, exports} = await getDirectories();
    const exportFile = path.join(
        builds,
        `${window.currentProject.settings.authoring.title || 'ct.js game'} (web).zip`
    );

    await fs.remove(exportFile);
    await exportCtProject(window.currentProject, getFilesDir(), {
        debug: false,
        desktop: false,
        production: true
    });

    await run('zip', {
        dir: exports,
        out: exportFile
    });
    return exportFile;
};
