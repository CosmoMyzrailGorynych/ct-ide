import {getPixiSwatch} from '../../themes';
import {RoomEditor} from '..';

import * as PIXI from 'pixi.js';

export class ViewportFrame extends PIXI.Graphics {
    icon: PIXI.Graphics;
    editor: RoomEditor;

    constructor(editor: RoomEditor) {
        super();
        this.editor = editor;
        this.icon = new PIXI.Graphics();
        this.icon.y = 16 * this.editor.camera.scale.y;
        this.addChild(this.icon);
    }
    destroy(): void {
        this.editor.viewports.delete(this);
        super.destroy();
    }

    redrawFrame(width: number, height: number): void {
        this.icon.scale.set(this.editor.camera.scale.x);
        this.clear();
        this
        .rect(0, 0, width, height)
        .stroke({
            width: 4 * this.editor.camera.scale.x,
            color: getPixiSwatch('act'),
            join: 'round'
        });
        this
        .rect(0, 0, width, height)
        .stroke({
            width: 2 * this.editor.camera.scale.x,
            color: getPixiSwatch('background'),
            join: 'round'
        });
        this.icon.x = width - (16 + 17) * this.editor.camera.scale.x;
        this.icon.y = 16 * this.editor.camera.scale.y;
    }
}
