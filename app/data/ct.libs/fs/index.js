/* eslint-disable no-process-env */
/* eslint-disable no-console */

try {
    const fs = require('fs').promises;
    const path = require('path');

    // The `HOME` variable is not always available in ct.js on Windows
    const home = process.env.HOME || ((process.env.HOMEDRIVE || '') + process.env.HOMEPATH);

    const getPath = dest => {
        const d = path.isAbsolute(dest)? dest : path.join(home, dest);
        if (ct.fs.forceLocal) {
            if (d.indexOf(home) !== 0) {
                throw new Error('[ct.fs] Operations outside the save directory are not permitted by default due to safety concerns. If you do need to work outside the save directory, change `ct.fs.forceLocal` to `false`.' +
                    `The save directory: ${ct.fs.home}, the target directory: ${dest}, which resolves into ${d}.`);
            }
        }
        return d;
    };
    const ensureParents = async dest => {
        const parents = path.dirname(getPath(dest));
        await fs.mkdir(getPath(parents), {
            recursive: true
        });
    };

    ct.fs = {
        isDesktop: true,
        gameFolder: path.join(home, ct.meta.author || '', ct.meta.name || 'Ct.js game'),
        forceLocal: true,

        async save(filename, data) {
            await ensureParents(filename);
            await fs.writeFile(getPath(filename), JSON.stringify(data), 'utf8');
            return void 0;
        },
        async load(filename) {
            const data = await fs.readFile(getPath(filename), 'utf8');
            return JSON.parse(data);
        },
        async saveText(filename, text) {
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
            if (!(await ct.file.exists(filename))) {
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
        isDesktop: false,
        gameFolder: null
    };
}
