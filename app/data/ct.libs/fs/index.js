/* eslint-disable no-use-before-define */
/* eslint-disable max-depth */
/* eslint-disable no-process-env */

const isNode = (() => {
    try {
        require('fs');
        return true;
    } catch (oO) {
        return false;
    }
})();

const assertPath = (path) => {
    if (typeof path !== 'string') {
        throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
    }
};

// Resolves . and .. elements in a path with directory names
// eslint-disable-next-line complexity
const normalize = (path) => {
    assertPath(path);
    if (path.length === 0) {
        return '.';
    }
    path = path.replace(/\\/g, '/').replace(/\/+/g, '/');
    let prevPath = path;
    path = path.replace(/(\/[^/]+\/(\.\.))/g, '');
    while (prevPath !== path) {
        prevPath = path;
        path = path.replace(/(\/[^/]+\/(\.\.))/g, '');
    }
    path.replace(/\/\.(?=\/)/g, '');
    var isAbsolute = path.charCodeAt(0) === 47 || path.split('/')[0].slice(-1) === ':';
    if (path.length === 0 && !isAbsolute) {
        path = '.';
    }
    return path;
};
const neutralinoPathPolyfill = {
    isAbsolute(path) {
        assertPath(path);
        path = normalize(path);
        return path.length > 0 && (path.charCodeAt(0) === 47 || path.split('/')[0].slice(-1) === ':');
    },
    dirname(path) {
        assertPath(path);
        path = normalize(path);
        if (path.length === 0) {
            return '.';
        }
        var code = path.charCodeAt(0);
        var hasRoot = code === 47;
        var end = -1;
        var matchedSlash = true;
        for (var i = path.length - 1; i >= 1; --i) {
            code = path.charCodeAt(i);
            if (code === 47 /*/*/) {
                if (!matchedSlash) {
                    end = i;
                    break;
                }
            } else {
                // We saw the first non-path separator
                matchedSlash = false;
            }
        }

        if (end === -1) {
            return hasRoot ? '/' : '.';
        }
        if (hasRoot && end === 1) {
            return '//';
        }
        return path.slice(0, end);
    },
    join() {
        if (arguments.length === 0) {
            return '.';
        }
        var joined;
        for (var i = 0; i < arguments.length; ++i) {
            // eslint-disable-next-line prefer-rest-params
            var arg = arguments[i];
            assertPath(arg);
            if (arg.length > 0) {
                if (joined === void 0) {
                    joined = arg;
                } else {
                    joined += '/' + arg;
                }
            }
        }
        if (joined === void 0) {
            return '.';
        }
        return normalize(joined);
    }
};

const neutralinoFsPolyfill = {
    async mkdir(path, opts) {
        assertPath(path);
        path = normalize(path);
        if (!opts?.recursive) {
            await window.Neutralino.filesystem.createDirectory(path);
        }
        const segments = path.split('/');
        let i = 0;
        if (segments[0][segments[0].length - 1] === ':') {
            i++; // advance on Windows' drives
        }
        /* eslint-disable no-await-in-loop */
        for (; i < segments.length + 1; i++) {
            if (!await neutralinoFsPolyfill.exists(segments.slice(0, i).join('/'))) {
                await window.Neutralino.filesystem.createDirectory(segments.slice(0, i).join('/'));
            }
        }
        /* eslint-enable no-await-in-loop */
    },
    writeFile(path, text) {
        assertPath(path);
        path = normalize(path);
        return window.Neutralino.filesystem.writeFile(path, text);
    },
    readFile(path) {
        assertPath(path);
        path = normalize(path);
        return window.Neutralino.filesystem.readFile(path);
    },
    unlink(path) {
        assertPath(path);
        path = normalize(path);
        return window.Neutralino.filesystem.removeFile(path);
    },
    rmdir(path) {
        assertPath(path);
        path = normalize(path);
        return window.Neutralino.filesystem.removeDirectory(path);
    },
    copyFile(src, dest) {
        assertPath(src);
        assertPath(dest);
        src = normalize(src);
        dest = normalize(dest);
        return window.Neutralino.filesystem.copyFile(src, dest);
    },
    stat(path) {
        assertPath(path);
        path = normalize(path);
        return window.Neutralino.filesystem.getStats(path);
    },
    async exists(path) {
        try {
            await window.Neutralino.filesystem.getStats(path);
            return true;
        } catch {
            return false;
        }
    },
    readdir(path) {
        assertPath(path);
        path = normalize(path);
        return window.Neutralino.filesystem.readDirectory(path)
            .then(items => items
                .filter(item => item.type === 'FILE')
                .map(item => item.entry));
    }
};

try {
    let fsNative, path;
    // This will fail when in a browser so no browser checking required
    if (isNode) {
        fsNative = require('fs').promises;
        path = require('path');
    } else {
        fsNative = neutralinoFsPolyfill;
        path = neutralinoPathPolyfill;
    }

    // Like an enum, but not.
    const operatingSystems = {
        Windows: 'win',
        macOS: 'mac',
        ChromeOS: 'cros',
        Linux: 'linux',
        iOS: 'ios',
        Android: 'android'
    };


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


    const getAppData = async (operatingSystem) => {
        // The `HOME` variable is not always available in ct.js on Windows
        let env;
        if (isNode) {
            ({env} = process);
        } else {
            env = await window.Neutralino.os.getEnvs();
        }
        const home = env.HOME || ((env.HOMEDRIVE || '') + env.HOMEPATH);
        switch (operatingSystem) {
        case operatingSystems.Windows:
            return env.AppData ?? env.APPDATA;
        case operatingSystems.macOS:
            return `${home}/Library/Application Support`;
        case operatingSystems.Linux:
            return env.XDG_DATA_HOME || `${home}/.local/share`;
            // Don't know what to do for ChromeOS or iOS, do they use AppData or
            // Should those default to LocalStorage?
        default:
            return home;
        }
    };

    let appData = '.';
    getAppData(operatingSystem)
    .then(a => {
        appData = a;
    });

    const getPath = dest => {
        dest = normalize(dest);
        const absoluteDest = normalize(path.isAbsolute(dest) ?
            dest :
            path.join(fs.gameFolder, dest));
        if (fs.forceLocal) {
            if (absoluteDest.indexOf(fs.gameFolder) !== 0) {
                throw new Error('[fs] Operations outside the save directory are not permitted by default due to safety concerns. If you do need to work outside the save directory, change `fs.forceLocal` to `false`. ' +
                    `The save directory: "${fs.gameFolder}", the target item: "${dest}", which resolves into "${absoluteDest}".`);
            }
        }
        return absoluteDest;
    };
    const ensureParents = async dest => {
        const parents = path.dirname(getPath(dest));
        await fsNative.mkdir(getPath(parents), {
            recursive: true
        });
    };


    const fs = {
        isAvailable: true,
        forceLocal: true,
        get gameFolder() {
            return normalize(path.join(appData, meta.author || '', meta.name || 'Ct.js game'));
        },

        async save(filename, jsonData) {
            await ensureParents(filename);
            await fsNative.writeFile(getPath(filename), JSON.stringify(jsonData), 'utf8');
            return void 0;
        },
        async load(filename) {
            const textData = await fsNative.readFile(getPath(filename), 'utf8');
            return JSON.parse(textData);
        },
        async saveText(filename, text) {
            if (!text && text !== '') {
                throw new Error('[fs] Attempt to call saveText(filename, text) without `text` being set.');
            }
            await ensureParents(filename);
            await fsNative.writeFile(getPath(filename), text.toString(), 'utf8');
            return void 0;
        },
        loadText(filename) {
            return fsNative.readFile(getPath(filename), 'utf8');
        },
        makeDir(path) {
            return fsNative.mkdir(getPath(path), {
                recursive: true
            });
        },

        delete(filename) {
            return fsNative.unlink(getPath(filename));
        },
        deleteDir(path) {
            return fsNative.rmdir(getPath(path), {
                recursive: true,
                maxRetries: 10,
                retryDelay: 100
            });
        },
        async copy(filename, dest) {
            if (!(await fs.exists(filename))) {
                throw new Error(`File ${filename} does not exist`);
            }
            if (getPath(filename) === getPath(dest)) {
                return; // nothing to do here
            }
            ensureParents(dest);
            await fsNative.copyFile(getPath(filename), getPath(dest));
        },
        async move(filename, dest) {
            await fs.copy(getPath(filename), getPath(dest));
            if (getPath(filename) !== getPath(dest)) {
                await fs.delete(getPath(filename));
            }
        },

        listFiles(directory) {
            directory = directory || '.';
            return fsNative.readdir(getPath(directory));
        },
        stat(filename) {
            return fsNative.stat(getPath(filename));
        },
        exists(filename) {
            return fsNative.exists(getPath(filename));
        },
        getPath
    };

    fs.rename = fs.move;

    window.fs = fs;
} catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[fs] File system is not available! Make sure you have fallbacks for localStorage to save your game state.');
    // eslint-disable-next-line no-console
    console.warn(e);
    window.fs = {
        isAvailable: false,
        gameFolder: null
    };
}
