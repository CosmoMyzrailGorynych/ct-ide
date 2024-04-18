import * as PIXI from 'node_modules/pixi.js';

import {IRoomEditorInteraction} from '../..';
import {Handle} from '../../entityClasses/Transformer';

import {rotateRad} from '../../../utils/trigo';
import {snapToRectangularGrid, snapToDiagonalGrid} from '../../common';

interface IAffixedData {
    axes: 'x' | 'y' | 'xy';
    startingSX: number;
    startingSY: number;
    startingTX: number;
    startingTY: number;
    startingPX: number;
    startingPY: number;
    startDragRoom: PIXI.IPoint;
}

export const scaleSelection: IRoomEditorInteraction<IAffixedData> = {
    ifListener: 'pointerdown',
    if(e: PIXI.FederatedPointerEvent) {
        if (this.riotEditor.currentTool !== 'select') {
            return false;
        }
        if (this.currentSelection.size === 0) {
            return false;
        }
        return this.transformer.scaleHandles.includes(e.target as Handle);
    },
    listeners: {
        pointerdown(e: PIXI.FederatedPointerEvent, roomTag, affixedData) {
            // Fix scaling to zero
            affixedData.startingSX = this.transformer.applyScaleX || 1;
            affixedData.startingSY = this.transformer.applyScaleY || 1;
            affixedData.startingTX = this.transformer.applyTranslateX;
            affixedData.startingTY = this.transformer.applyTranslateY;
            affixedData.startingPX = this.transformer.transformPivotX;
            affixedData.startingPY = this.transformer.transformPivotY;
            affixedData.startDragRoom =
                this.room.toLocal((e.target as PIXI.DisplayObject).position);
            const t = this.transformer;
            if ([t.handleBL, t.handleBR, t.handleTL, t.handleTR].includes(e.target as Handle)) {
                affixedData.axes = 'xy';
            } else if ([t.handleR, t.handleL].includes(e.target as Handle)) {
                affixedData.axes = 'x';
            } else {
                affixedData.axes = 'y';
            }
        },
        // eslint-disable-next-line max-lines-per-function, complexity
        globalpointermove(e: PIXI.FederatedPointerEvent, riotTag, affixedData) {
            this.cursor.update(e);
            const {transformer} = this;
            const scaleSymmetrically = e.ctrlKey;
            const proportionalScale = e.shiftKey && affixedData.axes === 'xy';
            const snapToGrid = !e.altKey && riotTag.gridOn;
            const {axes} = affixedData;
            const dragEndRoom = this.room.toLocal(e.data.global);
            if (snapToGrid) {
                if (this.ctRoom.diagonalGrid) {
                    ({x: dragEndRoom.x, y: dragEndRoom.y} = snapToDiagonalGrid(
                        dragEndRoom,
                        this.ctRoom.gridX,
                        this.ctRoom.gridY
                    ));
                } else {
                    ({x: dragEndRoom.x, y: dragEndRoom.y} = snapToRectangularGrid(
                        dragEndRoom,
                        this.ctRoom.gridX,
                        this.ctRoom.gridY
                    ));
                }
            }

            const startUnrotated = rotateRad(
                affixedData.startDragRoom.x - affixedData.startingPX,
                affixedData.startDragRoom.y - affixedData.startingPY,
                -transformer.applyRotation
            );
            const endUnrotated = rotateRad(
                dragEndRoom.x - affixedData.startingPX,
                dragEndRoom.y - affixedData.startingPY,
                -transformer.applyRotation
            );
            // kx and ky describe how much a container expanded relative to its starting width
            let kx = endUnrotated[0] / startUnrotated[0],
                ky = endUnrotated[1] / startUnrotated[1];
            if (!Number.isFinite(kx)) {
                kx = 1;
            }
            if (!Number.isFinite(ky)) {
                ky = 1;
            }
            if (proportionalScale) {
                const max = Math.max(Math.abs(kx), Math.abs(ky));
                kx = (Math.sign(kx) || 1) * max;
                ky = (Math.sign(ky) || 1) * max;
                if (Math.sign(kx * ky) === -1) {
                    // Constraint handles to its own diagonal
                    kx *= -1;
                }
                // Project an end point along a diagonal
                endUnrotated[0] = kx * startUnrotated[0];
                endUnrotated[1] = ky * startUnrotated[1];
            }
            if (!scaleSymmetrically) {
                kx = kx * 0.5 + 0.5;
                ky = ky * 0.5 + 0.5;
            }
            transformer.applyTranslateX = affixedData.startingTX;
            transformer.applyTranslateY = affixedData.startingTY;
            transformer.transformPivotX = affixedData.startingPX;
            transformer.transformPivotY = affixedData.startingPY;
            if (axes === 'x' || axes === 'xy') {
                transformer.applyScaleX = affixedData.startingSX * kx || 1;
                if (!scaleSymmetrically) {
                    // Shift the pivot and update the translate values of the transformer widget
                    // so entities slide in the specified direction,
                    // keeping the opposing side in its place
                    const shift = rotateRad(
                        endUnrotated[0] - startUnrotated[0],
                        0,
                        transformer.applyRotation
                    );
                    transformer.applyTranslateX += shift[0] / 2;
                    transformer.applyTranslateY += shift[1] / 2;
                    transformer.transformPivotX += shift[0] / 2;
                    transformer.transformPivotY += shift[1] / 2;
                }
            }
            if (axes === 'y' || axes === 'xy') {
                transformer.applyScaleY = affixedData.startingSY * ky || 1;
                if (!scaleSymmetrically) {
                    // Shift the pivot and update the translate values of the transformer widget
                    // so entities slide in the specified direction,
                    // keeping the opposing side in its place
                    const shift = rotateRad(
                        0,
                        endUnrotated[1] - startUnrotated[1],
                        transformer.applyRotation
                    );
                    transformer.applyTranslateX += shift[0] * 0.5;
                    transformer.applyTranslateY += shift[1] * 0.5;
                    transformer.transformPivotX += shift[0] * 0.5;
                    transformer.transformPivotY += shift[1] * 0.5;
                }
            }

            transformer.applyTransforms();
            if (this.riotEditor.refs.propertiesPanel) {
                this.riotEditor.refs.propertiesPanel.updatePropList();
            }
        },
        pointerup(e, roomTag, affixedData, callback) {
            this.dropPrecision();
            if (this.riotEditor.refs.propertiesPanel) {
                this.riotEditor.refs.propertiesPanel.updatePropList();
            }
            this.history.snapshotTransforms();
            callback();
        }
    }
};
