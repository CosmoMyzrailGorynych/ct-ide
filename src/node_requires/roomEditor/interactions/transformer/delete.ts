import {IRoomEditorInteraction} from '..';

export const deleteSelected: IRoomEditorInteraction<void> = {
    ifListener: 'delete',
    if() {
        return this.riotEditor.currentTool === 'select' && this.currentSelection.size > 0;
    },
    listeners: {
        delete(e: KeyboardEvent, riotEditor, affixedData, callback) {
            this.deleteSelected();
            callback();
        }
    }
};
