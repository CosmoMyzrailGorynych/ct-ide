import {getPixiTexture, getTexturePivot} from '../../resources/textures';
import {RoomEditor} from '..';
import {TileLayer} from './TileLayer';

import * as PIXI from 'node_modules/pixi.js';
import {RoomEditorPreview} from '../previewer';

/**
 * @extends PIXI.Sprite
 * @notice This class automatically adds and removes itself from editor's tile list
 */
class Tile extends PIXI.Sprite {
    tileTexture: assetRef;
    tileFrame: number;
    parent: TileLayer | null;
    editor: RoomEditor | RoomEditorPreview;
    isGhost: boolean;

    constructor(
        tileInfo: ITileTemplate,
        editor: RoomEditor | RoomEditorPreview,
        isGhost?: boolean
    ) {
        super(getPixiTexture(tileInfo.texture, tileInfo.frame, false));
        this.editor = editor;
        this.deserialize(tileInfo);
        this.isGhost = Boolean(isGhost);
        this.eventMode = this.isGhost ? 'none' : 'static';
        if (this.isGhost) {
            this.alpha *= 0.5;
        } else {
            editor.tiles.add(this);
        }
    }
    destroy(): void {
        if (!this.isGhost) {
            this.editor.tiles.delete(this);
        }
        super.destroy();
    }
    detach(): this {
        this.editor.tiles.delete(this);
        this.parent.removeChild(this);
        return this;
    }
    restore(parent: TileLayer): this {
        this.editor.tiles.add(this);
        parent.addChild(this);
        return this;
    }

    serialize(): ITileTemplate {
        return {
            x: this.x,
            y: this.y,
            opacity: this.alpha,
            tint: this.tint as number,
            scale: {
                x: this.scale.x,
                y: this.scale.y
            },
            frame: this.tileFrame,
            rotation: this.rotation,
            texture: this.tileTexture as string
        };
    }
    deserialize(tile: ITileTemplate): void {
        this.x = tile.x;
        this.y = tile.y;
        this.alpha = tile.opacity ?? 1;
        this.tint = tile.tint ?? 0xffffff;
        this.scale.x = tile.scale?.x ?? 1;
        this.scale.y = tile.scale?.y ?? 1;
        this.rotation = tile.rotation ?? 0;
        this.tileTexture = tile.texture;
        this.tileFrame = tile.frame;
        [this.anchor.x, this.anchor.y] = getTexturePivot(this.tileTexture);
    }
    refreshTexture(): void {
        const frame = getPixiTexture(this.tileTexture, this.tileFrame);
        if (frame) {
            this.texture = frame;
        } else {
            // eslint-disable-next-line no-console
            console.warn(`Frame ${this.tileFrame} does not exist in the texture ${this.tileTexture}. Removing the tile.`);
            // Invalid tile. Desintegrate!
            this.destroy();
        }
        [this.anchor.x, this.anchor.y] = getTexturePivot(this.tileTexture);
    }
}

export {Tile};
