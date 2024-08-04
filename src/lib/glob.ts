let modified = false;

export const glob = {
    get modified(): boolean {
        return modified;
    },
    set modified(v: boolean) {
        if (window.currentProject) {
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
