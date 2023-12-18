import {getPixiSwatch} from '../../themes';
import {RoomEditor} from '..';

import * as PIXI from 'node_modules/pixi.js';

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
        this.lineStyle(4 * this.editor.camera.scale.x, getPixiSwatch('act'))
        .drawRoundedRect(0, 0, width, height, 0.1);
        this.lineStyle(2 * this.editor.camera.scale.x, getPixiSwatch('background'))
        .drawRoundedRect(0, 0, width, height, 0.1);
        this.icon.x = width - (16 + 17) * this.editor.camera.scale.x;
        this.icon.y = 16 * this.editor.camera.scale.y;
    }
}
