import fs from './neutralino-fs-extra';
import {getLanguageJSON} from './i18n';
import path from 'path';
const {os} = Neutralino;

export const isDev = () => window.NL_ARGS.includes('--neu-dev-auto-reload');
export const isWin = window.NL_OS === 'Windows';
export const isWindows = isWin;
export const isLinux = window.NL_OS === 'Linux';
export const isMac = window.NL_OS === 'Darwin';

// We compute a directory once and store it forever
let exportDir: string,
    exportDirPromise: Promise<string>,
    buildDir: string,
    buildDirPromise: Promise<string>,
    projectsDir: string,
    projectsDirPromise: Promise<string>;

    /**
     * Checks whether a given directory is writable
     *
     * @param {String} way A path to check against
     * @returns {Promise<Boolean>} Resolves into either `true` (if writable) or `false`
     */
export const checkWritable = async (way: string): Promise<boolean> => {
    try {
        // eslint-disable-next-line no-bitwise
        await fs.access(way, fs.constants.R_OK | fs.constants.W_OK);
        return true;
    } catch (e) {
        return false;
    }
};
/**
 * Gets a directory ct.js can write to. It can be either a path where an executable is placed
 * or a ct.js folder in the home directory. Throws an error if no directory is available.
 *
 * @returns {Promise<String>} A writable directory
 */
export const getWritableDir = async (): Promise<string> => {
    if (localStorage.customWritableDir) {
        if (!(await checkWritable(localStorage.customWritableDir))) {
            throw new Error(`Custom data folder ${localStorage.customWritableDir} is read-only`);
        }
        return localStorage.customWritableDir;
    }
    const path = require('path');

    const exec = path.dirname(window.NL_CWD).replace(/\\/g, '/');
    // The `HOME` variable is not always available in ct.js on Windows
    // eslint-disable-next-line no-process-env
    const home = await Neutralino.os.getPath('documents');

    const execWritable = checkWritable(exec);
    const homeWritable = checkWritable(home);
    await execWritable; // Run in parallel
    await homeWritable;
    // writing to an exec path on Mac is not a good idea,
    // as it will be hidden inside an app's directory, which is shown as one file.
    if (isMac && !homeWritable) {
        throw new Error(`Could not write to folder ${home}. It is needed to create builds and run debugger. Check rights to these folders, and tweak sandbox settings if it is used.`);
    }
    // Home directory takes priority
    if (await homeWritable) {
        const ctFolder = path.join(home, 'ct.js');
        await fs.ensureDir(ctFolder);
        if (await checkWritable(ctFolder)) {
            return ctFolder;
        }
        throw new Error(`The ct.js folder ${ctFolder} is read-only, though its parent isn't. Check your access rights on this folder`);
    }
    if (!execWritable) {
        throw new Error(`Could not write to folders ${home} and ${exec}. A folder is needed to create builds and run debugger. Check access rights to these folders, and tweak sandbox settings if it is used.`);
    }
    return exec;
};
export const getTempDir = async (): Promise<{dir: string, remove: () => void}> => {
    const tempdir = await os.getPath('temp');
    const dir = await fs.mkdtemp(path.join(tempdir, 'ctjs-'));
    return {
        dir,
        remove() {
            return fs.remove(dir);
        }
    };
};
export const requestWritableDir = async (): Promise<boolean> => {
    const voc = getLanguageJSON().writableFolderSelector;
    const folder = await window.showOpenDialog({
        openDirectory: true,
        title: voc.headerSelectFolderForData
    }) as string;
    try {
        const stats = await fs.getStats(folder);
        if (!stats.isDirectory) {
            window.alertify.error(voc.notADirectory);
            return false;
        }
        try {
            await fs.access(folder, fs.constants.W_OK);
            localStorage.customWritableDir = folder;
            window.alertify.success(voc.complete);
            return true;
        } catch (e) {
            window.alertify.error(voc.folderNotWritable);
        }
    } catch (e) {
        window.alertify.error(voc.folderDoesNotExist);
    }
    return false;
};

export const getGalleryDir = (createHref?: boolean): string => {
    if (createHref) {
        return ('file://' + path.posix.normalize(path.join(window.NL_CWD, 'bundledAssets')));
    }
    return path.join(path.dirname(window.NL_CWD), 'bundledAssets');
};
export const getProjectsDir = (): Promise<string> => {
    if (projectsDir) {
        return Promise.resolve(projectsDir);
    }
    if (projectsDirPromise) {
        return projectsDirPromise;
    }
    projectsDirPromise = getWritableDir().then(async (ctjsDir: string) => {
        const dir = path.join(ctjsDir, 'Projects');
        await fs.ensureDir(dir);
        projectsDir = dir;
        return projectsDir;
    });
    return projectsDirPromise;
};
export const getBuildDir = (): Promise<string> => {
    if (buildDir) {
        return Promise.resolve(buildDir);
    }
    if (buildDirPromise) {
        return buildDirPromise;
    }
    buildDirPromise = getWritableDir().then(async (ctjsDir: string) => {
        const dir = require('path').join(ctjsDir, 'Builds');
        await fs.ensureDir(dir);
        buildDir = dir;
        return buildDir;
    });
    return buildDirPromise;
};
export const getExportDir = (): Promise<string> => {
    if (exportDir) {
        return Promise.resolve(exportDir);
    }
    if (exportDirPromise) {
        return exportDirPromise;
    }
    exportDirPromise = getWritableDir().then(async ctjsDir => {
        const dir = require('path').join(ctjsDir, 'Exported');
        await fs.ensureDir(dir);
        exportDir = dir;
        return exportDir;
    });
    return exportDirPromise;
};

/** Opens a folder in the default OS file manager */
export const showFolder = (folder: string): void => {
    if (isWin) {
        os.execCommand(`%SystemRoot%\\explorer.exe  "${folder}"`);
    } else if (isMac) {
        os.execCommand(`open "${folder}"`);
    } else {
        os.execCommand(`xdg-open "${folder}"`);
    }
};
/** Opens a folder containing the given file in the default OS file manager */
export const showFile = (file: string): void => {
    const dirname = path.dirname(file);
    showFolder(dirname);
};
