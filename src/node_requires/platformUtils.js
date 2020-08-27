const fs = require('fs-extra');
const os = require('os');

const isWin = (/win[0-9]+/).test(os.platform());
const isLinux = os.platform() === 'linux';
const isMac = !(isWin || isLinux);

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
    checkWritable(way) {
        return new Promise(resolve => {
            // eslint-disable-next-line no-bitwise
            fs.access(way, fs.constants.R_OK | fs.constants.W_OK, err => {
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
    async getWritableDir() {
        const path = require('path');

        const exec = path.dirname(process.cwd()).replace(/\\/g, '/');
        // The `HOME` variable is not always available in ct.js on Windows
        const home = process.env.HOME || ((process.env.HOMEDRIVE || '') + process.env.HOMEPATH);

        const execWritable = mod.checkWritable(exec);
        const homeWritable = mod.checkWritable(home);
        await execWritable; // Run in parallel
        await homeWritable;
        return new Promise((resolve, reject) => {
            // writing to an exec path on Mac is not a good idea,
            // as it will be hidden inside an app's directory, which is shown as one file.
            if (isMac && !homeWritable) {
                reject(new Error(`Could not write to folder ${home}. It is needed to create builds and run debugger. Check rights to these folders, and tweak sandbox settings if it is used.`));
                return;
            }
            // Home directory takes priority
            if (homeWritable) {
                fs.ensureDir(path.join(home, 'ct.js'))
                .then(() => {
                    resolve(path.join(home, 'ct.js'));
                })
                .catch(reject);
            } else {
                if (!execWritable) {
                    reject(new Error(`Could not write to folders ${home} and ${exec}. A folder is needed to create builds and run debugger. Check access rights to these folders, and tweak sandbox settings if it is used.`));
                    return;
                }
                resolve(exec);
            }
        });
    }
};

{
    let exportDir,
        exportDirPromise,
        buildDir,
        buildDirPromise,
        projectsDir,
        projectsDirPromise;
    // We compute a directory once and store it forever
    mod.getExportDir = () => {
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
    };
    mod.getBuildDir = () => {
        if (buildDir) {
            return Promise.resolve(buildDir);
        }
        if (buildDirPromise) {
            return buildDirPromise;
        }
        buildDirPromise = mod.getWritableDir().then(async ctjsDir => {
            const dir = require('path').join(ctjsDir, 'Builds');
            await fs.ensureDir(dir);
            buildDir = dir;
            return buildDir;
        });
        return buildDirPromise;
    };
    mod.getProjectsDir = () => {
        if (projectsDir) {
            return Promise.resolve(projectsDir);
        }
        if (projectsDirPromise) {
            return projectsDirPromise;
        }
        projectsDirPromise = mod.getWritableDir().then(async ctjsDir => {
            const dir = require('path').join(ctjsDir, 'Projects');
            await fs.ensureDir(dir);
            projectsDir = dir;
            return projectsDir;
        });
        return projectsDirPromise;
    };
}

module.exports = mod;
