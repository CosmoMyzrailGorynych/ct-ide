let modified = false;

/**
 * `glob` is a shared object for storing handy mappings and global state.
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
    },
    moduleTypings: {}
};

module.exports = glob;
