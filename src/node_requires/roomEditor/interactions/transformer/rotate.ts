import * as PIXI from 'pixi.js';

import {IRoomEditorInteraction} from '../..';

import {pdn, degToRad, radToDeg} from '../../../utils/trigo';

export const rotateSelection: IRoomEditorInteraction<void> = {
    ifListener: 'pointerdown',
    if(e: PIXI.FederatedPointerEvent) {
        if (this.riotEditor.currentTool !== 'select') {
            return false;
        }
        if (this.currentSelection.size === 0) {
            return false;
        }
        return e.target === this.transformer.handleRotate;
    },
    listeners: {
        globalpointermove(e: PIXI.FederatedPointerEvent) {
            this.cursor.update(e);
            const globalPivot = this.room.toGlobal(new PIXI.Point(
                this.transformer.transformPivotX,
                this.transformer.transformPivotY
            ));
            let rad = pdn(
                globalPivot.x,
                globalPivot.y,
                e.global.x,
                e.global.y
            );
            // When the group is mirrored horizontally,
            // the handle appears on the left side, not on the right side.
            if (this.transformer.applyScaleX < 0) {
                rad += Math.PI;
            }
            if (e.shiftKey) {
                // Snap at 15 degrees
                rad = degToRad(Math.round(radToDeg(rad) / 15) * 15);
            }
            this.transformer.applyRotation = rad;
            this.transformer.applyTransforms();
            if (this.riotEditor.refs.propertiesPanel) {
                this.riotEditor.refs.propertiesPanel.updatePropList();
            }
        },
        pointerup(e: PIXI.FederatedPointerEvent, roomTag, affixedData, callback) {
            this.dropPrecision();
            if (this.riotEditor.refs.propertiesPanel) {
                this.riotEditor.refs.propertiesPanel.updatePropList();
            }
            this.history.snapshotTransforms();
            callback();
        }
    }
};
