import {Tile} from '../../entityClasses/Tile';
import {TileLayer} from '../../entityClasses/TileLayer';
import {IRoomEditorInteraction, RoomEditor} from '../..';
import {calcPlacement} from '../placementCalculator';
import {ITilePatch} from './ITilePatch';

import {soundbox} from '../../../3rdparty/soundbox';

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
    created: Set<[Tile, TileLayer]>;
}

interface ISimplePoint {
    x: number;
    y: number;
}

const createTile = (
    pos: ISimplePoint,
    texture: string,
    frame: number,
    editor: RoomEditor,
    ghost?: boolean
) => new Tile({
    x: pos.x,
    y: pos.y,
    scale: {
        x: 1,
        y: 1
    },
    opacity: 1,
    rotation: 0,
    tint: 0xffffff,
    frame,
    texture
}, editor, ghost);

export const createTilePatch = (
    tilePatch: ITilePatch,
    startPos: ISimplePoint,
    editor: RoomEditor,
    ghost?: boolean
): Tile[] => {
    const tiles: Tile[] = [];
    const {texture} = tilePatch;
    for (let x = 0; x < tilePatch.spanX; x++) {
        for (let y = 0; y < tilePatch.spanY; y++) {
            const frame = x + tilePatch.startX +
                (y + tilePatch.startY) * texture.grid[0];
            tiles.push(createTile({
                x: startPos.x + x * texture.width,
                y: startPos.y + y * texture.height
            }, texture.uid, frame, editor, ghost));
        }
    }
    return tiles;
};

export const placeTile: IRoomEditorInteraction<IAffixedData> = {
    ifListener: 'pointerdown',
    if(e, riotTag) {
        if (this.riotEditor.currentTool !== 'addTiles') {
            return false;
        }
        if (e.data.button !== 0) {
            return false;
        }
        if (!this.riotEditor.currentTileLayer) {
            window.alertify.error(window.languageJSON.roomTiles.addTileLayerFirst);
            return false;
        }
        return Boolean(riotTag.tilePatch?.texture);
    },
    listeners: {
        pointerdown(e, riotTag, affixedData) {
            this.compoundGhost.removeChildren();
            affixedData.created = new Set();
            // Two possible modes: placing in straight vertical/horizontal/diagonal lines
            // and in a free form, like drawing with a brush.
            // Straight method creates a ghost preview before actually creating all the copies,
            // while the free form places copies as a user moves their cursor.
            if (e.data.originalEvent.shiftKey) {
                affixedData.mode = 'straight';
                affixedData.prevLength = 1;
            } else {
                affixedData.mode = 'free';
            }
            affixedData.gridX = this.ctRoom.gridX;
            affixedData.gridY = this.ctRoom.gridY;
            const {texture} = riotTag.tilePatch;
            // Allow skipping grid cells if texture's and room's grids match
            if (this.ctRoom.gridX === texture.width && this.ctRoom.gridY === texture.height) {
                affixedData.stepX = riotTag.tilePatch.spanX;
                affixedData.stepY = riotTag.tilePatch.spanY;
            } else {
                affixedData.stepX = affixedData.stepY = 1;
            }
            affixedData.diagonalGrid = this.ctRoom.diagonalGrid;
            affixedData.noGrid = !riotTag.gridOn || riotTag.freePlacementMode;
            affixedData.startPos = affixedData.prevPos = this.snapTarget.position.clone();
            const newTiles = createTilePatch(
                riotTag.tilePatch,
                affixedData.startPos,
                this
            );
            riotTag.currentTileLayer.addChild(...newTiles);
            for (const tile of newTiles) {
                affixedData.created.add([tile, tile.parent]);
            }
            soundbox.play('Wood_Start');
        },
        pointermove(e, riotTag, affixedData) {
            affixedData.noGrid = !riotTag.gridOn || riotTag.freePlacementMode;
            const newPos = this.snapTarget.position.clone();
            const ghosts = calcPlacement(
                newPos,
                affixedData,
                (position => {
                    soundbox.play('Wood_Start');
                    const newTiles = createTilePatch(
                        riotTag.tilePatch,
                        position,
                        this
                    );
                    riotTag.currentTileLayer.addChild(...newTiles);
                    for (const tile of newTiles) {
                        affixedData.created.add([tile, tile.parent]);
                    }
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
            // Tile patches are grouped into containers
            while (this.compoundGhost.children.length < ghosts.length) {
                const ghostTilePatch = new PIXI.Container();
                ghostTilePatch.addChild(...createTilePatch(riotTag.tilePatch, {
                    x: 0,
                    y: 0
                }, this, true));
                this.compoundGhost.addChild(ghostTilePatch);
            }
            // Reposition ghost containers
            for (let i = 0; i < ghosts.length; i++) {
                const ghost = this.compoundGhost.children[i];
                ghost.x = ghosts[i].x;
                ghost.y = ghosts[i].y;
            }
        },
        pointerup(e, riotTag, affixedData, callback) {
            if (affixedData.mode === 'straight') {
                // Replace all the preview copies with real ones
                for (const ghost of this.compoundGhost.children) {
                    const newTiles = createTilePatch(
                        riotTag.tilePatch,
                        ghost.position,
                        this
                    );
                    riotTag.currentTileLayer.addChild(...newTiles);
                    for (const tile of newTiles) {
                        affixedData.created.add([tile, tile.parent]);
                    }
                }
            }
            soundbox.play('Wood_End');
            this.compoundGhost.removeChildren();
            this.stage.interactive = true; // Causes to rediscover nested elements
            if (affixedData.created.size) {
                this.history.pushChange({
                    type: 'creation',
                    created: affixedData.created
                });
            }
            callback();
        }
    }
};

placeTile.listeners.pointerupoutside = placeTile.listeners.pointerup;
