let modified = false;

/**
 * `glob` is a shared object for storing textures, handy mappings and global state.
 */
const glob = {
    get modified() {
        return modified;
    },
    set modified(v) {
        if (global.currentProject) {
            if (v) {
                document.title = 'ct.js — ' + sessionStorage.projname + ' •';
            } else {
                document.title = 'ct.js — ' + sessionStorage.projname;
            }
        } else {
            document.title = 'ct.js';
        }
        modified = v;
        return modified;
    },
    moduleTypings: {}
};

module.exports = glob;
