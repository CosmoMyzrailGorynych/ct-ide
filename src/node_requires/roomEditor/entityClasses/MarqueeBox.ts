import {RoomEditor} from '..';
import {getPixiSwatch} from '../../themes';

import * as PIXI from 'node_modules/pixi.js';

export class MarqueeBox extends PIXI.Graphics {
    editor: RoomEditor;
    constructor(editor: RoomEditor, x: number, y: number, width: number, height: number) {
        super();
        this.editor = editor;
        this.redrawBox(x, y, width, height);
    }
    redrawBox(x: number, y: number, width: number, height: number): void {
        const x1 = x,
              x2 = x + width,
              y1 = y,
              y2 = y + height;
        this.x = Math.min(x1, x2);
        this.y = Math.min(y1, y2);
        this.clear();
        this.lineStyle(3 * this.editor.camera.scale.x, getPixiSwatch('act'))
        .drawRoundedRect(0, 0, Math.abs(width), Math.abs(height), 0.1);
        this.lineStyle(this.editor.camera.scale.x, getPixiSwatch('background'))
        .drawRoundedRect(0, 0, Math.abs(width), Math.abs(height), 0.1);
    }
}
