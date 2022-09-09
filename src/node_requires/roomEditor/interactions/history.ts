import {IRoomEditorInteraction} from '..';

export const undo: IRoomEditorInteraction<void> = {
    ifListener: 'undo',
    if() {
        // History object has its internal checks,
        // and this is the only interaction that uses this listener,
        // so always returning true is okay.
        return true;
    },
    listeners: {
        undo(e, roomTag, affixedData, callback) {
            if (this.history.undo()) {
                e.data.originalEvent.preventDefault();
            }
            callback();
        }
    }
};

export const redo: IRoomEditorInteraction<void> = {
    ifListener: 'redo',
    if() {
        // History object has its internal checks,
        // and this is the only interaction that uses this listener,
        // so always returning true is okay.
        return true;
    },
    listeners: {
        redo(e, roomTag, affixedData, callback) {
            if (this.history.redo()) {
                e.data.originalEvent.preventDefault();
            }
            callback();
        }
    }
};
