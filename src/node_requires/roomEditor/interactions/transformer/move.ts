import {IRoomEditorInteraction} from '../..';
import {snapToRectangularGrid, snapToDiagonalGrid} from '../../common';

interface IAffixedData {
    startingGlobalPos: PIXI.Point;
    startingTranslateX: number;
    startingTranslateY: number;
    startingPivotX: number;
    startingPivotY: number;
}

export const moveSelection: IRoomEditorInteraction<IAffixedData> = {
    ifListener: 'pointerdown',
    if(e) {
        if (this.riotEditor.currentTool !== 'select') {
            return false;
        }
        if (this.currentSelection.size === 0) {
            return false;
        }
        return e.target === this.transformer.handleCenter;
    },
    listeners: {
        pointerdown(e, roomTag, affixed) {
            affixed.startingGlobalPos = e.data.global.clone();
            affixed.startingTranslateX = this.transformer.applyTranslateX;
            affixed.startingTranslateY = this.transformer.applyTranslateY;
            affixed.startingPivotX = this.transformer.transformPivotX;
            affixed.startingPivotY = this.transformer.transformPivotY;
        },
        pointermove(e, roomTag, affixed) {
            let delta = {
                x: (e.data.global.x - affixed.startingGlobalPos.x) * this.camera.scale.x,
                y: (e.data.global.y - affixed.startingGlobalPos.y) * this.camera.scale.x
            };
            // Ignore grid when alt key is pressed, or when the grid is disabled
            if (!e.data.originalEvent.altKey && roomTag.gridOn) {
                // Otherwise, snap delta to a grid
                if (this.ctRoom.diagonalGrid) {
                    delta = snapToDiagonalGrid(delta, this.ctRoom.gridX, this.ctRoom.gridY);
                } else {
                    delta = snapToRectangularGrid(delta, this.ctRoom.gridX, this.ctRoom.gridY);
                }
            }
            this.transformer.applyTranslateX = affixed.startingTranslateX + delta.x;
            this.transformer.applyTranslateY = affixed.startingTranslateY + delta.y;
            this.transformer.transformPivotX = affixed.startingPivotX + delta.x;
            this.transformer.transformPivotY = affixed.startingPivotY + delta.y;
            this.transformer.applyTransforms();
            this.riotEditor.refs.propertiesPanel.updatePropList();
        },
        pointerup(e, roomTag, affixedData, callback) {
            this.dropPrecision();
            this.riotEditor.refs.propertiesPanel.updatePropList();
            this.history.snapshotTransforms();
            callback();
        }
    }
};
