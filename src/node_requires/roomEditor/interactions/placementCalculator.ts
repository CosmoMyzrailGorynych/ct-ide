/*
This code was separated for DRY principle, as almost the same code
is used while placing tiles and copies.

This code is intended to be used as part of pointermove event,
and returns a list of locations of ghost objects, which is not empty
only while using parallel placement.

During the free placement, it may call placeImmediately as a callback
when a new object should be placed.
*/

import {fromRectangular, fromDiagonal, toRectangular, toDiagonal} from '../common';
import {RoomEditor} from '..';

import * as PIXI from 'pixi.js';

type PlacementData = {
    mode: 'free' | 'straight' | 'rect';
    startPos: PIXI.IPoint;
    prevPos: PIXI.IPoint;
    prevLength: number;
    stepX: number;
    stepY: number;
    diagonalGrid: boolean;
    gridX: number;
    gridY: number;
    noGrid: boolean;
};

type ghostPoints = {
    x: number;
    y: number;
}[];
type ISimplePoint = {
    x: number;
    y: number;
};

// eslint-disable-next-line max-lines-per-function
export const calcPlacement = (
    newPos: PIXI.IPoint,
    editor: RoomEditor,
    affixedData: PlacementData,
    placeImmediately: (position: PIXI.IPoint) => void
): ghostPoints => {
    const from = affixedData.diagonalGrid ? fromDiagonal : fromRectangular;
    const to = affixedData.diagonalGrid ? toDiagonal : toRectangular;
    // Correct placement position based on step size.
    const newPosOnGrid = to(newPos, affixedData.gridX, affixedData.gridY),
          startPosOnGrid = to(affixedData.startPos, affixedData.gridX, affixedData.gridY);
    let newPosWSkips: ISimplePoint | PIXI.IPoint = from({
        x: newPosOnGrid.x - ((startPosOnGrid.x - newPosOnGrid.x) % affixedData.stepX),
        y: newPosOnGrid.y - ((startPosOnGrid.y - newPosOnGrid.y) % affixedData.stepY)
    }, affixedData.gridX, affixedData.gridY);
    newPosWSkips = new PIXI.Point(newPosWSkips.x, newPosWSkips.y);

    // Free placement (drawing)
    if (affixedData.mode === 'free') {
        // When working without a grid, place copies in a strip,
        // spacing of which depends on the grid size.
        if (affixedData.noGrid) {
            let dx = (newPos.x - affixedData.prevPos.x) / affixedData.gridX,
                dy = (newPos.y - affixedData.prevPos.y) / affixedData.gridY;
            const l = Math.sqrt(dx * dx + dy * dy);
            if (l >= 1) {
                dx /= l;
                dy /= l;
                const placeX = dx * affixedData.gridX + affixedData.prevPos.x,
                      placeY = dy * affixedData.gridY + affixedData.prevPos.y;
                const newPlace = new PIXI.Point(placeX, placeY);
                placeImmediately(newPlace);
                affixedData.prevPos = newPlace;
            }
            return [];
        }
        // Skip spawning if position on-grid didn't change from the previous frame.
        if (newPosWSkips.x === affixedData.prevPos.x && newPosWSkips.y === affixedData.prevPos.y) {
            return [];
        }
        placeImmediately(newPosWSkips as PIXI.Point);
        affixedData.prevPos = newPosWSkips as PIXI.Point;
        return [];
    }

    affixedData.prevPos = newPos;
    const startGrid = to(
        affixedData.startPos,
        affixedData.gridX,
        affixedData.gridY
    );
    const endGrid = to(
        newPos,
        affixedData.gridX,
        affixedData.gridY
    );
    const dx = Math.abs(startGrid.x - endGrid.x),
          dy = Math.abs(startGrid.y - endGrid.y);

    // Display a copy counter when placing items in a straight line or in a rectangle
    editor.ghostCounter.visible = true;
    editor.ghostCounter.scale.set(editor.camera.scale.x, editor.camera.scale.y);

    // Straight-line placement
    if (affixedData.mode === 'straight') {
        const straightEndGrid: ISimplePoint = {
            x: 0,
            y: 0
        };
        const angle = Math.atan2(dy, dx);
        if (Math.abs(angle) > Math.PI * 0.375 && Math.abs(angle) < Math.PI * 0.525) {
            // Seems to be a vertical line
            straightEndGrid.x = startGrid.x;
            straightEndGrid.y = endGrid.y;
        } else if (Math.abs(angle) < Math.PI * 0.125) {
            // Seems to be a horizontal line
            straightEndGrid.x = endGrid.x;
            straightEndGrid.y = startGrid.y;
        } else {
            // It is more or so diagonal
            const max = Math.max(dx, dy);
            straightEndGrid.x = endGrid.x > startGrid.x ?
                startGrid.x + max :
                startGrid.x - max;
            straightEndGrid.y = endGrid.y > startGrid.y ?
                startGrid.y + max :
                startGrid.y - max;
        }
        const incX = Math.sign(straightEndGrid.x - startGrid.x) * affixedData.stepX,
              incY = Math.sign(straightEndGrid.y - startGrid.y) * affixedData.stepY;
        const l = Math.max(dx / affixedData.stepX, dy / affixedData.stepY);
        const ghosts = [];
        // Calculate ghost positions
        for (let i = 0, {x, y} = startGrid;
            i <= l;
            i++, x += incX, y += incY
        ) {
            const localPos = from({
                x,
                y
            }, affixedData.gridX, affixedData.gridY);
            ghosts.push(localPos);
        }

        const count = ghosts.length + 1;
        if (editor.ghostCounter.text !== count.toString()) {
            editor.ghostCounter.text = count;
        }
        if (ghosts.length > 0) {
            const [firstGhost] = ghosts,
                  lastGhost = ghosts[ghosts.length - 1];
            editor.ghostCounter.position.set(
                (firstGhost.x + lastGhost.x) / 2,
                (firstGhost.y + lastGhost.y) / 2
            );
        } else {
            editor.ghostCounter.position.set(affixedData.startPos.x, affixedData.startPos.y);
        }

        return ghosts;
    }

    // Rectangle fill mode
    const left = Math.min(startGrid.x, endGrid.x),
          top = Math.min(startGrid.y, endGrid.y),
          right = Math.max(startGrid.x, endGrid.x),
          bottom = Math.max(startGrid.y, endGrid.y);
    const ghosts = [];
    for (let x = left; x <= right; x++) {
        for (let y = top; y <= bottom; y++) {
            const localPos = from({
                x,
                y
            }, affixedData.gridX, affixedData.gridY);
            ghosts.push(localPos);
        }
    }
    editor.ghostCounter.visible = true;
    const text = `${right - left + 1}×${bottom - top + 1}`;
    if (editor.ghostCounter.text !== text) {
        editor.ghostCounter.text = text;
    }
    const globalCenter = from({
        x: (left + right) / 2,
        y: (top + bottom) / 2
    }, affixedData.gridX, affixedData.gridY);
    editor.ghostCounter.position.set(globalCenter.x, globalCenter.y);
    return ghosts;
};
