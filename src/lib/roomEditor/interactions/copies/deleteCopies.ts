import {IRoomEditorInteraction} from '../..';
import {Copy} from '../../entityClasses/Copy';

import * as PIXI from 'pixi.js';

type affixedData = {
    deleted: Set<[Copy]>;
}

export const deleteCopies: IRoomEditorInteraction<affixedData> = {
    ifListener: 'pointerdown',
    if(e: PIXI.FederatedPointerEvent) {
        if (this.riotEditor.currentTool !== 'addCopies') {
            return false;
        }
        return e.button === 0 && (e.ctrlKey || e.metaKey) && !e.shiftKey;
    },
    listeners: {
        pointerdown(e: PIXI.FederatedPointerEvent, riotTag, affixedData) {
            affixedData.deleted = new Set();
            if (e.target instanceof Copy) {
                affixedData.deleted.add([e.target.detach()]);
            }
        },
        pointermove(e: PIXI.FederatedPointerEvent, riotTag, affixedData) {
            this.cursor.update(e);
            if (e.target instanceof Copy) {
                affixedData.deleted.add([e.target.detach()]);
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

deleteCopies.listeners.pointerupoutside = deleteCopies.listeners.pointerup;
