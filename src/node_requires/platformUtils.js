const fs = require('fs-extra');
const os = require('os');

const isWin = (/win[0-9]+/).test(os.platform());
const isLinux = os.platform() === 'linux';
const isMac = !(isWin || isLinux);

const mod = {
    isWin,
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
            if (isMac || !(execWritable)) {
                if (!homeWritable) {
                    reject(new Error(`Could not write to folders ${home} and ${exec}.`));
                } else {
                    fs.ensureDir(path.join(home, 'ct.js'))
                    .then(() => {
                        resolve(path.join(home, 'ct.js'));
                    })
                    .catch(reject);
                }
            } else {
                resolve(exec);
            }
        });
    }
};
module.exports = mod;
