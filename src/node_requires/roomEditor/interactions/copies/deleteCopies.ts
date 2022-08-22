import {IRoomEditorInteraction} from '../..';
import {Copy} from '../../entityClasses/Copy';

type affixedData = {
    deleted: Set<[Copy]>;
}

export const deleteCopies: IRoomEditorInteraction<affixedData> = {
    ifListener: 'pointerdown',
    if(e) {
        if (this.riotEditor.currentTool !== 'addCopies') {
            return false;
        }
        return e.data.button === 0 && e.data.originalEvent.ctrlKey;
    },
    listeners: {
        pointerdown(e, riotTag, affixedData) {
            affixedData.deleted = new Set();
            if (e.target instanceof Copy) {
                affixedData.deleted.add([e.target.detach()]);
            }
        },
        pointermove(e, riotTag, affixedData) {
            if (e.target instanceof Copy) {
                affixedData.deleted.add([e.target.detach()]);
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

deleteCopies.listeners.pointerupoutside = deleteCopies.listeners.pointerup;
