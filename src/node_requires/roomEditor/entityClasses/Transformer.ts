import {RoomEditor} from '..';
import {Copy} from './Copy';
import {Tile} from './Tile';

import {getPixiSwatch} from '../../themes';
import {rotateCursor} from '../common';
import {ease} from 'node_modules/pixi-ease';

import {rotateRad, pdc} from '../../utils/trigo';

import * as PIXI from 'node_modules/pixi.js';

const nullPoint = {
    x: 0,
    y: 0
};
export const getAnchor = (obj: Copy | Tile): {x: number, y: number} => {
    if (obj instanceof Copy) {
        return obj.sprite?.anchor ?? obj.text?.anchor ?? nullPoint;
    }
    return obj.anchor;
};

export class Handle extends PIXI.Graphics {
    cursor: string;
    constructor() {
        super();
        this.beginFill(getPixiSwatch('act'));
        this.drawCircle(0, 0, 6);
        this.eventMode = 'static';
        this.cursor = 'pointer';
    }
}
type transformSubset = {
    x: number;
    y: number;
    scale: {
        x: number;
        y: number;
    };
    rotation: number;
}

export class Transformer extends PIXI.Container {
    handleTL = new Handle();
    handleTR = new Handle();
    handleT = new Handle();
    handleL = new Handle();
    handleR = new Handle();
    handleCenter = new Handle();
    handleBL = new Handle();
    handleBR = new Handle();
    handleB = new Handle();
    handleRotate = new Handle();
    scaleHandles = [
        this.handleTL,
        this.handleTR,
        this.handleT,
        this.handleL,
        this.handleR,
        this.handleBL,
        this.handleBR,
        this.handleB
    ];
    frame = new PIXI.Graphics();

    applyRotation: number;
    applyScaleX: number;
    applyScaleY: number;
    applyTranslateX: number;
    applyTranslateY: number;
    transformPivotX: number;
    transformPivotY: number;
    frameWidth: number;
    frameHeight: number;
    initialTransforms = new Map<PIXI.Container, transformSubset>();

    editor: RoomEditor;

    constructor(editor: RoomEditor) {
        super();
        this.editor = editor;
        this.handleRotate.cursor = rotateCursor;

        this.handleCenter.scale.set(1.25, 1.25);
        this.handleCenter.cursor = 'move';

        this.addChild(
            this.frame,
            this.handleTL,
            this.handleTR,
            this.handleT,
            this.handleL,
            this.handleR,
            this.handleCenter,
            this.handleBL,
            this.handleBR,
            this.handleB,
            this.handleRotate
        );
        this.setup();
    }

    setup(skipHistoryUpdate?: boolean): void {
        this.initialTransforms.clear();
        this.editor.clearSelectionOverlay();
        this.applyRotation = 0;
        this.applyScaleX = this.applyScaleY = 1;
        this.applyTranslateX = this.applyTranslateY = 0;
        if (this.editor.currentSelection.size === 0) {
            this.visible = false;
            return;
        }
        this.visible = true;

        let rect;
        for (const elt of this.editor.currentSelection) {
            const w = elt.width,
                  h = elt.height,
                  anchor = getAnchor(elt),
                  // IDK why this works
                  px = Math.sign(elt.scale.x) === -1 ? 1 - anchor.x : anchor.x,
                  py = Math.sign(elt.scale.y) === -1 ? 1 - anchor.y : anchor.y;
            const tl = rotateRad(-w * px, -h * py, elt.rotation),
                  tr = rotateRad(w * (1 - px), -h * py, elt.rotation),
                  bl = rotateRad(-w * px, h * (1 - py), elt.rotation),
                  br = rotateRad(w * (1 - px), h * (1 - py), elt.rotation);
            const x1 = Math.min(tl[0], bl[0], tr[0], br[0]),
                  x2 = Math.max(tl[0], bl[0], tr[0], br[0]),
                  y1 = Math.min(tl[1], bl[1], tr[1], br[1]),
                  y2 = Math.max(tl[1], bl[1], tr[1], br[1]);
            if (!rect) {
                rect = new PIXI.Rectangle(x1, y1, x2 - x1, y2 - y1);
                rect.x += elt.x;
                rect.y += elt.y;
            } else {
                const newRect = new PIXI.Rectangle(x1, y1, x2 - x1, y2 - y1);
                newRect.x += elt.x;
                newRect.y += elt.y;
                rect.enlarge(newRect);
            }
            this.initialTransforms.set(elt, {
                x: elt.x,
                y: elt.y,
                scale: {
                    x: elt.scale.x || 1,
                    y: elt.scale.y || 1
                },
                rotation: elt.rotation
            });
        }
        this.frameWidth = rect.width;
        this.frameHeight = rect.height;
        this.transformPivotX = rect.x + rect.width / 2;
        this.transformPivotY = rect.y + rect.height / 2;
        if (!skipHistoryUpdate) {
            this.editor.history.initiateTransformChange();
        }
        this.updateFrame();
    }
    clear(): void {
        this.editor.currentSelection.clear();
        this.setup(true);
    }

    applyTransforms(): void {
        for (const elt of this.editor.currentSelection) {
            const initial = this.initialTransforms.get(elt);
            const delta = {
                x: ((initial.x + this.applyTranslateX) - this.transformPivotX) * this.applyScaleX,
                y: ((initial.y + this.applyTranslateY) - this.transformPivotY) * this.applyScaleY
            };
            const rotatedDelta = rotateRad(delta.x, delta.y, this.applyRotation);
            elt.x = this.transformPivotX + rotatedDelta[0];
            elt.y = this.transformPivotY + rotatedDelta[1];
            elt.rotation = initial.rotation + this.applyRotation;

            // Skew isn't in ct.js, so something fancy is introduced as an alternative.
            // Works great at 0, 90, 180, 270 degrees.
            // Works q̴̿ͅu̵͈͑e̵̖͒s̵͈̎t̸̪̽i̶͈͌o̴̳͊ñ̶̪a̵͜͝b̶̮̈́ĺ̸̲y̸͒͜ on other angles.
            const flip = Math.sign(this.applyScaleX) !== Math.sign(this.applyScaleY) ? -1 : 1;
            const sin = Math.sin(initial.rotation),
                  cos = Math.cos(initial.rotation);

            elt.scale.set(
                initial.scale.x *
                (cos ** 2 * this.applyScaleX + sin ** 2 * this.applyScaleY * flip),
                initial.scale.y *
                (sin ** 2 * this.applyScaleX * flip + cos ** 2 * this.applyScaleY)
            );
            (elt as Copy).updateNinePatch?.();
        }
    }

    outlineSelected(): void {
        this.editor.drawSelection(this.editor.currentSelection);
    }
    updateFrame(): void {
        const halfDiagonalScaled = {
            x: this.frameWidth / 2 * this.applyScaleX / this.editor.camera.scale.x,
            y: this.frameHeight / 2 * this.applyScaleY / this.editor.camera.scale.y
        };
        // Compute position of four corners of the selection frame
        const TR = rotateRad(halfDiagonalScaled.x, -halfDiagonalScaled.y, this.applyRotation),
              TL = rotateRad(-halfDiagonalScaled.x, -halfDiagonalScaled.y, this.applyRotation),
              BR = rotateRad(halfDiagonalScaled.x, halfDiagonalScaled.y, this.applyRotation),
              BL = rotateRad(-halfDiagonalScaled.x, halfDiagonalScaled.y, this.applyRotation);
        const globalFrom = this.editor.room.toGlobal(new PIXI.Point(
            this.transformPivotX,
            this.transformPivotY
        ));

        TR[0] += globalFrom.x;
        TL[0] += globalFrom.x;
        BL[0] += globalFrom.x;
        BR[0] += globalFrom.x;
        TR[1] += globalFrom.y;
        TL[1] += globalFrom.y;
        BL[1] += globalFrom.y;
        BR[1] += globalFrom.y;

        // Move handles to appropriate places
        this.handleCenter.x = globalFrom.x;
        this.handleCenter.y = globalFrom.y;
        [this.handleTL.x, this.handleTL.y] = TL;
        [this.handleTR.x, this.handleTR.y] = TR;
        [this.handleBL.x, this.handleBL.y] = BL;
        [this.handleBR.x, this.handleBR.y] = BR;
        this.handleT.x = (TL[0] + TR[0]) / 2;
        this.handleT.y = (TL[1] + TR[1]) / 2;
        this.handleL.x = (TL[0] + BL[0]) / 2;
        this.handleL.y = (TL[1] + BL[1]) / 2;
        this.handleR.x = (TR[0] + BR[0]) / 2;
        this.handleR.y = (TR[1] + BR[1]) / 2;
        this.handleB.x = (BL[0] + BR[0]) / 2;
        this.handleB.y = (BL[1] + BR[1]) / 2;
        // Rotation handle is placed a bit outside the frame
        const shift = rotateRad(21 * Math.sign(this.applyScaleX), 0, this.applyRotation);
        this.handleRotate.x = this.handleR.x + shift[0];
        this.handleRotate.y = this.handleR.y + shift[1];

        // Hide middle handles if they're placed way too close to other elements
        if (pdc(TL[0], TL[1], BL[0], BL[1]) < 32 || pdc(TL[0], TL[1], TR[0], TR[1]) <= 16) {
            this.handleL.visible = this.handleR.visible = false;
        } else {
            this.handleL.visible = this.handleR.visible = true;
        }
        if (pdc(TL[0], TL[1], TR[0], TR[1]) < 32 || pdc(TL[0], TL[1], BL[0], BL[1]) <= 16) {
            this.handleT.visible = this.handleB.visible = false;
        } else {
            this.handleT.visible = this.handleB.visible = true;
        }

        this.frame.clear();
        // Outline the selected elements
        this.outlineSelected();
        // Draw the frame
        this.frame.lineStyle(4, getPixiSwatch('act'));
        this.frame.moveTo(TL[0] - 0.5, TL[1] - 0.5);
        this.frame.lineTo(TR[0] + 0.5, TR[1] - 0.5);
        this.frame.lineTo(BR[0] + 0.5, BR[1] + 0.5);
        this.frame.lineTo(BL[0] - 0.5, BL[1] + 0.5);
        this.frame.lineTo(TL[0] - 0.5, TL[1] - 0.5);
        this.frame.lineStyle(2, getPixiSwatch('background'));
        this.frame.moveTo(TL[0] - 0.5, TL[1] - 0.5);
        this.frame.lineTo(TR[0] + 0.5, TR[1] - 0.5);
        this.frame.lineTo(BR[0] + 0.5, BR[1] + 0.5);
        this.frame.lineTo(BL[0] - 0.5, BL[1] + 0.5);
        this.frame.lineTo(TL[0] - 0.5, TL[1] - 0.5);
    }

    blink(): void {
        this.alpha = 0;
        ease.add(this, {
            alpha: 1
        }, {
            duration: 150
        });
    }
}
