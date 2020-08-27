/* eslint-disable no-process-env */
/* eslint-disable no-console */

try {
    // This will fail when in a browser so no browser checking required
    const fs = require('fs').promises;
    const path = require('path');

    // Like an enum, but not.
    const operatingSystems = {
        Windows: 'win',
        macOS: 'mac',
        ChromeOS: 'cros',
        Linux: 'linux',
        iOS: 'ios',
        Android: 'android'
    };

    // The `HOME` variable is not always available in ct.js on Windows
    const home = process.env.HOME || ((process.env.HOMEDRIVE || '') + process.env.HOMEPATH);

    // Borrowed from keyboard.polyfill
    const contains = function contains(s, ss) {
        return String(s).indexOf(ss) !== -1;
    };

    const operatingSystem = (function getOperatingSystem() {
        if (contains(navigator.platform, 'Win')) {
            return operatingSystems.Windows;
        }
        if (contains(navigator.platform, 'Mac')) {
            return operatingSystems.macOS;
        }
        if (contains(navigator.platform, 'CrOS')) {
            return operatingSystems.ChromeOS;
        }
        if (contains(navigator.platform, 'Linux')) {
            return operatingSystems.Linux;
        }
        if (contains(navigator.userAgent, 'iPad') || contains(navigator.platform, 'iPod') || contains(navigator.platform, 'iPhone')) {
            return operatingSystems.iOS;
        }
        return '';
    }());


    const getAppData = (home, operatingSystem) => {
        switch (operatingSystem) {
        case operatingSystems.Windows:
            return process.env.AppData;
        case operatingSystems.macOS:
            return `${home}/Library/Application Support`;
        case operatingSystems.Linux:
            return process.env.XDG_DATA_HOME || `${home}/.local/share`;
            // Don't know what to do for ChromeOS or iOS, do they use AppData or
            // Should those default to LocalStorage?
        default:
            return home;
        }
    };

    const appData = getAppData(home, operatingSystem);

    const getPath = dest => {
        const absoluteDest = path.isAbsolute(dest) ? dest : path.join(ct.fs.gameFolder, dest);
        if (ct.fs.forceLocal) {
            if (absoluteDest.indexOf(ct.fs.gameFolder) !== 0) {
                throw new Error('[ct.fs] Operations outside the save directory are not permitted by default due to safety concerns. If you do need to work outside the save directory, change `ct.fs.forceLocal` to `false`. ' +
                    `The save directory: "${ct.fs.gameFolder}", the target directory: "${dest}", which resolves into "${absoluteDest}".`);
            }
        }
        return absoluteDest;
    };
    const ensureParents = async dest => {
        const parents = path.dirname(getPath(dest));
        await fs.mkdir(getPath(parents), {
            recursive: true
        });
    };


    ct.fs = {
        isAvailable: true,
        gameFolder: path.join(appData, ct.meta.author || '', ct.meta.name || 'Ct.js game'),
        forceLocal: true,

        async save(filename, jsonData) {
            await ensureParents(filename);
            await fs.writeFile(getPath(filename), JSON.stringify(jsonData), 'utf8');
            return void 0;
        },
        async load(filename) {
            const textData = await fs.readFile(getPath(filename), 'utf8');
            return JSON.parse(textData);
        },
        async saveText(filename, text) {
            if (!text && text !== '') {
                throw new Error('[ct.fs] Attempt to call saveText(filename, text) without `text` being set.');
            }
            await ensureParents(filename);
            await fs.writeFile(getPath(filename), text.toString(), 'utf8');
            return void 0;
        },
        loadText(filename) {
            return fs.readFile(getPath(filename), 'utf8');
        },
        makeDir(path) {
            return fs.mkdir(getPath(path), {
                recursive: true
            });
        },

        delete(filename) {
            return fs.unlink(getPath(filename));
        },
        deleteDir(path) {
            return fs.rmdir(getPath(path), {
                recursive: true,
                maxRetries: 10,
                retryDelay: 100
            });
        },
        async copy(filename, dest) {
            if (!(await ct.fs.exists(filename))) {
                throw new Error(`File ${filename} does not exist`);
            }
            if (getPath(filename) === getPath(dest)) {
                return; // nothing to do here
            }
            ensureParents(dest);
            await fs.copyFile(getPath(filename), getPath(dest));
        },
        async move(filename, dest) {
            await ct.fs.copy(getPath(filename), getPath(dest));
            if (getPath(filename) !== getPath(dest)) {
                await ct.fs.delete(getPath(filename));
            }
        },

        listFiles(directory) {
            directory = directory || '.';
            return fs.readdir(getPath(directory));
        },
        stat(filename) {
            return fs.stat(getPath(filename));
        },

        getPath
    };

    ct.fs.rename = ct.fs.move;
    ct.fs.exists = ct.fs.stat;
} catch (e) {
    console.warn('[ct.fs] File system is not available! Make sure you have fallbacks for localStorage to save your game state.');
    console.warn(e);
    ct.fs = {
        isAvailable: false,
        gameFolder: null
    };
}
