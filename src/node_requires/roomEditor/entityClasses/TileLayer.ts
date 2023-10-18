import {Tile} from './Tile';
import {RoomEditor} from '..';
import {RoomEditorPreview} from '../previewer';

import * as PIXI from 'node_modules/pixi.js';

let idCounter = 0;

export const resetCounter = (): void => {
    idCounter = 0;
};

export class TileLayer extends PIXI.Container {
    extends: Record<string, unknown>;
    children: Tile[];
    editor: RoomEditor | RoomEditorPreview;
    id: number;
    constructor(tileLayer: ITileLayerTemplate, editor: RoomEditor | RoomEditorPreview) {
        super();
        this.editor = editor;
        this.id = idCounter++;
        this.deserialize(tileLayer);
    }
    destroy(): void {
        if (this.parent) {
            this.parent.removeChild(this);
        }
        const ind = this.editor.tileLayers.indexOf(this);
        if (ind !== -1) {
            this.editor.tileLayers.splice(ind, 1);
        }
        super.destroy({
            children: true
        });
    }
    detach(writeToHistory?: boolean): this {
        const ind = this.editor.tileLayers.indexOf(this);
        if (ind !== -1) {
            // eslint-disable-next-line no-console
            console.warn('Detaching a layer that was not in the editor\'s tileLayer list', this);
            this.editor.tileLayers.splice(ind, 1);
        }
        for (const tile of this.children) {
            this.editor.tiles.delete(tile);
        }
        this.parent.removeChild(this);
        if (writeToHistory && this.editor instanceof RoomEditor) {
            this.editor.history.pushChange({
                type: 'tileLayerDeletion',
                deleted: this
            });
        }
        return this;
    }
    restore(): this {
        this.editor.addTileLayer(this);
        return this;
    }
    get isHidden(): boolean {
        return this.alpha === 0;
    }
    hide(): void {
        this.alpha = 0;
    }
    show(): void {
        this.alpha = 1;
    }
    showToggle(): boolean {
        if (this.alpha === 0) {
            this.alpha = 1;
        } else {
            this.alpha = 0;
        }
        return this.isHidden;
    }
    serialize(): ITileLayerTemplate {
        return {
            depth: this.zIndex,
            tiles: this.children.map(c => c.serialize()),
            extends: this.extends,
            hidden: !this.visible
        };
    }
    deserialize(tileLayer: ITileLayerTemplate): void {
        this.zIndex = tileLayer.depth;
        this.extends = tileLayer.extends || {};
        for (const tile of tileLayer.tiles) {
            const pixiTile = new Tile(tile, this.editor);
            this.addChild(pixiTile);
        }
    }
}
