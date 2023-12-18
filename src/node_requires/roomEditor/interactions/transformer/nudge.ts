import {IRoomEditorInteraction} from '..';

export const nudgeDown: IRoomEditorInteraction<void> = {
    ifListener: 'nudgedown',
    if() {
        return Boolean(this.riotEditor.currentTool === 'select' && this.currentSelection.size);
    },
    listeners: {
        nudgedown(e: KeyboardEvent, roomTag, affixedData, callback) {
            const delta = e.ctrlKey ? 1 : this.ctRoom.gridY;
            this.transformer.applyTranslateY += delta;
            this.transformer.transformPivotY += delta;
            this.transformer.applyTransforms();
            callback();
        }
    }
};

export const nudgeUp: IRoomEditorInteraction<void> = {
    ifListener: 'nudgeup',
    if() {
        return Boolean(this.riotEditor.currentTool === 'select' && this.currentSelection.size);
    },
    listeners: {
        nudgeup(e: KeyboardEvent, roomTag, affixedData, callback) {
            const delta = e.ctrlKey ? 1 : this.ctRoom.gridY;
            this.transformer.applyTranslateY -= delta;
            this.transformer.transformPivotY -= delta;
            this.transformer.applyTransforms();
            callback();
        }
    }
};

export const nudgeLeft: IRoomEditorInteraction<void> = {
    ifListener: 'nudgeleft',
    if() {
        return Boolean(this.riotEditor.currentTool === 'select' && this.currentSelection.size);
    },
    listeners: {
        nudgeleft(e: KeyboardEvent, roomTag, affixedData, callback) {
            const delta = e.ctrlKey ? 1 : this.ctRoom.gridX;
            this.transformer.applyTranslateX -= delta;
            this.transformer.transformPivotX -= delta;
            this.transformer.applyTransforms();
            callback();
        }
    }
};

export const nudgeRight: IRoomEditorInteraction<void> = {
    ifListener: 'nudgeright',
    if() {
        return Boolean(this.riotEditor.currentTool === 'select' && this.currentSelection.size);
    },
    listeners: {
        nudgeright(e: KeyboardEvent, roomTag, affixedData, callback) {
            const delta = e.ctrlKey ? 1 : this.ctRoom.gridX;
            this.transformer.applyTranslateX += delta;
            this.transformer.transformPivotX += delta;
            this.transformer.applyTransforms();
            this.history.snapshotTransforms();
            callback();
        }
    }
};
