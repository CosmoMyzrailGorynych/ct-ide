/* eslint-disable no-process-env */
/* eslint-disable no-console */

try {
    const fs = require('fs').promises;
    const path = require('path');

    // The `HOME` variable is not always available in ct.js on Windows
    const home = process.env.HOME || ((process.env.HOMEDRIVE || '') + process.env.HOMEPATH);

    const getPath = dest => (path.isAbsolute(dest)? dest : path.join(home, dest));
    const ensureParents = async dest => {
        const parents = path.dirname(getPath(dest));
        await fs.mkdir(getPath(parents), {
            recursive: true
        });
    };

    ct.fs = {
        isDesktop: true,
        gameFolder: path.join(home, ct.meta.author || '', ct.meta.name || 'Ct.js game'),

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
        async copy(filename, dest) {
            if (!(await ct.file.exists(filename))) {
                throw new Error(`File ${filename} does not exist`);
            }
            if (filename === dest) {
                return; // nothing to do here
            }
            ensureParents(dest);
            await fs.copyFile(getPath(filename), getPath(dest));
        },
        async move(filename, dest) {
            await ct.fs.copy(getPath(filename), getPath(dest));
        }
    };
} catch (e) {
    console.warn('[ct.fs] File system is not available! Make sure you have fallbacks for localStorage to save your game state.');
    console.warn(e);
    ct.fs = {
        isDesktop: false,
        gameFolder: null
    };
}
