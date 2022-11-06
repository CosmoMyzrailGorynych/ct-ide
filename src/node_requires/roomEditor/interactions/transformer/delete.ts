import {IRoomEditorInteraction} from '..';
import {Copy} from '../../entityClasses/Copy';
import {Tile} from '../../entityClasses/Tile';
import {TileLayer} from '../../entityClasses/TileLayer';

export const deleteSelected: IRoomEditorInteraction<void> = {
    ifListener: 'delete',
    if() {
        return this.riotEditor.currentTool === 'select' && this.currentSelection.size > 0;
    },
    listeners: {
        delete(e, riotEditor, affixedData, callback) {
            this.deleteSelected();
            callback();
        }
    }
};
