import {getPixiSwatch} from '../../themes';
import {RoomEditor} from '..';
import {ViewportFrame} from './ViewportFrame';

interface ICtViewport {
    width: number;
    height: number;
    x?: number;
    y?: number;
}

class Viewport extends ViewportFrame {
    view: ICtViewport;
    starting: boolean;

    constructor(view: ICtViewport, starting: boolean, editor: RoomEditor) {
        super(editor);
        this.starting = starting;
        this.view = view;
        this.x = this.view.x ?? 0;
        this.y = this.view.y ?? 0;
        this.icon
        .lineStyle(2, getPixiSwatch('orange'), 1, 0.5)
        .moveTo(0, 0)
        .lineTo(17, 10)
        .lineTo(0, 20)
        .lineTo(0, 0)
        .closePath();
        this.icon.visible = this.starting;
        this.addChild(this.icon);
        this.redrawFrame();
    }

    redrawFrame(): void {
        super.redrawFrame(this.view.width, this.view.height);
        this.x = this.view.x ?? 0;
        this.y = this.view.y ?? 0;
        this.icon.visible = this.starting &&
            (this.view.height / this.editor.camera.scale.x > 48);
    }
}

export {Viewport};
