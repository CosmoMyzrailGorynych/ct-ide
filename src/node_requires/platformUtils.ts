import fs from 'fs-extra';
import {getLanguageJSON} from './i18n';
import os from 'os';
import path from 'path';

const isWin = (/win[0-9]+/).test(os.platform());
const isLinux = os.platform() === 'linux';
const isMac = !(isWin || isLinux);

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

    /**
     * Checks whether a given directory is writable
     *
     * @param {String} way A path to check against
     * @returns {Promise<Boolean>} Resolves into either `true` (if writable) or `false`
     */
    checkWritable(way: string): Promise<boolean> {
        return new Promise(resolve => {
            // eslint-disable-next-line no-bitwise
            fs.access(way, fs.constants.R_OK | fs.constants.W_OK, (err: Error) => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
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

        const exec = path.dirname(process.cwd()).replace(/\\/g, '/');
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
        if (homeWritable) {
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
        const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'ctjs-'));
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
        });
        const fs = require('fs-extra');
        try {
            const lstat = await fs.lstat(folder);
            if (!lstat.isDirectory()) {
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
                return ('file://' + path.posix.normalize(path.join((nw.App as any).startPath, 'bundledAssets')));
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return path.join((nw.App as any).startPath, 'bundledAssets');
        } catch {
            if (createHref) {
                return ('file://' + path.posix.normalize(path.join(path.dirname(process.execPath), 'bundledAssets')));
            }
            return path.join(path.dirname(process.execPath), 'bundledAssets');
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
export = mod;
