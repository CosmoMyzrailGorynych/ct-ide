import {IRoomEditorInteraction} from '../..';
import {Tile} from '../../entityClasses/Tile';
import {TileLayer} from '../../entityClasses/TileLayer';

import * as PIXI from 'pixi.js';

type affixedData = {
    deleted: Set<[Tile, TileLayer]>;
}

export const deleteTiles: IRoomEditorInteraction<affixedData> = {
    ifListener: 'pointerdown',
    if(e: PIXI.FederatedPointerEvent) {
        if (this.riotEditor.currentTool !== 'addTiles' || !this.riotEditor.currentTileLayer) {
            return false;
        }
        return e.button === 0 && (e.ctrlKey || e.metaKey);
    },
    listeners: {
        pointerdown(e: PIXI.FederatedPointerEvent, riotTag, affixedData) {
            affixedData.deleted = new Set();
            if (e.target instanceof Tile && e.target.parent === riotTag.currentTileLayer) {
                const {parent} = e.target;
                affixedData.deleted.add([e.target.detach(), parent as TileLayer]);
            }
        },
        pointermove(e: PIXI.FederatedPointerEvent, riotTag, affixedData) {
            this.cursor.update(e);
            if (e.target instanceof Tile && e.target.parent === riotTag.currentTileLayer) {
                const {parent} = e.target;
                affixedData.deleted.add([e.target.detach(), parent as TileLayer]);
            }
        },
        pointerup(e: PIXI.FederatedPointerEvent, roomTag, affixedData, callback) {
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
