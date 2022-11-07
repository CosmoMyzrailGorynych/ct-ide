import {IRoomEditorInteraction} from '../..';

export const copy: IRoomEditorInteraction<void> = {
    ifListener: 'copy',
    if() {
        return this.riotEditor.currentTool === 'select' && this.currentSelection.size > 0;
    },
    listeners: {
        copy(e, riotEditor, affixedData, callback) {
            this.copySelection();
            callback();
        }
    }
};

export const paste: IRoomEditorInteraction<void> = {
    ifListener: 'paste',
    if() {
        return this.clipboard.size > 0;
    },
    listeners: {
        paste(e, riotEditor, affixedData, callback) {
            this.pasteSelection();
            callback();
        }
    }
};
