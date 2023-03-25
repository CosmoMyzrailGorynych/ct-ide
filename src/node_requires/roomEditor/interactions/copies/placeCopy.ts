import {IRoomEditorInteraction, RoomEditor} from '../..';
import {Copy} from '../../entityClasses/Copy';

import {calcPlacement} from '../placementCalculator';

import {soundbox} from '../../../3rdparty/soundbox';

import * as PIXI from 'node_modules/pixi.js';

interface IAffixedData {
    mode: 'free' | 'straight';
    startPos: PIXI.IPoint;
    prevPos: PIXI.IPoint;
    prevLength: number;
    stepX: number;
    stepY: number;
    diagonalGrid: boolean;
    gridX: number;
    gridY: number;
    noGrid: boolean;
    created: Set<[Copy]>;
}

const createCopy = (
    pos: PIXI.IPoint,
    template: ITemplate,
    editor: RoomEditor,
    ghost?: boolean
) => new Copy({
    x: pos.x,
    y: pos.y,
    exts: {},
    customProperties: {},
    scale: {
        x: 1,
        y: 1
    },
    uid: template.uid,
    opacity: 1,
    rotation: 0,
    tint: 0xffffff
}, editor, ghost);

export const placeCopy: IRoomEditorInteraction<IAffixedData> = {
    ifListener: 'pointerdown',
    if(e: PIXI.FederatedPointerEvent, riotTag) {
        if (this.riotEditor.currentTool !== 'addCopies') {
            return false;
        }
        if (e.button !== 0) {
            return false;
        }
        return riotTag.currentTemplate && riotTag.currentTemplate !== -1;
    },
    listeners: {
        pointerdown(e: PIXI.FederatedPointerEvent, roomTag, affixedData) {
            this.compoundGhost.removeChildren();
            affixedData.created = new Set();
            // Two possible modes: placing in straight vertical/horizontal/diagonal lines
            // and in a free form, like drawing with a brush.
            // Straight method creates a ghost preview before actually creating all the copies,
            // while the free form places copies as a user moves their cursor.
            if (e.shiftKey) {
                affixedData.mode = 'straight';
                affixedData.prevLength = 1;
            } else {
                affixedData.mode = 'free';
            }
            affixedData.gridX = this.ctRoom.gridX;
            affixedData.gridY = this.ctRoom.gridY;
            affixedData.diagonalGrid = this.ctRoom.diagonalGrid;
            affixedData.startPos = affixedData.prevPos = this.snapTarget.position.clone();
            affixedData.noGrid = !roomTag.gridOn || roomTag.freePlacementMode;
            const newCopy = createCopy(
                affixedData.startPos,
                this.riotEditor.currentTemplate as ITemplate,
                this
            );
            affixedData.created.add([newCopy]);
            this.room.addChild(newCopy);
            affixedData.stepX = affixedData.stepY = 1;
            soundbox.play('Wood_Start');
        },
        pointermove(e: PIXI.FederatedPointerEvent, roomTag, affixedData) {
            this.cursor.update(e);
            affixedData.noGrid = !roomTag.gridOn || roomTag.freePlacementMode;
            const newPos = this.snapTarget.position.clone();
            const ghosts = calcPlacement(
                newPos,
                affixedData,
                ((position): Copy => {
                    soundbox.play('Wood_Start');
                    const copy = createCopy(
                        position,
                        this.riotEditor.currentTemplate as ITemplate,
                        this
                    );
                    this.room.addChild(copy);
                    affixedData.created.add([copy]);
                    return copy;
                })
            );
            // Play feedback sound on length change
            if (ghosts.length !== affixedData.prevLength) {
                affixedData.prevLength = ghosts.length;
                soundbox.play('Wood_Start');
            }
            // Remove excess ghost instances
            if (this.compoundGhost.children.length > ghosts.length) {
                this.compoundGhost.removeChildren(ghosts.length);
            }
            // Add missing ghost instances
            while (this.compoundGhost.children.length < ghosts.length) {
                this.compoundGhost.addChild(createCopy(
                    affixedData.startPos,
                    this.riotEditor.currentTemplate as ITemplate,
                    this,
                    true
                ));
            }
            for (let i = 0; i < ghosts.length; i++) {
                const ghost = this.compoundGhost.children[i];
                ghost.x = ghosts[i].x;
                ghost.y = ghosts[i].y;
            }
        },
        pointerup(e, roomTag, affixedData, callback) {
            if (affixedData.mode === 'straight') {
                // Replace all the preview copies with real ones
                for (const ghost of this.compoundGhost.children) {
                    const copy = createCopy(
                        ghost.position,
                        this.riotEditor.currentTemplate as ITemplate,
                        this
                    );
                    this.room.addChild(copy);
                    affixedData.created.add([copy]);
                }
            }
            soundbox.play('Wood_End');
            this.compoundGhost.removeChildren();
            this.history.pushChange({
                type: 'creation',
                created: affixedData.created
            });
            callback();
        }
    }
};

placeCopy.listeners.pointerupoutside = placeCopy.listeners.pointerup;
