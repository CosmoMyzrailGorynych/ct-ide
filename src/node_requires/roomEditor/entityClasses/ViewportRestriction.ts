import {getPixiSwatch} from '../../themes';
import {RoomEditor} from '..';
import {ViewportFrame} from './ViewportFrame';

export class ViewportRestriction extends ViewportFrame {
    editor: RoomEditor;
    constructor(editor: RoomEditor) {
        super(editor);
        this.x = this.editor.ctRoom.restrictMinX;
        this.y = this.editor.ctRoom.restrictMinY;
        this.icon
        .lineStyle(2, getPixiSwatch('orange'), 1, 0.5);
        this.icon.drawRect(0, 10, 20, 14);
        this.icon.arc(10, 6, 6, Math.PI, Math.PI * 2);
        this.icon.moveTo(10, 14);
        this.icon.lineTo(10, 20);
        this.icon.moveTo(4, 6);
        this.icon.lineTo(4, 10);
        this.icon.moveTo(4 + 12, 6);
        this.icon.lineTo(4 + 12, 10);
        this.icon.y = 16;
        this.redrawFrame();
    }

    redrawFrame(): void {
        if (!this.editor.ctRoom.restrictCamera) {
            this.visible = false;
            return;
        }
        this.visible = true;
        this.x = this.editor.ctRoom.restrictMinX;
        this.y = this.editor.ctRoom.restrictMinY;
        let width = this.editor.ctRoom.restrictMaxX - this.editor.ctRoom.restrictMinX,
            height = this.editor.ctRoom.restrictMaxY - this.editor.ctRoom.restrictMinY;
        if (width < 0) {
            width = Math.abs(width);
            this.x = this.editor.ctRoom.restrictMaxX;
        }
        if (height < 0) {
            height = Math.abs(height);
            this.y = this.editor.ctRoom.restrictMaxY;
        }
        this.icon.visible = (height / this.editor.camera.scale.x > 48);
        super.redrawFrame(width, height);
    }
}

