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
            const changes = new Set<[Copy | Tile, TileLayer?]>();
            for (const stuff of this.currentSelection) {
                if (stuff instanceof Tile) {
                    const {parent} = stuff;
                    changes.add([stuff.detach(), parent]);
                } else if (stuff instanceof Copy) {
                    changes.add([stuff.detach()]);
                }
            }
            this.history.pushChange({
                type: 'deletion',
                deleted: changes
            });
            this.transformer.clear();
            riotEditor.refs.propertiesPanel.updatePropList();

            callback();
        }
    }
};
