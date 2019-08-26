/**
 * `glob` is a shared object for storing textures, handy mappings and global state.
 */

let modified = false;

const glob = {
    get modified() {
        return modified;
    },
    set modified(v) {
        if (v) {
            window.title = 'ctjs — ' + sessionStorage.projname + ' •';
        } else {
            window.title = 'ctjs — ' + sessionStorage.projname;
        }
        modified = v;
        return modified;
    }
};

module.exports = glob;
