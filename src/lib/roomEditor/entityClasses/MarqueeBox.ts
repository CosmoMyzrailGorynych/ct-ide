import {RoomEditor} from '..';
import {getPixiSwatch} from '../../themes';

import * as PIXI from 'pixi.js';

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
        this
        .clear()
        .rect(0, 0, Math.abs(width), Math.abs(height))
        .stroke({
            width: 3 * this.editor.camera.scale.x,
            color: getPixiSwatch('act'),
            join: 'round'
        })
        .rect(0, 0, Math.abs(width), Math.abs(height))
        .stroke({
            width: this.editor.camera.scale.x,
            color: getPixiSwatch('background'),
            join: 'round'
        });
    }
}
