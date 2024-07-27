import fs from './neutralino-fs-extra';
import {getLanguageJSON} from './i18n';
import path from 'path';
import {os} from '@neutralinojs/lib';

export const isDev = () => window.NL_ARGS.includes('--neu-dev-auto-reload');
const isWin = window.NL_OS === 'Windows';
const isLinux = window.NL_OS === 'Linux';
const isMac = window.NL_OS === 'Darwin';

// We compute a directory once and store it forever
let exportDir: string,
    exportDirPromise: Promise<string>,
    buildDir: string,
    buildDirPromise: Promise<string>,
    projectsDir: string,
    projectsDirPromise: Promise<string>;

const mod = {
    isWin,
    isWindows: isWin,
    isLinux,
    isMac,
    isDev,

    /**
     * Checks whether a given directory is writable
     *
     * @param {String} way A path to check against
     * @returns {Promise<Boolean>} Resolves into either `true` (if writable) or `false`
     */
    async checkWritable(way: string): Promise<boolean> {
        try {
            // eslint-disable-next-line no-bitwise
            await fs.access(way, fs.constants.R_OK | fs.constants.W_OK);
            return true;
        } catch (e) {
            return false;
        }
    },
    /**
     * Gets a directory ct.js can write to. It can be either a path where an executable is placed
     * or a ct.js folder in the home directory. Throws an error if no directory is available.
     *
     * @returns {Promise<String>} A writable directory
     */
    async getWritableDir(): Promise<string> {
        if (localStorage.customWritableDir) {
            if (!(await mod.checkWritable(localStorage.customWritableDir))) {
                throw new Error(`Custom data folder ${localStorage.customWritableDir} is read-only`);
            }
            return localStorage.customWritableDir;
        }
        const path = require('path');

        const exec = path.dirname(window.NL_CWD).replace(/\\/g, '/');
        // The `HOME` variable is not always available in ct.js on Windows
        // eslint-disable-next-line no-process-env
        const home = process.env.HOME || ((process.env.HOMEDRIVE || '') + process.env.HOMEPATH);

        const execWritable = mod.checkWritable(exec);
        const homeWritable = mod.checkWritable(home);
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
            if (await mod.checkWritable(ctFolder)) {
                return ctFolder;
            }
            throw new Error(`The ct.js folder ${ctFolder} is read-only, though its parent isn't. Check your access rights on this folder`);
        }
        if (!execWritable) {
            throw new Error(`Could not write to folders ${home} and ${exec}. A folder is needed to create builds and run debugger. Check access rights to these folders, and tweak sandbox settings if it is used.`);
        }
        return exec;
    },
    async getTempDir(): Promise<{dir: string, remove: () => void}> {
        const tempdir = await os.getPath('temp');
        const dir = await fs.mkdtemp(path.join(tempdir, 'ctjs-'));
        return {
            dir,
            remove() {
                return fs.remove(dir);
            }
        };
    },
    requestWritableDir: async (): Promise<boolean> => {
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
    },
    getGalleryDir(createHref?: boolean): string {
        const path = require('path');
        try {
            // Okay, we are in a dev mode
            require('gulp');
            if (createHref) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return ('file://' + path.join(path.posix.normalize(window.NL_CWD), 'bundledAssets'));
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return path.join(window.NL_CWD, 'bundledAssets');
        } catch {
            if (createHref) {
                if (isMac) {
                    return 'file://' + path.posix.normalize(path.join(window.NL_CWD, 'bundledAssets'));
                }
                return ('file://' + path.posix.normalize(path.join(path.dirname(process.execPath), 'package.nw', 'bundledAssets')));
            }
            if (isMac) {
                return path.join(window.NL_CWD, 'bundledAssets');
            }
            return path.join(path.dirname(process.execPath), 'package.nw', 'bundledAssets');
        }
    },
    getProjectsDir(): Promise<string> {
        if (projectsDir) {
            return Promise.resolve(projectsDir);
        }
        if (projectsDirPromise) {
            return projectsDirPromise;
        }
        projectsDirPromise = mod.getWritableDir().then(async (ctjsDir: string) => {
            const dir = require('path').join(ctjsDir, 'Projects');
            await fs.ensureDir(dir);
            projectsDir = dir;
            return projectsDir;
        });
        return projectsDirPromise;
    },
    getBuildDir(): Promise<string> {
        if (buildDir) {
            return Promise.resolve(buildDir);
        }
        if (buildDirPromise) {
            return buildDirPromise;
        }
        buildDirPromise = mod.getWritableDir().then(async (ctjsDir: string) => {
            const dir = require('path').join(ctjsDir, 'Builds');
            await fs.ensureDir(dir);
            buildDir = dir;
            return buildDir;
        });
        return buildDirPromise;
    },
    getExportDir(): Promise<string> {
        if (exportDir) {
            return Promise.resolve(exportDir);
        }
        if (exportDirPromise) {
            return exportDirPromise;
        }
        exportDirPromise = mod.getWritableDir().then(async ctjsDir => {
            const dir = require('path').join(ctjsDir, 'Exported');
            await fs.ensureDir(dir);
            exportDir = dir;
            return exportDir;
        });
        return exportDirPromise;
    }
};
export default mod;
