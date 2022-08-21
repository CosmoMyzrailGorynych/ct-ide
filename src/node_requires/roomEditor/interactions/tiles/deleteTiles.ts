import {IRoomEditorInteraction} from '../..';
import {Tile} from '../../entityClasses/Tile';
import {TileLayer} from '../../entityClasses/TileLayer';

type affixedData = {
    deleted: Set<[Tile, TileLayer]>;
}

export const deleteTiles: IRoomEditorInteraction<affixedData> = {
    ifListener: 'pointerdown',
    if(e) {
        if (this.riotEditor.currentTool !== 'addTiles' || !this.riotEditor.currentTileLayer) {
            return false;
        }
        return e.data.button === 0 && e.data.originalEvent.ctrlKey;
    },
    listeners: {
        pointerdown(e, riotTag, affixedData) {
            affixedData.deleted = new Set();
            if (e.target instanceof Tile && e.target.parent === riotTag.currentTileLayer) {
                const {parent} = e.target;
                affixedData.deleted.add([e.target.detach(), parent]);
            }
        },
        pointermove(e, riotTag, affixedData) {
            if (e.target instanceof Tile && e.target.parent === riotTag.currentTileLayer) {
                const {parent} = e.target;
                affixedData.deleted.add([e.target.detach(), parent]);
            }
        },
        pointerup(e, roomTag, affixedData, callback) {
            if (affixedData.deleted.size) {
                this.history.pushChange({
                    type: 'deletion',
                    deleted: affixedData.deleted
                });
            }
            callback();
        }
    }
};

deleteTiles.listeners.pointerupoutside = deleteTiles.listeners.pointerup;
