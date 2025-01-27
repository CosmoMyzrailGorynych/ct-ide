import {getProjectCodename, getCurrentProject} from './resources/projects';

let modified = false;

export const glob = {
    get modified(): boolean {
        return modified;
    },
    set modified(v: boolean) {
        if (getCurrentProject()) {
            if (v) {
                document.title = 'ct.js — ' + getProjectCodename() + ' •';
            } else {
                document.title = 'ct.js — ' + getProjectCodename();
            }
        } else {
            document.title = 'ct.js';
        }
        modified = v;
    },
    moduleTypings: {}
};
export default glob;
