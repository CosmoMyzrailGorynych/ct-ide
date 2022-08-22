import {getPixiSwatch} from '../../themes';
import {RoomEditor} from '..';

interface ICtViewport {
    width: number;
    height: number;
    x?: number;
    y?: number;
}

class Viewport extends PIXI.Graphics {
    view: ICtViewport;
    starting: boolean;
    startingIcon: PIXI.Graphics;
    editor: RoomEditor;

    constructor(view: ICtViewport, starting: boolean, editor: RoomEditor) {
        super();
        this.editor = editor;
        this.starting = starting;
        this.view = view;
        this.x = this.view.x ?? 0;
        this.y = this.view.y ?? 0;
        this.startingIcon = new PIXI.Graphics();
        this.startingIcon
        .lineStyle(2, getPixiSwatch('orange'), 1, 0.5)
        .moveTo(0, 0)
        .lineTo(17, 10)
        .lineTo(0, 20)
        .lineTo(0, 0)
        .closePath();
        this.startingIcon.y = 16;
        this.startingIcon.visible = this.starting;
        this.addChild(this.startingIcon);
        this.redrawFrame();
    }
    destroy(): void {
        this.editor.viewports.delete(this);
        super.destroy();
    }

    redrawFrame(): void {
        this.x = this.view.x ?? 0;
        this.y = this.view.y ?? 0;
        this.startingIcon.scale.set(this.editor.camera.scale.x);
        this.startingIcon.visible = this.starting &&
            (this.view.height / this.editor.camera.scale.x > 48);
        this.clear();
        this.lineStyle(4 * this.editor.camera.scale.x, getPixiSwatch('act'))
        .drawRoundedRect(0, 0, this.view.width, this.view.height, 0.1);
        this.lineStyle(2 * this.editor.camera.scale.x, getPixiSwatch('background'))
        .drawRoundedRect(0, 0, this.view.width, this.view.height, 0.1);
        this.startingIcon.x = this.view.width - (16 + 17) * this.editor.camera.scale.x;
        this.startingIcon.y = 16 * this.editor.camera.scale.y;
    }
}

export {Viewport};
